import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<TodoDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto, useId: string) {
    const createdTodo = new this.todoModel({ ...createTodoDto, userId: useId });
    return await createdTodo.save();
  }

  async getTodoList(useId: string) {
    return await this.todoModel.find({ userId: useId }).exec();
  }

  async editTodo(_id: string, createTodoDto: CreateTodoDto) {
    return await this.todoModel.findByIdAndUpdate(_id, createTodoDto, {
      new: true,
    });
  }

  async deleteTodo(_id: string) {
    return await this.todoModel.findByIdAndDelete(_id);
  }
}
