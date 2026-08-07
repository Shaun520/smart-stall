// sms.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationCode(phoneNumber: string, code: string) {
    const appCode = this.configService.get('ALIYUN_SMS_APP_CODE');
    const endpoint = this.configService.get('ALIYUN_SMS_BASE_URL');
    const templateId = this.configService.get('ALIYUN_SMS_TEMPLATE_ID');

    try {
      // 根据接口文档拼接参数
      const params = new URLSearchParams();
      params.append('mobile', phoneNumber);
      params.append('templateId', templateId);
      params.append('value', code);

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `APPCODE ${appCode}`,
      };

      const res = await firstValueFrom(
        this.httpService.post(
          endpoint + '/sms/send-upgrade?' + params.toString(),
          null,
          {
            headers,
          },
        ),
      );
      return res.data;
    } catch (err) {
      throw new HttpException(
        `短信发送失败: ${err.response.headers['x-ca-error-message'] || err.response.statusText}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
