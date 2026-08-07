import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  //新增库存
  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto, @Request() req) {
    try {
      return await this.inventoryService.create(
        createInventoryDto,
        req.user._id,
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  //查询库存
  @Get()
  async findAll(@Request() req) {
    try {
      return await this.inventoryService.findAll(req.user._id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  //查询单个库存
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.inventoryService.findOne(id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  //编辑库存
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: CreateInventoryDto,
    @Request() req,
  ) {
    try {
      return await this.inventoryService.update(
        id,
        updateInventoryDto,
        req.user._id,
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
  //删除库存
  @Delete(':id')
  async del(@Param('id') id: string, @Request() req) {
    try {
      return await this.inventoryService.removeOne(id, req.user._id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
