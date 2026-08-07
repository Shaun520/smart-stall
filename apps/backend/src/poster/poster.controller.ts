import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { PosterService } from './poster.service';
import { createPosterDto } from './dto/poster.dto';

@Controller('poster')
export class PosterController {
  constructor(private readonly posterService: PosterService) {}

  //新增海报
  @Post()
  async createPoster(@Body() body: createPosterDto, @Request() req) {
    try {
      return await this.posterService.createPoster(body, req.user._id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //获取我的海报列表
  @Get()
  async getMyPosters(@Request() req) {
    try {
      return await this.posterService.getMyPosters(req.user._id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //获取海报详情
  @Get(':id')
  async getPosterDetail(@Param('id') id: string) {
    try {
      return await this.posterService.getPosterDetail(id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  //编辑海报
  @Put(':id')
  async updatePoster(@Param('id') id: string, @Body() body: createPosterDto) {
    try {
      return await this.posterService.updatePoster(id, body);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //删除海报
  @Delete(':id')
  async deletePoster(@Param('id') id: string) {
    try {
      return await this.posterService.deletePoster(id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
