import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  //新增Todo
  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    try {
      return await this.todoService.create(createTodoDto, req.user._id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //查询Todo列表
  @Get()
  async getTodoList(@Request() req) {
    try {
      return await this.todoService.getTodoList(req.user._id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //编辑Todo
  @Put(':id')
  async editTodo(
    @Param('id') id: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    try {
      return await this.todoService.editTodo(id, createTodoDto);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  //删除Todo
  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    try {
      return await this.todoService.deleteTodo(id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
