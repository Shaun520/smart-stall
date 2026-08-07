import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true, // 自动添加createdAt和updatedAt字段
})
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, unique: true })
  phone: string;
  @Prop({
    default:
      'https://tse3-mm.cn.bing.net/th/id/OIP-C.z3QtNEkCos83AUzIlLiBqwHaDm?w=312&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=2&pid=1.7&rm=3',
  })
  avatar: string;
  @Prop({ required: true, default: '男' })
  gender: string;
  @Prop({ default: '' })
  email: string;
  @Prop({ default: '' })
  sign: string;
  @Prop({ default: false })
  @Prop()
  nickname: string;
}

export const userSchema = SchemaFactory.createForClass(User);
