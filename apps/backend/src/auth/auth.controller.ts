import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/user/dto/user.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    try {
      return this.authService.login(
        loginDTO.username,
        loginDTO.phone,
        loginDTO.password,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('send-register-code')
  async sendRegisterCode(@Body('phone') phone: string) {
    return this.authService.sendRegisterCode(phone);
  }

  @Public()
  @Post('register-with-code')
  async registerWithCode(
    @Body('phone') phone: string,
    @Body('code') code: string,
  ) {
    return this.authService.registerWithCode(phone, code);
  }

  @Public()
  @Post('send-reset-password-code')
  async sendResetPasswordCode(@Body('phone') phone: string) {
    return this.authService.sendResetPasswordCode(phone);
  }

  @Public()
  @Post('reset-password-with-code')
  async resetPasswordWithCode(
    @Body('phone') phone: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPasswordWithCode(phone, code, newPassword);
  }

  //刷新token
  @Public()
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
