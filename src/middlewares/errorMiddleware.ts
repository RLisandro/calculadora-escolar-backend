import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorMiddleware(
    err: Error,
    _request: Request,
    response: Response,
    _next: NextFunction
): Response {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error('[ERRO INTERNO]', err);

    return response.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor.',
    });
}
