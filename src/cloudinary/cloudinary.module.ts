import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './controller/cloudinary.controller';
import { CloudinaryService } from './service/cloudinary.service';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [CloudinaryService, CloudinaryProvider],
  controllers: [CloudinaryController],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
