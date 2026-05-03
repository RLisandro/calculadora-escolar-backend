import { Escola } from '../entities/Escola';
import { EscolaRepository } from '../repositories/EscolaRepository';
import { AppError } from '../errors/AppError';

interface CreateEscolaDTO {
    nome: string;
}

interface UpdateEscolaDTO {
    nome?: string;
}

export class EscolaService {
    private repository = new EscolaRepository();

    async create(data: CreateEscolaDTO): Promise<Escola> {
        if (!data.nome) {
            throw new AppError('O nome da escola é obrigatório.');
        }

        const existing = await this.repository.findByNome(data.nome);
        if (existing) {
            throw new AppError('Já existe uma escola cadastrada com esse nome.', 409);
        }

        return this.repository.create({ nome: data.nome });
    }

    async findAll(): Promise<Escola[]> {
        return this.repository.findAll();
    }

    async findById(id: number): Promise<Escola> {
        const escola = await this.repository.findById(id);
        if (!escola) {
            throw new AppError('Escola não encontrada.', 404);
        }
        return escola;
    }

    async update(id: number, data: UpdateEscolaDTO): Promise<Escola> {
        const escola = await this.repository.findById(id);
        if (!escola) {
            throw new AppError('Escola não encontrada.', 404);
        }

        if (data.nome && data.nome !== escola.nome) {
            const existing = await this.repository.findByNome(data.nome);
            if (existing) {
                throw new AppError('Já existe uma escola cadastrada com esse nome.', 409);
            }
        }

        Object.assign(escola, data);
        return this.repository.save(escola);
    }

    async delete(id: number): Promise<void> {
        const escola = await this.repository.findById(id);
        if (!escola) {
            throw new AppError('Escola não encontrada.', 404);
        }
        await this.repository.remove(escola);
    }
}
