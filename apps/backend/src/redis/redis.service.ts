// src/redis/redis.service.ts
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // 设置键值对，并可设置过期时间（秒）
  async set(key: string, value: string | number, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl); // 使用 'EX' 选项设置过期时间
    } else {
      await this.redis.set(key, value);
    }
  }

  // 获取值
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  // 删除键
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // 检查键是否存在
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }
}
