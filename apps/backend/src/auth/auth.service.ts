/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SmsService } from 'src/service/sms.service';
import { VerificationService } from 'src/service/verification.service';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constans';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationService,
    private readonly smsService: SmsService,
  ) {}

  async login(username: string, phone: string, password: string) {
    let user;
    if (phone) user = await this.userService.fineOneByPhone(phone, password);
    else if (username)
      user = await this.userService.fineOneByUsername(username, password);

    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }

    const { password: p, ...userInfo } = user.toObject();
    return {
      //过期时间10秒
      token: this.jwtService.sign(userInfo, { expiresIn: '1d' }),

      refreshToken: this.jwtService.sign(userInfo, { expiresIn: '30d' }),
    };
  }

  // 发送注册验证码
  async sendRegisterCode(phoneNumber: string) {
    //0. 检查手机号格式
    if (!phoneNumber) throw new BadRequestException('手机号不能为空');
    //标准的手机格式: 11位数字，以1开头,第二位大于2  例如 19237326195
    else if (
      !/^(1[3-9]\d{9})$/.test(phoneNumber) ||
      phoneNumber.length !== 11
    ) {
      throw new BadRequestException('手机号格式错误');
    }
    // 1. 检查手机号是否已注册
    const existingUser = await this.userService.findByPhone(phoneNumber);
    if (existingUser) {
      throw new ConflictException('该手机号已注册');
    }
    // 2. 可选：检查发送频率，防止短信轰炸
    // const hasSent = await this.verificationService.hasCode(
    //   'register',
    //   phoneNumber,
    // );
    // if (hasSent) {
    //   throw new BadRequestException('请求过于频繁，请稍后再试');
    // }

    // 3. 生成并存储验证码
    const code = this.verificationService.generateCode();
    await this.verificationService.storeCode('register', phoneNumber, code);

    // 4. 发送短信
    const sent = await this.smsService.sendVerificationCode(phoneNumber, code);
    console.log(code);
    if (sent) {
      return { success: true, message: '验证码发送成功' };
    } else {
      // 可以考虑此处删除已存储的验证码？
      throw new BadRequestException('验证码发送失败，请重试');
    }
  }

  // 用户注册
  async registerWithCode(phoneNumber: string, code: string) {
    // 1. 验证验证码
    const isValid = await this.verificationService.verifyCode(
      'register',
      phoneNumber,
      code,
    );
    if (!isValid) {
      throw new BadRequestException('验证码错误或已过期');
    }

    // 2. 再次确认手机号未被注册（防止并发请求）
    const existingUser = await this.userService.findByPhone(phoneNumber);
    if (existingUser) {
      throw new ConflictException('该手机号已注册');
    }

    // 3. 创建用户
    const user = await this.userService.create({
      username: Math.random().toString(36).substr(2, 8),
      phone: phoneNumber,
      password: Math.random().toString(36).substr(2, 8),
    });
    if (!user) {
      throw new BadRequestException('注册失败，请重试');
    }
    // 4. 生成JWT Token等后续逻辑
    const { password: p, ...userInfo } = user.toObject();

    return { message: '注册成功', token: this.jwtService.sign(userInfo) };
  }

  // 发送重置密码验证码（逻辑类似，但需要先检查用户存在）
  async sendResetPasswordCode(phoneNumber: string) {
    const user = await this.userService.findByPhone(phoneNumber);
    if (!user) {
      throw new BadRequestException('该手机号未注册');
    }
    // ... 其余逻辑与 sendRegisterCode 类似，但 businessType 为 'reset-pwd'
    // 2. 可选：检查发送频率，防止短信轰炸
    const hasSent = await this.verificationService.hasCode(
      'reset-pwd',
      phoneNumber,
    );
    if (hasSent) {
      throw new BadRequestException('请求过于频繁，请稍后再试');
    }
    // 3. 生成并存储验证码
    const code = this.verificationService.generateCode();
    await this.verificationService.storeCode('reset-pwd', phoneNumber, code);

    // 4. 发送短信
    const sent = await this.smsService.sendVerificationCode(phoneNumber, code);
    if (sent) {
      return { success: true, message: '验证码发送成功' };
    } else {
      // 可以考虑此处删除已存储的验证码？
      throw new BadRequestException('验证码发送失败，请重试');
    }
  }

  // 通过验证码重置密码
  async resetPasswordWithCode(
    phoneNumber: string,
    code: string,
    newPassword: string,
  ) {
    // 1. 验证验证码
    const isValid = await this.verificationService.verifyCode(
      'reset-pwd',
      phoneNumber,
      code,
    );
    if (!isValid) {
      throw new BadRequestException('验证码错误或已过期');
    }
    // 2. 更新密码
    await this.userService.updatePassword(phoneNumber, newPassword);
    return { message: '密码重置成功' };
  }

  // 刷新token
  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secret,
      });
      const { exp, iat, ...userInfo } = decoded;

      return {
        token: this.jwtService.sign(userInfo, { expiresIn: '1d' }),
        //过期时间10秒
        //refreshToken: this.jwtService.sign(userInfo),
      };
    } catch (err) {
      console.log(1, err);
      throw new UnauthorizedException('刷新失败，请重新登录');
    }
  }
}
