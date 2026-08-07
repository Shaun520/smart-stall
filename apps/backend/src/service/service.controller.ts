import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { FrtService } from './frt.service';
import { frtAddDTO, frtGetDTO, frtVerifyDTO } from './dto/service.dto';
import { AsrService } from './asr.service';

@Controller('service')
export class ServiceController {
  constructor(
    private readonly frtService: FrtService,
    private readonly asrService: AsrService,
  ) {}

  //新增人脸图
  @Post('/face/add')
  async addFace(@Body() body: frtAddDTO) {
    try {
      return await this.frtService.addFace(body);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //获取人脸信息
  @Post('/face/get')
  async getFace(@Body() body: frtGetDTO) {
    try {
      return await this.frtService.getFace(body);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //校验人脸
  @Post('/face/verify')
  async verifyFace(@Body() body: frtVerifyDTO) {
    try {
      return await this.frtService.verifyFace(body);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //语音识别
  @Post('/voice/recognize')
  async recognizeVoice(@Query('voice') voice: string) {
    try {
      return await this.asrService.recognizeVoice(voice);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // //语音合成
  // @SkipTransform()
  // @Get('/voice/synthesize')
  // async textToSpeech(@Query('text') text: string) {
  //   try {
  //     return await this.asrService.textToSpeech(text);
  //   } catch (e) {
  //     throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
