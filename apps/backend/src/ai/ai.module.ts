import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import {
  doubaoImageUnderstandConfig,
  doubaoImageGenerateConfig,
  doubaoVideoGenerateConfig,
  bochaImageSearchConfig,
  commonConfig,
  deepseekTalkConfig,
} from './config/ai.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [
        commonConfig,
        doubaoImageUnderstandConfig,
        doubaoImageGenerateConfig,
        doubaoVideoGenerateConfig,
        bochaImageSearchConfig,
        deepseekTalkConfig,
      ],
      isGlobal: false,
    }),
  ],
  providers: [AIService, ConfigService],
  controllers: [AIController],
})
export class AIModule {}
