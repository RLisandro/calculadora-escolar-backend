import { Request, Response } from 'express';
import { CargaHorariaService } from '../services/CargaHorariaService';

export class CargaHorariaController {
    private service = new CargaHorariaService();

    async create(request: Request, response: Response): Promise<Response> {

        const {
            escola_id,
            periodosSemanais,
            duracaoPeriodo,
            semanasTrim1,
            semanasTrim2,
            semanasTrim3,
        } = request.body;

        const cargaHoraria = await this.service.create({
            escola_id,
            periodosSemanais,
            duracaoPeriodo,
            semanasTrim1,
            semanasTrim2,
            semanasTrim3,
            professor_id: request.user.id,
        });

        return response.status(201).json(cargaHoraria);
    }

    async list(request: Request, response: Response): Promise<Response> {
        const cargasHorarias = await this.service.listAll(request.user.id);
        return response.json(cargasHorarias);
    }

    async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const cargaHoraria = await this.service.findById(Number(id), request.user.id);
        return response.json(cargaHoraria);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const cargaHoraria = await this.service.update({
            id: Number(id),
            professor_id: request.user.id,
            ...request.body,
        });
        return response.json(cargaHoraria);
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        await this.service.delete(Number(id), request.user.id);
        return response.status(204).send();
    }
}
