import { Module } from '@nestjs/common';
import { DirectusService } from './directus.service';
import { DirectusTokenMiddleware } from 'src/directus/directusTokenMiddleware';

@Module({
    providers: [DirectusService, DirectusTokenMiddleware],
    exports: [DirectusService, DirectusTokenMiddleware],
})
export class DirectusModule { }
