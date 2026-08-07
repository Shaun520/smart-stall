import { get, post,put,del } from '@/utils/http.js'


//新增海报
export const addPosterApi = (data)=>post('/poster',data)

//获取海报列表
export const getPosterListApi = ()=>get('/poster')

//获取海报详情
export const getPosterDetailsApi = (id)=>get('/poster/' + id)

//编辑海报
export const updatePosterApi = (id,data) => put('/poster/'+id,data)

//删除海报
export const deletePosterApi = (id) => del('/poster/'+id)