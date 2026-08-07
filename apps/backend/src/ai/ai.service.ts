import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';
import {
  aiTalkDTO,
  imageGenerateDTO,
  imageSearchDTO,
  imageUnderstandDTO,
  videoDTO,
  videoGenerateDTO,
} from './dto/ai.dto';

@Injectable()
export class AIService {
  private readonly headers: { 'Content-Type': string; Authorization: string };
  private readonly prompt: string =
    '你是一个智能ai，虽然参考了网上的一些资料，但回答时不用说出根据参数啥资料，直接回答用户内容就行，而且你现在是项目名中“您的市井‘ai’人——用AI助力，一’智’赚不停”的里面小智助理(这里运用了同声字‘ai’即有爱的意思，又表示AI的意思，还有‘智’，即智慧，又表示一直赚不停)，你的性格是可爱';
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.configService.get('common').apiKey}`,
    };
  }

  //ai对话
  async chat(body: aiTalkDTO) {
    const { image, content, id } = body;
    const { apiUrl, model } = this.configService.get('deepseek-talk');
    const payload = {
      model,
      max_output_tokens: 500,
      previous_response_id: id || null,
      //开启流式
      stream: true,
      tools: [
        {
          type: 'web_search',
          max_keyword: 1,
          limit: 1,
        },
      ],
      store: true,
      input: [
        {
          role: 'system',
          content: this.prompt as any,
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: content,
            },
          ],
        },
      ],
      thinking: {
        type: 'disabled',
      },
    };

    payload.input.forEach((item) => {
      if (item.role === 'user') {
        if (Array.isArray(image) && image.length > 0) {
          for (const img of image) {
            item.content.push({ type: 'input_image', image_url: img });
          }
        } else if (typeof image == 'string') {
          item.content.push({ type: 'input_image', image_url: image });
        }
      }
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, payload, { headers: this.headers }),
      );
      return response.data;
    } catch (err) {
      console.log(err.response);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  //图片理解
  async understandImage(body: imageUnderstandDTO): Promise<any> {
    const { apiUrl, model } = this.configService.get('doubao-image-understand');
    // 修复消息格式处理
    const formattedMessages: any[] = [
      {
        role: 'user',
        content: [
          // 图片部分
          ...(Array.isArray(body.image)
            ? body.image.map((url) => ({
                type: 'image_url',
                image_url: { url },
              }))
            : body.image && typeof body.image === 'string'
              ? [{ type: 'image_url', image_url: { url: body.image } }]
              : []),
          // 文本部分
          ...(body.text ? [{ type: 'text', text: body.text }] : []),
        ].filter((item) => item), // 过滤空项
      },
    ];

    const payload = {
      model,
      max_completion_tokens: 65535, // 最大生成长度
      reasoning_effort: 'medium', // 推理难度
      messages: formattedMessages, //  直接传递格式化后的消息数组
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, payload, { headers: this.headers }),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  //图片生成
  async generateImage(body: imageGenerateDTO): Promise<any> {
    const { apiUrl, model } = this.configService.get('doubao-image-generate');
    const { prompt, image, size } = body;
    const payload = {
      model,
      prompt,
      image,
      size: size || '2K',
      sequential_image_generation: 'disabled', //生成单张图
      stream: false, //是否流式返回
      response_format: 'url', //返回图片url
      watermark: false, //是否加水印
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, payload, { headers: this.headers }),
      );
      return response.data.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data?.error?.message || '图像生成失败',
        err.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  //执行视频生成任务
  async implmentGenerateVideoTask(body: videoGenerateDTO): Promise<any> {
    const { apiUrl, model } = this.configService.get('doubao-video-generate');

    const { prompt, image, video } = body;
    const formatPrompt = this.formatVideo(video, prompt);
    const content = [{ type: 'text', text: formatPrompt }] as any;
    if (Array.isArray(image) && image.length > 0) {
      content.push(
        ...image.map((i) => ({ type: 'image_url', image_url: { url: i } })),
      );
    } else if (typeof image === 'string' && image.length > 0) {
      content.push({ type: 'image_url', image_url: { url: image } });
    }

    const payload = {
      model,
      content,
    };

    try {
      const res1 = await firstValueFrom(
        this.httpService.post(apiUrl, payload, { headers: this.headers }),
      );

      return res1.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data?.error?.message || '视频生成失败',
        err.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  //获取视频生成结果
  async getGenerateVideoResult(id: string): Promise<any> {
    const { apiUrl } = this.configService.get('doubao-video-generate');
    try {
      const res2 = await firstValueFrom(
        this.httpService.get(apiUrl + '/' + id, {
          headers: this.headers,
        }),
      );
      return res2.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data?.error?.message || '视频生成失败',
        err.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
  //文本搜索图片
  async searchImage(body: imageSearchDTO): Promise<any> {
    const { apiUrl, apiKey } = this.configService.get('bocha-image-search');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    const payload = { ...body };

    try {
      const res = await firstValueFrom(
        this.httpService.post(apiUrl, payload, { headers }),
      );
      return res.data.data.images;
    } catch (err) {
      throw new HttpException(
        err.response?.data?.error?.message || '视频生成失败',
        err.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  private formatVideo(video: videoDTO, prompt: string) {
    if (video.ratio) prompt = prompt + `--rt ${video.ratio} `;
    if (video.duration && video.duration > 0)
      prompt = prompt + `--dur ${video.duration} `;
    if (video.framespersecond && video.framespersecond > 0)
      prompt = prompt + `--fps ${video.framespersecond} `;
    if (video.resoluton) prompt = prompt + `--rs ${video.resoluton} `;
    if (!video.watermark) prompt = prompt + `--wm false `;
    else prompt = prompt + `--wm true `;
    return prompt;
  }
}
