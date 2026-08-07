import { Injectable } from '@nestjs/common';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderId: string) {
    const message = new this.messageModel(createMessageDto);
    message.senderId = createMessageDto.senderId || senderId;
    return await message.save();
  }

  async findAll(conversationId: string) {
    //按照时间顺序排序
    return await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 });
  }
}
