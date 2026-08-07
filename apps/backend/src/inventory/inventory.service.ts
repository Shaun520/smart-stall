import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { Model } from 'mongoose';
import { CreateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<InventoryDocument>,
  ) {}

  // 新增
  async create(createInventoryDto: CreateInventoryDto, userId: string) {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    createdInventory.available = createInventoryDto.total;
    createdInventory.ordered = createdInventory.reserved = 0;
    createdInventory.userId = userId;
    return await createdInventory.save();
  }

  // 查询
  async findAll(userId: string) {
    return await this.inventoryModel.find({ userId }).exec();
  }
  // 查询单个
  async findOne(_id: string) {
    return await this.inventoryModel.findOne({ _id }).exec();
  }

  // 修改
  async update(
    _id: string,
    updateInventoryDto: CreateInventoryDto,
    userId: string,
  ) {
    return await this.inventoryModel.findOneAndUpdate(
      { _id, userId },
      updateInventoryDto,
      { new: true },
    );
  }
  // 删除
  async removeOne(_id: string, userId: string) {
    //删除库存
    await this.inventoryModel.deleteOne({ _id, userId }).exec();
  }
}
