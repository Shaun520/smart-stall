import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true, // 自动添加createdAt和updatedAt字段
})
export class Message {
  @Prop({ required: true })
  conversationId: string; //会话Id
  @Prop({ required: true })
  senderId: string; //发送者Id     -1:ai消息    _id:用户Id
  @Prop({ required: true, default: 1 })
  type: string; // 1.ai对话 2.私聊 3.群聊
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  receiverId: string; //接收者Id
  image: string | Array<string>;
}

export const messageSchema = SchemaFactory.createForClass(Message);
