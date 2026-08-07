// const BASE_URL = 'http://hkone.mnt.mhnode.cn:54750/stall'
const BASE_URL = 'http://localhost:3005/stall'

// 全局状态管理
let isRefreshing = false
let requestQueue = []

// Token刷新函数
const refreshToken = async () => {
  try {
	  
    const refreshToken = uni.getStorageSync('refreshToken')
    if (!refreshToken) {
      throw new Error('未找到刷新令牌')
    }
   
    const response = await uni.request({
      url: BASE_URL + '/auth/refresh-token',
      method: 'POST',
      data: { refreshToken },
      header: { 'Content-Type': 'application/json' },
      sslVerify: false
    })
	
    // 判断HTTP状态码
    if (response.statusCode >= 200 && response.statusCode < 400) {
      // 根据您的业务结构，200表示HTTP请求成功t
      // 如果刷新成功，后端会返回新的token
	  const {data} = response
      if (data.data.token) {
        uni.setStorageSync('token', data.data.token)
        return data.data.token
      } else {
        // 刷新token接口返回了其他错误
        throw new Error(response.data?.message || '刷新token失败')
      }
    } else {
      // HTTP错误
      throw new Error(`刷新失败，状态码：${response.statusCode}`)
    }
  } catch (error) {
    console.error('刷新token失败:', error)
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none'
    })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/login/login' })
    }, 1500)
    
    // 清理token
    uni.removeStorageSync('token')
    uni.removeStorageSync('refreshToken')
    throw error
  }
}

// 处理请求队列
const processQueue = (token, error = null) => {
  while (requestQueue.length > 0) {
    const { resolve, reject, config } = requestQueue.shift()
    if (error) {
      reject(error)
    } else {
      // 使用新token重新发起请求
      config.header = config.header || {}
      config.header['Authorization'] = 'Bearer ' + token
      request(config).then(resolve).catch(reject)
    }
  }
}

// 核心请求函数
const request = (options = {}) => {
  // 显示加载提示
  if (options.showLoading) {
    uni.showLoading({
      title: options.loadingText || '加载中...',
      mask: true
    })
  }

  return new Promise((resolve, reject) => {
    const config = {
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      sslVerify: false,
      responseType: options.responseType || 'text',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (uni.getStorageSync('token') || ''),
        ...options.header
      },
      timeout: options.timeout || 30000
    }

    // 白名单：不需要token的接口
    const noAuthUrls = ['/auth/login', '/auth/register', '/auth/refresh-token']
    if (noAuthUrls.some(url => config.url.includes(url))) {
      delete config.header.Authorization
    }

    uni.request({
      ...config,
      success: (res) => {
        if (res.statusCode === 401) {
          // Token过期，触发刷新流程 
          // 将当前请求加入队列等待刷新
          requestQueue.push({ resolve, reject, config: options })
        
          // 如果不在刷新中，则发起刷新token请求
          if (!isRefreshing) {
            isRefreshing = true
			
            refreshToken()
              .then((newToken) => {
                // 刷新成功，处理队列中的所有请求
                processQueue(newToken)
              })
              .catch((error) => {
                // 刷新失败，所有队列请求都失败
                processQueue(null, error)
                // 跳转登录已在refreshToken中处理
              })
              .finally(() => {
                isRefreshing = false
                requestQueue = []
              })
          }
        } 
        // 处理其他HTTP错误
        else if (res.statusCode < 200 || res.statusCode >= 400) {
          reject(res.data)
		 
        }
        // HTTP请求成功，判断业务状态
        else {
			
          // 根据您的结构，data.errno判断业务是否成功
          if (res.data.errno === 0) {
            // 业务成功
            resolve(res.data)
          } else {
            reject(res.data)
          }
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      },
      complete: () => {
        if (options.showLoading) {
          uni.hideLoading()
        }
      }
    })
  })
}

// 快捷方法
export const get = (url, data = {}, options = {}) => {
  return request({ url, method: 'GET', data, ...options })
}

export const post = (url, data = {}, options = {}) => {
  return request({ url, method: 'POST', data, ...options })
}

export const put = (url, data = {}, options = {}) => {
  return request({ url, method: 'PUT', data, ...options })
}

export const del = (url, data = {}, options = {}) => {
  return request({ url, method: 'DELETE', data, ...options })
}

export { request }
export default request