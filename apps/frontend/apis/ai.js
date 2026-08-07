import { post,get } from "../utils/http";

//图片理解
export const imageUnderstandApi = (data)=>post('/ai/image/understand',data,{
		showLoading: true,
		loadingText:'生成中...'
})


//图片生成 
export const imageGenerateApi = (data)=>post('/ai/image/generate',data,{
	showLoading: true,
	loadingText:'海报生成中...'
})

//AI对话
export const aiTalkApi = (data)=>post('/ai/chat',data,{
	showLoading: false
})

//语音合成
export const ttsApi = (text)=>get('/service/voice/synthesize?text='+text,{
	responseType:'arraybuffer'
})