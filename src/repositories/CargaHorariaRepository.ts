import { AppDataSource } from '../database/data-source';
import { CargaHoraria } from '../entities/CargaHoraria';

export class CargaHorariaRepository {
    private get repo() {
        return AppDataSource.getRepository(CargaHoraria);
    }

    async findAllByProfessor(professor_id: number): Promise<CargaHoraria[]> {
        return this.repo.find({
            where: { professor_id },
            relations: ['escola'],
            order: { created_at: 'DESC' },
        });
    }

    async findByIdAndProfessor(id: number, professor_id: number): Promise<CargaHoraria | null> {
        return this.repo.findOne({
            where: { id, professor_id },
            relations: ['escola'],
        });
    }

    async create(data: Partial<CargaHoraria>): Promise<CargaHoraria> {
        const carga = this.repo.create(data);
        return this.repo.save(carga);
    }

    async save(carga: CargaHoraria): Promise<CargaHoraria> {
        return this.repo.save(carga);
    }

    async remove(carga: CargaHoraria): Promise<void> {
        await this.repo.remove(carga);
    }
}
