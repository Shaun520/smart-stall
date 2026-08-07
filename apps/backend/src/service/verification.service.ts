// verification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis'; // 或其他适配的注入方式
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
  // 验证码有效期，单位秒
  private readonly codeExpiration: number;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService,
  ) {
    this.codeExpiration = this.configService.get(
      'ALIYUN_SMS_CODE_EXPIRE_TIME',
      300,
    );
  }

  // 生成指定位数的随机数字验证码
  generateCode(length: number = 6): string {
    return Math.random()
      .toString()
      .slice(2, 2 + length);
  }

  // 存储验证码到Redis，key通常包含业务类型和手机号
  async storeCode(
    businessType: 'register' | 'reset-pwd',
    phoneNumber: string,
    code: string,
  ): Promise<void> {
    const key = `sms:verification:${businessType}:${phoneNumber}`;
    await this.redis.setex(key, this.codeExpiration, code); // SETEX 命令直接设置过期时间
  }

  // 从Redis获取验证码并验证
  async verifyCode(
    businessType: 'register' | 'reset-pwd',
    phoneNumber: string,
    inputCode: string,
  ): Promise<boolean> {
    const key = `sms:verification:${businessType}:${phoneNumber}`;
    const storedCode = await this.redis.get(key);

    if (!storedCode) {
      return false; // 验证码不存在或已过期
    }

    // 忽略大小写比较
    const isValid = storedCode.toLowerCase() === inputCode.toLowerCase();

    // 验证成功（无论成功与否），使该验证码失效，防止重放攻击
    if (isValid) {
      //await this.redis.del(key);
    }
    return isValid;
  }

  // 检查特定手机号是否已发送过验证码且未过期（用于频率控制）
  async hasCode(
    businessType: 'register' | 'reset-pwd',
    phoneNumber: string,
  ): Promise<boolean> {
    const key = `sms:verification:${businessType}:${phoneNumber}`;
    const ttl = await this.redis.ttl(key);
    return ttl > 0;
  }
}
