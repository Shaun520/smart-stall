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

  //登录查询：账号既可以是用户名，也可以是手机号
  async findOneByAccount(account: string, password: string) {
    //形如手机号就先按手机号匹配，否则先按用户名匹配；没命中再回退到另一种
    const isPhone = /^1[3-9]\d{9}$/.test(account);
    const primary = isPhone ? { phone: account } : { username: account };
    const fallback = isPhone ? { username: account } : { phone: account };

    const user = await this.userModel.findOne({ ...primary, password });
    return user ?? (await this.userModel.findOne({ ...fallback, password }));
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
