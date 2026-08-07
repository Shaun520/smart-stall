import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    //依赖注入
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  //注册
  async createOne(userInfo: CreateUserDTO) {
    const createdUser = new this.userModel(userInfo);
    createdUser.nickname = createdUser.username;
    await createdUser.save();
    return {};
  }

  //用户名登录
  async fineOneByUsername(username: string, password: string) {
    return await this.userModel.findOne({ username, password });
  }
  //手机号登录
  async fineOneByPhone(phone: string, password: string) {
    return await this.userModel.findOne({ phone, password });
  }
  //修改用户信息
  async modify(_id: string, userInfo: User) {
    //不返回密码
    return await this.userModel
      .findByIdAndUpdate(_id, { $set: userInfo }, { new: true })
      .select('-password');
  }
  //通过手机号查找用户
  findByPhone(phoneNumber: string) {
    //阻止事件默认

    return this.userModel.findOne({ phone: phoneNumber });
  }

  async create(userInfo: CreateUserDTO) {
    const createdUser = new this.userModel(userInfo);
    createdUser.nickname = createdUser.username;
    return await createdUser.save();
  }
  //修改密码
  updatePassword(phoneNumber: string, newPassword: string) {
    return this.userModel.updateOne(
      { phone: phoneNumber },
      { $set: { password: newPassword } },
    );
  }
}
