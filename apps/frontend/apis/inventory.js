import {get,post,del,put} from "../utils/http";
 
 
 
 //新增库存
 export const addInventoryApi = (data)=>post('/inventory',data)
 
 //获取单个库存
 export const getInventoryApi = (id)=>get('/inventory/' + id)
 
 //获取库存列表
 export const getInventoriesApi = ()=>get('/inventory')
 
 //编辑库存
 export const editInventoryApi = (id,data)=>put('/inventory/' +id ,data)
 
 //删除库存
 export const delInventoryApi = (id)=>del('/inventory/' + id)