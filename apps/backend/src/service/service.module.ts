import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { SmsService } from './sms.service';
import { VerificationService } from './verification.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  baiduFRTConfig,
  baiduASRConfig,
  baiduTTSConfig,
} from './config/service.config';
import { FrtService } from './frt.service';
import { AsrService } from './asr.service';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [baiduFRTConfig, baiduASRConfig, baiduTTSConfig],
      isGlobal: false,
    }),
  ],

  controllers: [ServiceController],
  providers: [
    SmsService,
    VerificationService,
    ConfigService,
    FrtService,
    AsrService,
  ],
  exports: [VerificationService, SmsService, FrtService, AsrService],
})
export class ServiceModule {}
