import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({
  timestamps: true, // 自动添加createdAt和updatedAt字段
})
export class Conversation {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  type: string;
}

export const conversationSchema = SchemaFactory.createForClass(Conversation);
