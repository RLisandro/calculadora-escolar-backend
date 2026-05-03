import { Request, Response } from 'express';
import { EscolaService } from '../services/EscolaService';

export class EscolaController {
    private service = new EscolaService();

    async create(request: Request, response: Response): Promise<Response> {
        const escola = await this.service.create(request.body);
        return response.status(201).json(escola);
    }

    async list(request: Request, response: Response): Promise<Response> { 
        const escolas = await this.service.findAll();
        return response.json(escolas);
    }

    async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const escola = await this.service.findById(Number(id));
        return response.json(escola);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const escola = await this.service.update(Number(id), request.body);
        return response.json(escola);
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        await this.service.delete(Number(id));
        return response.status(204).send();
    }
}
