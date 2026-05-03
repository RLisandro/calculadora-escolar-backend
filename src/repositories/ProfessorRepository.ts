import { AppDataSource } from '../database/data-source';
import { Professor } from '../entities/Professor';

export class ProfessorRepository {
    private get repo() {
        return AppDataSource.getRepository(Professor);
    }

    async findByEmail(email: string): Promise<Professor | null> {
        return this.repo.findOne({ where: { email } });
    }

    async findByEmailWithPassword(email: string): Promise<Professor | null> {
        return this.repo.findOne({
            where: { email },
            select: ['id', 'nome', 'email', 'senha_hash'],
        });
    }

    async findById(id: number): Promise<Professor | null> {
        return this.repo.findOne({ where: { id } });
    }

    async create(data: Partial<Professor>): Promise<Professor> {
        const professor = this.repo.create(data);
        return this.repo.save(professor);
    }

    async save(professor: Professor): Promise<Professor> {
        return this.repo.save(professor);
    }

    async remove(professor: Professor): Promise<void> {
        await this.repo.remove(professor);
    }
}
