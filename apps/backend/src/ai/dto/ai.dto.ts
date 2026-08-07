export class imageGenerateDTO {
  prompt: string;
  image: string | Array<string>;
  size?: string;
}

//视频参数
export class videoDTO {
  duration: number; //视频时长
  resoluton?: string; //分辨率
  ratio?: string; //比例 16:9
  watermark?: boolean; //水印
  framespersecond?: number; //帧率
}

export class videoGenerateDTO {
  prompt: string; //提示词
  image: string | Array<string>; //图片
  video: videoDTO; //视频参数
}

// 图片搜索参数
export class imageSearchDTO {
  query: string; //搜索词
  count: number; //返回数量
  freshness?: 'noLimit' | 'oneDay' | 'oneWeek' | 'oneMonth' | 'oneYear'; //新鲜度
}

//图片理解参数
export class imageUnderstandDTO {
  image: string | Array<string>; //图片
  text: string; //文本内容
}

//ai对话参数
export class aiTalkDTO {
  content: string; //对话内容
  image?: string | Array<string>; //图片
  id?: string; //用于定位上一轮 对话id
}
