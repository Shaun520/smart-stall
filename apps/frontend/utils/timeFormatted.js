


//聊天信息格式化
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    // 获取当前年份
    const currentYear = now.getFullYear()
    const dateYear = date.getFullYear()
    
    // 如果是今天
    if (days === 0) {
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    } 
    // 如果是昨天
    else if (days === 1) {
        return '昨天'
    }
    // 如果是2-6天内
    else if (days < 7) {
        return `${days}天前`
    }
    // 如果是7天到1年内（且不是跨年）
    else if (dateYear === currentYear) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${month}-${day}`
    }
    // 如果超过一年（跨年）
    else {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    }
}
