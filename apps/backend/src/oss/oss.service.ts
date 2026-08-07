// src/oss/oss.service.ts
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import OSS from 'ali-oss';
import { type ConfigType } from '@nestjs/config';
import ossConfig from './config/oss.config';

@Injectable()
export class OssService {
  private client: OSS;

  constructor(
    @Inject(ossConfig.KEY)
    private config: ConfigType<typeof ossConfig>,
  ) {
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId as string,
      accessKeySecret: config.accessKeySecret as string,
      bucket: config.bucket,
    });
  }

  async uploadBuffer(file: Express.Multer.File): Promise<string> {
    console.log(file);

    // 增强MP3文件类型识别
    const isMp3File =
      file.mimetype === 'audio/mpeg' ||
      file.mimetype === 'audio/mp3' ||
      file.originalname.toLowerCase().endsWith('.mp3') ||
      (file.mimetype.includes('audio/') &&
        file.originalname.toLowerCase().endsWith('.mp3'));

    // 扩展支持的文件类型，明确区分MP3
    if (
      !file.mimetype.match(
        /\/(jpg|jpeg|png|gif|pdf|mpeg|mp3|wav|aac|ogg|webm|pcm|x-pcm|octet-stream)$/,
      ) &&
      !file.originalname
        .toLowerCase()
        .match(/\.(jpg|jpeg|png|gif|pdf|mp3|wav|aac|pcm)$/)
    ) {
      throw new BadRequestException(
        '只支持图片、PDF和音频文件（mp3、wav、aac、pcm等）',
      );
    }

    // 针对MP3文件的特殊处理
    const maxSize = isMp3File
      ? 20 * 1024 * 1024 // MP3文件最大20MB
      : file.mimetype.startsWith('audio/') ||
          file.mimetype.includes('pcm') ||
          file.mimetype.includes('octet-stream') ||
          file.originalname.toLowerCase().endsWith('.pcm')
        ? 20 * 1024 * 1024 // 其他音频文件最大20MB
        : 5 * 1024 * 1024; // 非音频文件最大5MB

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new BadRequestException(
        `${isMp3File ? 'MP3文件' : '文件'}大小不能超过${maxSizeMB}MB`,
      );
    }

    try {
      // 确保MP3文件使用正确的扩展名
      let fileExtension = file.originalname.split('.').pop() || 'mp3';
      if (isMp3File && fileExtension !== 'mp3') {
        fileExtension = 'mp3'; // 强制使用.mp3扩展名
      }

      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

      // 根据文件类型分类存储，MP3单独处理
      let folder = 'uploads/';
      if (isMp3File) {
        folder = 'uploads/audios/mp3/'; // MP3专属目录
      } else if (file.mimetype.startsWith('image/')) {
        folder = 'uploads/images/';
      } else if (file.mimetype.startsWith('audio/')) {
        folder = 'uploads/audios/other/'; // 其他音频文件
      } else if (file.mimetype === 'application/pdf') {
        folder = 'uploads/documents/';
      }

      const objectKey = `${folder}${randomName}.${fileExtension}`;

      // 上传文件到OSS
      await this.client.put(objectKey, file.buffer);

      // MP3文件使用更长的有效期
      const expires = isMp3File
        ? 86400 // MP3文件1天有效期
        : file.mimetype.startsWith('audio/') ||
            file.mimetype.includes('pcm') ||
            file.mimetype.includes('octet-stream')
          ? 86400 // 其他音频文件1天
          : 3600; // 非音频文件1小时

      const signedUrl = this.client.signatureUrl(objectKey, {
        expires: expires,
        method: 'GET',
      });

      // 添加MP3文件识别日志
      if (isMp3File) {
        console.log(`MP3文件上传成功: ${objectKey}, 大小: ${file.size} bytes`);
      }

      return signedUrl;
    } catch (error) {
      throw new BadRequestException(
        `${isMp3File ? 'MP3文件' : '文件'}上传失败: ${error.message}`,
      );
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const objectKey = url.split('/').pop()?.split('?')[0] as string; // 去掉签名参数
      await this.client.delete(objectKey);
    } catch (error) {
      throw new BadRequestException(`文件删除失败: ${error.message}`);
    }
  }
}
