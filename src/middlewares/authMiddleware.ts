import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export function authMiddleware(
    request: Request,
    _response: Response,
    next: NextFunction
): void {
     const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token JWT ausente. Faça login para obter o token.', 401);
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        throw new AppError('Formato do token inválido. Use: Bearer <token>', 401);
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET as string);
        const { sub } = decoded as TokenPayload;
        request.user = { id: Number(sub) };
         return next();
    } catch {
        throw new AppError('Token JWT inválido ou expirado.', 401);
    }
}
