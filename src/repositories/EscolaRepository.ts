import { AppDataSource } from '../database/data-source';
import { Escola } from '../entities/Escola';

export class EscolaRepository {
    private get repo() {
        return AppDataSource.getRepository(Escola);
    }

    async findAll(): Promise<Escola[]> {
        return this.repo.find({ order: { nome: 'ASC' } });
    }

    async findById(id: number): Promise<Escola | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByNome(nome: string): Promise<Escola | null> {
        return this.repo.findOne({ where: { nome } });
    }

    async create(data: Partial<Escola>): Promise<Escola> {
        const escola = this.repo.create(data);
        return this.repo.save(escola);
    }

    async save(escola: Escola): Promise<Escola> {
        return this.repo.save(escola);
    }

    async remove(escola: Escola): Promise<void> {
        await this.repo.remove(escola);
    }
}
