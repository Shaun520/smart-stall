import { registerAs } from '@nestjs/config';

export const commonConfig = registerAs('common', () => ({
  apiKey: process.env.AI_API_KEY,
}));

export const doubaoImageUnderstandConfig = registerAs(
  'doubao-image-understand',
  () => ({
    apiUrl: process.env.DOUBAO_IMAGE_UNDERSTAND_API_URL,
    model: 'doubao-seed-1-6-251015',
  }),
);

export const doubaoImageGenerateConfig = registerAs(
  'doubao-image-generate',
  () => ({
    apiUrl: process.env.DOUBAO_IMAGE_GENERATE_API_URL,
    model: 'doubao-seedream-4-0-250828',
  }),
);

export const doubaoVideoGenerateConfig = registerAs(
  'doubao-video-generate',
  () => ({
    apiUrl: process.env.DOUBAO_VIDEO_GENERATE_API_URL,
    model: 'doubao-seedance-1-0-pro-250528',
  }),
);

//搜索图片配置
export const bochaImageSearchConfig = registerAs('bocha-image-search', () => ({
  apiUrl: process.env.BOCHA_IMAGE_SEARCH_API_URL,
  apiKey: process.env.BOCHA_IMAGE_SEARCH_API_KEY,
}));

//搜索图片配置 doubao-seed-1-6-251015
export const deepseekTalkConfig = registerAs('deepseek-talk', () => ({
  apiUrl: process.env.DEEPSEEK_TALK_API_URL,
  model: 'doubao-seed-1-6-251015',
}));
