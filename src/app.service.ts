import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      title: 'Trang chủ SSR',
      message: 'Directus test!',
    };
  }
}
