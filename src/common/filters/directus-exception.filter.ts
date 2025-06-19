import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DirectusService } from 'src/directus/directus.service';

@Catch(HttpException)
export class DirectusExceptionFilter implements ExceptionFilter {
    constructor(private readonly directusService: DirectusService) { }

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        const response: any = exception.getResponse?.();
        console.log('DirectusExceptionFilter:', response);
        const code = response?.code || response?.error || exception['code'];

        // 👉 Nếu token hết hạn
        if (code === 'TOKEN_EXPIRED') {
            const refreshToken = req.cookies?.refresh_token;
            console.log('refreshToken:', refreshToken);
            if (refreshToken) {
                try {
                    const authResponse = await this.directusService.refreshToken(refreshToken);

                    // 👇 Set lại access_token vào cookie
                    res.cookie('access_token', authResponse.access_token, {
                        httpOnly: true,
                        secure: false,
                        maxAge: 1000 * 60 * 10, // 10 phút
                        sameSite: 'lax',
                    });

                    return res.redirect(req.originalUrl);
                } catch (refreshError) {
                    // Nếu refresh token không hợp lệ → xoá cookie và redirect login
                    res.clearCookie('access_token');
                    res.clearCookie('refresh_token');
                    const msg = encodeURIComponent('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                    return res.redirect(`/auth/login?error=${msg}`);
                }
            }

            // Không có refresh token → redirect login
            res.clearCookie('access_token');
            const msg = encodeURIComponent('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return res.redirect(`/auth/login?error=${msg}`);
        }


        if (code === 'FORBIDDEN') {
            const msg = encodeURIComponent('Bạn cần đăng nhập để truy cập.');
            return res.redirect(`/auth/login?error=${msg}`);
        }

        if (code === 'INVALID_CREDENTIALS') {
            const error = encodeURIComponent('Sai email hoặc mật khẩu');
            return res.redirect(`/auth/login?error=${error}`);
        }

        return res.status(500).render('error', {
            title: 'Lỗi hệ thống',
            message: response?.message || 'Đã xảy ra lỗi không xác định.',
        });
    }
}
