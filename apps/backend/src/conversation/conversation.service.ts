import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/conversation.dto';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}
  async getConversations(useId: string, type: string) {
    //按照时间逆序
    const conversations = await this.conversationModel
      .find({ userId: useId, type })
      .sort({ createdAt: -1 })
      .exec();
    return conversations;
  }
  async deleteConversation(id: string) {
    await this.conversationModel.findByIdAndDelete(id);
    return { message: '删除成功' };
  }
  async createConversation(
    createConversationDto: CreateConversationDto,
    userId: string,
  ) {
    return await this.conversationModel.create({
      userId,
      ...createConversationDto,
    });
  }
}
