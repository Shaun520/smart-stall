import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PosterDocument = HydratedDocument<Poster>;

@Schema({
  timestamps: true, // 自动添加createdAt和updatedAt字段
})
export class Poster {
  @Prop({ required: true })
  ownerId: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  size: string; // 1080X1920
  @Prop({ required: true })
  style: 'simple' | 'color' | 'minimalist' | 'retro'; //color,simple,minimalist,retro
  @Prop({ default: 0 })
  viewCount: number;
  @Prop({ default: 0 })
  downloadCount: number;
}

export const posterSchema = SchemaFactory.createForClass(Poster);
