import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { DirectusModule } from 'src/directus/directus.module';

@Module({
  imports: [
    DirectusModule
  ],
  controllers: [RegisterController],
  providers: [RegisterService]
})
export class RegisterModule { }
