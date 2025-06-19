import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DirectusService } from './directus.service';

@Injectable()
export class DirectusTokenMiddleware implements NestMiddleware {
    constructor(private readonly directusService: DirectusService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.access_token;
            if (token) {
                console.log(`Setting Directus token from cookie: ${token}`);
                await this.directusService.setToken(token);
            }

            // if (authHeader && authHeader.startsWith('Bearer ')) {
            //     const token = authHeader.substring(7); // Loại bỏ 'Bearer ' prefix
            //     console.log(`Setting Directus token: ${token}`);
            //     await this.directusService.setToken(token);
            // }

            next();
        } catch (error) {
            next(error);
        }
    }
}