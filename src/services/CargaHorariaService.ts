import { CargaHoraria } from '../entities/CargaHoraria';
import { CargaHorariaRepository } from '../repositories/CargaHorariaRepository';
import { EscolaRepository } from '../repositories/EscolaRepository';
import { AppError } from '../errors/AppError';

interface CreateCargaHorariaDTO {
    escola_id: number;
    periodosSemanais: number;
    duracaoPeriodo: number;
    semanasTrim1: number;
    semanasTrim2: number;
    semanasTrim3: number;
    professor_id: number;
}

interface UpdateCargaHorariaDTO {
    id: number;
    professor_id: number;
    escola_id?: number;
    periodosSemanais?: number;
    duracaoPeriodo?: number;
    semanasTrim1?: number;
    semanasTrim2?: number;
    semanasTrim3?: number;
}

interface HorasCalculadas {
    horasSemanal: number;
    horasTrim1: number;
    horasTrim2: number;
    horasTrim3: number;
    totalHoras: number;
}

interface DadosCalculo {
    periodosSemanais: number;
    duracaoPeriodo: number;
    semanasTrim1: number;
    semanasTrim2: number;
    semanasTrim3: number;
}

export class CargaHorariaService {
    private repository = new CargaHorariaRepository();
    private escolaRepository = new EscolaRepository();

    private calculateHours(data: DadosCalculo): HorasCalculadas {
        const horasSemanal = (data.periodosSemanais * data.duracaoPeriodo) / 60;
        const horasTrim1 = parseFloat((horasSemanal * data.semanasTrim1).toFixed(2));
        const horasTrim2 = parseFloat((horasSemanal * data.semanasTrim2).toFixed(2));
        const horasTrim3 = parseFloat((horasSemanal * data.semanasTrim3).toFixed(2));
        const totalHoras = parseFloat((horasTrim1 + horasTrim2 + horasTrim3).toFixed(2));
        return {
            horasSemanal: parseFloat(horasSemanal.toFixed(2)),
            horasTrim1,
            horasTrim2,
            horasTrim3,
            totalHoras,
        };
    }

    async create(data: CreateCargaHorariaDTO): Promise<CargaHoraria> {
        if (!data.escola_id) {
            throw new AppError('O campo escola_id é obrigatório.');
        }

        if (data.periodosSemanais <= 0 || data.duracaoPeriodo <= 0) {
            throw new AppError('Períodos semanais e duração do período devem ser maiores que zero.');
        }

        if (data.semanasTrim1 < 0 || data.semanasTrim2 < 0 || data.semanasTrim3 < 0) {
            throw new AppError('O número de semanas não pode ser negativo.');
        }

        const escola = await this.escolaRepository.findById(data.escola_id);
        if (!escola) {
            throw new AppError('Escola não encontrada. Cadastre a escola antes de criar a carga horária.', 404);
        }

        const calculated = this.calculateHours(data);
        const savedCarga = await this.repository.create({ ...data, ...calculated });

        // Carrega a relação com a escola para o retorno formatado
        return this.repository.findByIdAndProfessor(savedCarga.id, data.professor_id) as Promise<CargaHoraria>;
    }

    async listAll(professor_id: number): Promise<CargaHoraria[]> {
        return this.repository.findAllByProfessor(professor_id);
    }

    async findById(id: number, professor_id: number): Promise<CargaHoraria> {
        const carga = await this.repository.findByIdAndProfessor(id, professor_id);
        if (!carga) {
            throw new AppError('Carga horária não encontrada.', 404);
        }
        return carga;
    }

    async update(data: UpdateCargaHorariaDTO): Promise<CargaHoraria> {
        const carga = await this.repository.findByIdAndProfessor(data.id, data.professor_id);
        if (!carga) {
            throw new AppError('Carga horária não encontrada.', 404);
        }

        if (data.escola_id) {
            const escola = await this.escolaRepository.findById(data.escola_id);
            if (!escola) {
                throw new AppError('Escola não encontrada.', 404);
            }
        }

        const { id, professor_id, ...updateFields } = data;
        Object.assign(carga, updateFields);

        const needsRecalc =
            data.periodosSemanais !== undefined ||
            data.duracaoPeriodo !== undefined ||
            data.semanasTrim1 !== undefined ||
            data.semanasTrim2 !== undefined ||
            data.semanasTrim3 !== undefined;

        if (needsRecalc) {
            Object.assign(carga, this.calculateHours(carga));
        }

        return this.repository.save(carga);
    }

    async delete(id: number, professor_id: number): Promise<void> {
        const carga = await this.repository.findByIdAndProfessor(id, professor_id);
        if (!carga) {
            throw new AppError('Carga horária não encontrada.', 404);
        }
        await this.repository.remove(carga);
    }
}
