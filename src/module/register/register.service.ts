import { createItem, readItems } from '@directus/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { DirectusService } from 'src/directus/directus.service';
import { createRegisterDto } from 'src/module/register/register.dto';

@Injectable()
export class RegisterService {
    constructor(
        @Inject() private readonly directusService: DirectusService
    ) { }

    async postRegister(registerData: createRegisterDto) {
        console.log('Register data received:', registerData);
        try {
            const client = this.directusService.getClient();
            const response = await client.request(
                createItem('register', registerData)
            )
            console.log('Register item created successfully:', response);
            return {
                message: 'Đăng ký thành công',
                data: response,
            };
        } catch (error) {
            const firstError = error?.errors?.[0];
            // const code = firstError?.extensions?.code;

            // // Mapping một số lỗi phổ biến
            // if (code === 'RECORD_NOT_UNIQUE' && firstError.message.includes('email')) {
            //     throw new Error('Email này đã được đăng ký trước đó.');
            // }

            throw new Error(firstError?.message || 'Lỗi hệ thống, vui lòng thử lại.');
        }
    }

    async getTotalRegisters(): Promise<number> {
        const client = this.directusService.getClient();
        const response = await client.request(
            readItems('register', {
                filter: {
                    status: { _eq: 'confirmed' },
                },
            })
        );
        return response.length
    }

    async getTop10Registers(): Promise<any[]> {
        const client = this.directusService.getClient();
        const response = await client.request(
            readItems('register', {
                limit: 10,
                filter: {
                    status: { _eq: 'confirmed' },
                },
                sort: ['-NAV'],
            })
        );
        return response;
    }
}