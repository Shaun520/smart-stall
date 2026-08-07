import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //新增消息
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    try {
      return await this.messageService.create(createMessageDto, req.user._id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //获取消息列表
  @Get()
  async findAll(@Query('conversationId') conversationId: string) {
    try {
      return await this.messageService.findAll(conversationId);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
