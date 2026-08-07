import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  //新增会话
  @Post()
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req,
  ) {
    try {
      return await this.conversationService.createConversation(
        createConversationDto,
        req.user._id,
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //获取会话列表: ai会话，私聊会话，群聊会话
  @Get()
  async getConversations(@Request() req, @Query('type') type: string) {
    try {
      return await this.conversationService.getConversations(
        req.user._id,
        type,
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //删除会话
  @Delete(':id')
  async deleteConversation(@Param('id') id: string) {
    try {
      return await this.conversationService.deleteConversation(id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
