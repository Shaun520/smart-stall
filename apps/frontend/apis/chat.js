import {get,post} from "../utils/http"; 


//获取会话列表
export const getConversationsApi = (type)=>get('/conversation?type=' + type)

//新增会话
export const addConversationApi = (data)=>post('/conversation',data)

//获取信息列表
export const getMessagesApi = (id) =>get('/message?conversationId=' + id,{},{
	showLoading:true,
	loadingText:"加载中..."
})

//新增信息
export const addMessageApi = (data)=>post('/message',data)