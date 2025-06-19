import { Body, Controller, Get, Post, Query, Render, Res } from '@nestjs/common';
import { RegisterService } from './register.service';
import { createRegisterDto } from 'src/module/register/register.dto';
import { Response } from 'express';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    @Get()
    @Render('register')
    async getForm(@Query('success') success?: string,
        @Query('error') error?: string,
        @Query('full_name') full_name?: string,
        @Query('email') email?: string,
        @Query('phone') phone?: string,
        @Query('university') university?: string
    ) {
        const formData = { full_name, email, phone, university };
        const totalRegisters = await this.registerService.getTotalRegisters();
        const rawTopRegisters = await this.registerService.getTop10Registers();
        const topRegisters = rawTopRegisters.map((r) => ({
            ...r,
            formattedNAV: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0
            }).format(r.NAV || 0),
        }));
        return {
            ...(success ? { message: 'Đăng ký thành công, chờ duyệt!' } : {}),
            ...(error ? { error: decodeURIComponent(error) } : {}),
            formData,
            totalRegisters,
            topRegisters,
        };
    }

    @Post()
    async handleRegister(
        @Body() body: createRegisterDto,
        @Res() res: Response
    ) {
        try {
            await this.registerService.postRegister(body);
            const queryData = new URLSearchParams({
                success: 'true',
                ...body, // spread các input: full_name, email, phone, university
            }).toString();
            return res.redirect(`/register?${queryData}`);
        } catch (err) {
            const msg = encodeURIComponent(err.message || 'Đăng ký thất bại');
            const queryData = new URLSearchParams({
                error: msg,
                ...body,
            }).toString();

            return res.redirect(`/register?${queryData}`);
        }
    }
}
