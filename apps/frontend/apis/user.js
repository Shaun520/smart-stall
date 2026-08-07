import { get, post,put } from '@/utils/http.js'

// 获取用户信息
export const getInfoApi = () => get(`/user/info`)

// 用户登录
export const loginApi = (data) => post('/auth/login',data)


//编辑用户信息
export const editApi = (data)=>put('/user',data,{
	showLodaing:true
})