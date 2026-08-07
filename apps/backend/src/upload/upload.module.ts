// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { OssService } from '../oss/oss.service';
import { ConfigModule } from '@nestjs/config';
import ossConfig from '../oss/config/oss.config';

@Module({
  imports: [ConfigModule.forFeature(ossConfig)],
  controllers: [UploadController],
  providers: [OssService],
  exports: [OssService],
})
export class UploadModule {}
