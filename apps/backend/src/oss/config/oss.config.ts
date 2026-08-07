// src/oss/config/oss.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('oss', () => ({
  region: process.env.OSS_REGION || 'oss-cn-beijing',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
}));
