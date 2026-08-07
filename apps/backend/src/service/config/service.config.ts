import { registerAs } from '@nestjs/config';

export const baiduFRTConfig = registerAs<{
  api_url: string | undefined;
  access_token: string | undefined;
}>('frt', () => ({
  api_url: process.env.BAIDU_FACE_BASE_URL,
  access_token: process.env.BAIDU_FACE_ACCESS_TOKEN,
}));

export const baiduASRConfig = registerAs<{
  api_url: string | undefined;
  access_token: string | undefined;
}>('asr', () => ({
  api_url: process.env.BAIDU_VOICE_BASE_URL,
  access_token: process.env.BAIDU_VOICE_ACCESS_TOKEN,
}));

export const baiduTTSConfig = registerAs('tts', () => ({
  api_url: process.env.BAIDU_TTS_BASE_URL,
  access_token: process.env.BAIDU_VOICE_ACCESS_TOKEN,
}));
