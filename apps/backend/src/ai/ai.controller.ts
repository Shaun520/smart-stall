import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AIService } from './ai.service';
import {
  aiTalkDTO,
  imageGenerateDTO,
  imageSearchDTO,
  imageUnderstandDTO,
  videoGenerateDTO,
} from './dto/ai.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  //图片理解
  @Post('image/understand')
  async understandImage(@Body() body: imageUnderstandDTO): Promise<any> {
    return this.aiService.understandImage(body);
  }
  //图片生成
  @Post('image/generate')
  async generateImage(@Body() body: imageGenerateDTO): Promise<any> {
    return this.aiService.generateImage(body);
  }
  //执行视频生成任务
  @Post('video/generate')
  async implmentGenerateVideoTask(
    @Body() body: videoGenerateDTO,
  ): Promise<any> {
    return this.aiService.implmentGenerateVideoTask(body);
  }
  //获取生成视频的结果
  @Get('video/generate/:id')
  async getGenerateVideoResult(@Param('id') id: string): Promise<any> {
    return this.aiService.getGenerateVideoResult(id);
  }

  //文本搜索图片
  @Post('image/search')
  async searchImage(@Body() body: imageSearchDTO): Promise<any> {
    return this.aiService.searchImage(body);
  }

  //ai对话
  @Post('chat')
  async chat(@Body() body: aiTalkDTO): Promise<any> {
    try {
      return await this.aiService.chat(body);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
