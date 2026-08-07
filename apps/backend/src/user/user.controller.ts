import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Redirect,
  Request,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

import { Public } from 'src/auth/decorators/public.decorator';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //注册用户
  @Public()
  @Post('/register')
  @Redirect('/stall/auth/register-with-code', 307) // POST 308是永久重定向，307是临时重定向
  register() {
    return;
  }

  @Public()
  @Post('/code')
  @Redirect('/stall/auth/send-register-code', 307) // POST 308是永久重定向，307是临时重定向
  sendCode() {
    return;
  }

  //获取用户信息
  @Get('/info')
  @Redirect('/stall/auth/profile', 302) // GET 301是永久重定向，302是临时重定向
  info() {
    return;
  }

  //修改用户信息
  @Put()
  async modify(@Request() req, @Body() userInfo: User) {
    try {
      return await this.userService.modify(req.user._id, userInfo);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  //登录
  @Public()
  @Post('/login')
  @Redirect('/stall/auth/login', 307) // POST 308是永久重定向，307是临时重定向
  login() {
    return;
  }
}
