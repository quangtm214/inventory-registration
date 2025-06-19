import { Injectable } from '@nestjs/common';
import { createDirectus, rest, authentication, RestClient, DirectusClient, staticToken, AuthenticationData, refresh } from '@directus/sdk';
import type { Schema } from './schemas';

@Injectable()
export class DirectusService {
    private client = createDirectus<Schema>(process.env.DIRECTUS_URL || 'http://localhost:8055')
        .with(authentication('json'))
        .with(rest());

    async onModuleInit() {
        // const email = process.env.DIRECTUS_EMAIL
        // const password = process.env.DIRECTUS_PASSWORD
        const token = process.env.DIRECTUS_STATIC_ACCESS_TOKEN
        if (token) {
            try {
                // const auth = await this.client.login(email, password);
                await this.client.setToken(token);
                console.log('Directus client initialized with static token:', token);
            } catch (err) {
                console.error('Failed to login to Directus:', err.message);
            }
        } else {
            console.warn('Missing Directus credentials in .env');
        }
    }

    // async login(email: string, password: string): Promise<AuthenticationData> {
    //     const authResponse = await this.client.login(email, password);
    //     return authResponse;
    // }

    async setToken(token: string) {
        await this.client.setToken(token)
    }

    async refreshToken(refreshToken: string) {
        const authResponse = await this.client.request(
            refresh("json", refreshToken,)
        )
        this.client.setToken(authResponse.access_token);
        console.log('Token refreshed successfully:', authResponse);
        return authResponse;
    }

    getClient() {
        return this.client;
    }


}
