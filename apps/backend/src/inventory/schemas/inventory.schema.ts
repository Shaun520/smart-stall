import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({
  timestamps: true, // 自动添加createdAt和updatedAt字段
})
export class Inventory {
  @Prop({ required: true })
  userId: string; //   用户ID
  @Prop({ required: true })
  name: string; //   商品名称
  @Prop({ required: true })
  price: number; //   商品价格
  @Prop({ required: true })
  image: string; //   商品图片
  @Prop({ required: true, default: 0 })
  total: number; //   总库存
  @Prop({ required: true, default: 0 })
  available: number; //   可用库存
  @Prop({ required: true, default: 0 })
  reserved: number; //   预留库存
  @Prop({ required: true, default: 0 })
  ordered: number; //   已下单库存
  @Prop({ required: true, default: 0 })
  status: number; //   商品状态: 0-下架，1-上架

  @Prop()
  sku: string; //   商品SKU
  @Prop()
  sign: Array<string>; //   商品签名
  @Prop()
  description: string; //   商品描述
  @Prop()
  category: string; //   商品类别
  @Prop()
  remark: string; //   备注
}

export const inventorySchema = SchemaFactory.createForClass(Inventory);
