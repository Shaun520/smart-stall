import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import axios from 'axios';

@Injectable()
export class AsrService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 语音识别API
  async recognizeVoice(voiceUrl: string) {
    const { api_url, access_token } = this.configService.get('asr');

    // 获取音频数据
    const { base64, audioBuffer } = await this.urlToBase64WithSize(voiceUrl);

    const headers = {
      'Content-Type': 'application/json',
    };

    // 修正参数
    const payload = {
      format: 'pcm', // 请求PCM格式
      rate: 16000, // 采样率
      dev_pid: 1537, //
      channel: 1, // 单声道
      token: access_token, // 访问令牌
      cuid: '00-1B-44-11-3A-B7', // 设备标识
      speech: base64, // Base64编码的音频
      len: audioBuffer.length, // 修正：使用原始Buffer长度
    };
    console.log('base64:', base64);

    try {
      const res = await firstValueFrom(
        this.httpService.post(api_url, payload, { headers }),
      );
      console.log('语音识别结果:', res.data);
      return res.data;
    } catch (err) {
      console.error('语音识别API错误:', err.response?.data || err.message);
      throw new HttpException('语音识别服务暂时不可用', HttpStatus.BAD_REQUEST);
    }
  }

  // TTS服务API
  async textToSpeech(text: string) {
    const { api_url, access_token } = this.configService.get('tts');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // 构建表单数据对象
    const formData = {
      tex: text,
      tok: access_token,
      cuid: 'uni-app',
      lan: 'zh',
      ctp: 1, // Web端为1，App安卓端通常为2
      aue: 3, // MP3格式
    };

    try {
      // 方式1：使用URLSearchParams（推荐）
      const encodedData = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        encodedData.append(key, value.toString());
      });

      const res = await firstValueFrom(
        this.httpService.post(api_url, encodedData.toString(), {
          headers,
          responseType: 'arraybuffer', // 核心配置：要求返回 ArrayBuffer
        }),
      );
      // 此时 res.data 是一个 ArrayBuffer，将其转换为 Node.js 的 Buffer
      const audioBuffer = Buffer.from(res.data);
      console.log('接收到的音频数据长度:', audioBuffer.length);

      return audioBuffer;
    } catch {
      throw new HttpException('TTS服务暂时不可用', HttpStatus.BAD_REQUEST);
    }
  }

  // 下载音频文件并转换为Base64
  private async urlToBase64WithSize(
    audioUrl: string,
    compress: boolean = true,
  ): Promise<{ base64: string; sizeInKiB: number; audioBuffer: Buffer }> {
    try {
      // 1. 下载音频文件
      const response = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
      });

      const audioBuffer = Buffer.from(response.data);
      const originalSizeInKiB = audioBuffer.length / 1024;

      console.log(`原始文件大小: ${originalSizeInKiB.toFixed(2)} KiB`);

      // 2. 验证音频格式
      if (!this.isValidMP3(audioBuffer)) {
        console.warn('文件可能不是有效的MP3格式，但继续处理...');
      }

      // 3. 重要：如果请求PCM格式，不要进行MP3压缩
      // 因为API期望的是PCM格式，压缩为MP3会导致格式不匹配
      if (compress && audioBuffer.length > 2 * 1024 * 1024) {
        console.warn('大文件警告：建议在上传前对音频进行预处理');
        // 这里可以添加PCM格式的预处理逻辑，而不是MP3压缩
      }

      // 4. 转换为Base64
      const base64String = audioBuffer.toString('base64');
      const finalSizeInKiB = audioBuffer.length / 1024;

      return {
        base64: base64String,
        sizeInKiB: Number(finalSizeInKiB.toFixed(2)),
        audioBuffer: audioBuffer, // 返回原始Buffer用于len计算
      };
    } catch (error) {
      console.error('音频处理错误:', error.message);

      if (error.response) {
        throw new HttpException(
          `下载音频文件失败: ${error.response.status}`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.code === 'ECONNABORTED') {
        throw new HttpException('下载音频文件超时', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(
        '音频处理服务异常',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // MP3 文件头验证（保持不变）
  private isValidMP3(buffer: Buffer): boolean {
    if (buffer.length < 3) return false;

    const header = buffer.slice(0, 3).toString();
    if (header === 'ID3') return true;

    if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) {
      return true;
    }

    return false;
  }
}
