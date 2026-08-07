import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({
  timestamps: true, // 自动添加createdAt和updatedAt字段
})
export class Todo {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  startTime: string;
  @Prop({ required: true })
  endTime: string;
  @Prop({ required: true })
  tasks: string[];
}

export const todoSchema = SchemaFactory.createForClass(Todo);
