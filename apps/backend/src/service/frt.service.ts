// sms.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { frtAddDTO, frtGetDTO, frtVerifyDTO } from './dto/service.dto';
import sharp from 'sharp';
import axios from 'axios';
@Injectable()
export class FrtService {
  private readonly apiUrl;
  private readonly headers;
  private readonly query;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get('frt').api_url;
    this.query = '?access_token=' + this.configService.get('frt').access_token;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  //新增人脸
  async addFace(body: frtAddDTO) {
    const payload = {
      image: body.image,
      image_type: body.image_type,
      group_id: body.group_id,
      user_id: body.user_id,
      user_info: body.user_info,
    };
    try {
      const res = await firstValueFrom(
        this.httpService.post(
          this.apiUrl + '/faceset/user/add' + this.query,
          payload,
          { headers: this.headers },
        ),
      );
      return res.data;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
  //获取人脸信息
  async getFace(body: frtGetDTO) {
    const payload = {
      group_id: body.group_id,
      user_id: body.user_id,
    };
    try {
      const res = await firstValueFrom(
        this.httpService.post(
          this.apiUrl + '/faceset/user/get' + this.query,
          payload,
          { headers: this.headers },
        ),
      );
      return res.data.result.user_list;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //人脸验证
  async verifyFace(body: frtVerifyDTO) {
    //将url(https)转化base64
    const base64String = await this.urlToBase64(body.image);

    const payload = {
      image: base64String,
      image_type: body.image_type || 'BASE64',
      group_id_list: body.group_id_list || 'group_shaun_1',
      user_id: body.user_id,
    };
    try {
      const res = await firstValueFrom(
        this.httpService.post(this.apiUrl + '/search' + this.query, payload, {
          headers: this.headers,
        }),
      );
      return res.data.result;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async urlToBase64(
    imageUrl: string,
    compress: boolean = true,
  ): Promise<string> {
    try {
      // 1. 下载图片，获取ArrayBuffer
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000, // 设置超时时间
      });

      // 2. 将ArrayBuffer转换为Buffer
      let imageBuffer = Buffer.from(response.data);

      // 3. (可选) 如果图片较大，使用sharp进行压缩
      if (compress && imageBuffer.length > 2 * 1024 * 1024) {
        // 例如，大于2MB时压缩
        imageBuffer = await sharp(imageBuffer)
          .resize(800, 800, {
            // 调整尺寸
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 80 }) // 转换为JPEG并设置质量
          .toBuffer();
      }

      // 4. 将Buffer转换为Base64字符串
      const base64String = imageBuffer.toString('base64');
      return base64String;
    } catch (error) {
      // 错误处理
      if (error.response) {
        throw new HttpException(
          `Failed to fetch image: ${error.response.status}`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          'Request timeout while fetching image',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }
      throw new HttpException(
        'Internal server error during image processing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
