import { Request, Response } from 'express';
import { ProfessorService } from '../services/ProfessorService';

export class ProfessorController {
    private service = new ProfessorService();

    async register(request: Request, response: Response): Promise<Response> {
        const { nome, email, senha } = request.body;
        const professor = await this.service.create({ nome, email, senha });
        return response.status(201).json(professor);
    }

    async login(request: Request, response: Response): Promise<Response> {
        const { email, senha } = request.body;
        const result = await this.service.authenticate({ email, senha });
        return response.json(result);
    }

    async profile(request: Request, response: Response): Promise<Response> {
        const professor = await this.service.findById(request.user.id);
        return response.json(professor);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const professor = await this.service.update(request.user.id, request.body);
        return response.json(professor);
    }

    async delete(request: Request, response: Response): Promise<Response> {
        await this.service.delete(request.user.id);
        return response.status(204).send();
    }
}
