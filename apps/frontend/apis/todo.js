import { post,get,put,del } from "../utils/http";

//新增事项
export const addTodoApi = (data)=>post('/todo',data)

//查询待办事项列表
export const getTodoListApi = ()=>get('/todo')

//编辑待办事项
export const editTodoApi = (id,data)=>put('/todo/' + id,data)

//删除待办事项
export const delTodoApi = (id)=>del('/todo/' + id)

