import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Professor } from '../entities/Professor';
import { ProfessorRepository } from '../repositories/ProfessorRepository';
import { AppError } from '../errors/AppError';

interface CreateProfessorDTO {
    nome: string;
    email: string;
    senha: string;
}

interface AuthenticateProfessorDTO {
    email: string;
    senha: string;
}

interface UpdateProfessorDTO {
    nome?: string;
    email?: string;
    senha?: string;
}

type ProfessorPublico = Omit<Professor, 'senha_hash'>;

export class ProfessorService {
    private repository = new ProfessorRepository();

    async create({ nome, email, senha }: CreateProfessorDTO): Promise<ProfessorPublico> {
        if (!nome || !email || !senha) {
            throw new AppError('Nome, email e senha são obrigatórios.');
        }

        const existing = await this.repository.findByEmail(email);
        if (existing) {
            throw new AppError('Este e-mail já está em uso.', 409);
        }

        const senha_hash = await hash(senha, 8);
        const professor = await this.repository.create({ nome, email, senha_hash });

        const { senha_hash: _, ...professorPublico } = professor as any;
        return professorPublico;
    }

    async authenticate({ email, senha }: AuthenticateProfessorDTO) {
        if (!email || !senha) {
            throw new AppError('E-mail e senha são obrigatórios.');
        }

        const professor = await this.repository.findByEmailWithPassword(email);
        if (!professor) {
            throw new AppError('Combinação de e-mail/senha incorreta.', 401);
        }

        const passwordMatched = await compare(senha, professor.senha_hash);
        if (!passwordMatched) {
            throw new AppError('Combinação de e-mail/senha incorreta.', 401);
        }

        const { senha_hash, ...professorPublico } = professor as any;

        const token = sign({}, process.env.JWT_SECRET as string, {
            subject: String(professor.id),
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        });

        return { professor: professorPublico, token };
    }

    async findById(id: number): Promise<ProfessorPublico> {
        const professor = await this.repository.findById(id);
        if (!professor) {
            throw new AppError('Professor não encontrado.', 404);
        }
        const { senha_hash, ...professorPublico } = professor as any;
        return professorPublico;
    }

    async update(id: number, { nome, email, senha }: UpdateProfessorDTO): Promise<ProfessorPublico> {
        const professor = await this.repository.findById(id);
        if (!professor) {
            throw new AppError('Professor não encontrado.', 404);
        }

        if (email && email !== professor.email) {
            const existing = await this.repository.findByEmail(email);
            if (existing) {
                throw new AppError('Este e-mail já está em uso.', 409);
            }
            professor.email = email;
        }

        if (nome) professor.nome = nome;
        if (senha) professor.senha_hash = await hash(senha, 8);

        const updated = await this.repository.save(professor);
        const { senha_hash, ...professorPublico } = updated as any;
        return professorPublico;
    }

    async delete(id: number): Promise<void> {
        const professor = await this.repository.findById(id);
        if (!professor) {
            throw new AppError('Professor não encontrado.', 404);
        }
        await this.repository.remove(professor);
    }
}
