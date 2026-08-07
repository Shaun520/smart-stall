<template>
  <view class="favorites-container">
    <!-- 导航栏 -->
	<uni-nav-bar status-bar left-icon="left" title="收藏" @clickLeft="goBack" :fixed="true">
		<template #right>
			<view class="reload-custom">
				<uni-icons type="reload" size="22" @click="makePhoneCall" />
			</view>
		</template>
	</uni-nav-bar>

    <!-- 收藏内容区域 -->
    <view class="favorites-content">
      <scroll-view class="favorites-scroll" scroll-y="true" :scroll-top="scrollTop">
        <!-- 收藏项 -->
        <view class="favorite-item" v-for="(item, index) in currentPageItems" :key="index">
          <view class="favorite-header">
            <text class="favorite-date">{{ item.date }}</text>
            <view class="favorite-status">
              <text class="favorite-weekday">{{ item.weekday }}</text>
              <text class="favorite-time">{{ item.time }}</text>
              <view class="favorite-star" @click="toggleFavorite(item.id)">
                <text class="star-icon" :class="{ 'star-active': item.isFavorited }">★</text>
              </view>
            </view>
          </view>
          
          <view class="product-info">
            <view class="product-details">
              <text class="product-name">{{ item.name }}</text>
              <text class="product-profit">预估利润：{{ item.profit }}</text>
            </view>
            <image :src="item.image" class="product-image"></image>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 分页器 -->
    <view class="pagination">
      <view class="pagination-info">
        <text class="pagination-text">当前第 {{ currentPage }} 页，共 {{ totalPages }} 页</text>
        <text class="pagination-text">共 {{ totalItems }} 条收藏</text>
      </view>
      
      <view class="pagination-controls">
        <!-- 上一页按钮 - 只在不是第一页时显示 -->
        <button class="page-btn prev-btn" v-if="currentPage > 1" @click="previousPage">
          <text class="page-btn-icon">‹</text>
        </button>
        
        <!-- 跳转控件 - 始终显示并居中 -->
        <view class="page-input-container">
          <text class="jump-text">跳转</text>
          <input 
            v-model="jumpPage" 
            class="page-input" 
            type="number" 
            placeholder="页码"
            min="1"
            :max="totalPages"
          />
          <text class="page-text">页</text>
          <button class="jump-btn" type="primary" @click="jumpToPage">GO</button>
        </view>
        
        <!-- 下一页按钮 - 只在不是最后一页时显示 -->
        <button class="page-btn next-btn" v-if="currentPage < totalPages" @click="nextPage">
          <text class="page-btn-icon">›</text>
        </button>
        
        <!-- 占位元素 - 确保布局平衡 -->
        <view class="placeholder" v-if="currentPage === 1"></view>
        <view class="placeholder" v-if="currentPage === totalPages"></view>
      </view>
    </view>

    <!-- 右下角添加按钮 -->
    <view class="add-button" @click="showHotProducts">
      <text class="add-icon">+</text>
    </view>

    <!-- 热门产品弹窗 -->
    <view class="hot-products-modal" v-if="showHotProductsModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">热门产品</text>
          <view class="close-btn" @click="closeHotProducts">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <scroll-view class="hot-products-list" scroll-y="true">
          <view 
            class="hot-product-item" 
            v-for="(product, index) in hotProducts" 
            :key="index"
          >
            <view class="product-info">
              <image :src="product.image" class="product-image"></image>
              <view class="product-details">
                <text class="product-name">{{ product.name }}</text>
                <text class="product-profit">预估利润：{{ product.profit }}</text>
              </view>
            </view>
            <view class="product-actions">
              <button 
                class="add-favorite-btn" 
                :class="{ 'added': product.isFavorited }"
                @click="toggleHotProductFavorite(product.id)"
              >
                {{ product.isFavorited ? '已收藏' : '收藏' }}
              </button>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="modal-mask" @click="closeHotProducts"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 收藏数据
const favorites = ref([
  {
    id: 1,
    date: '2025.10.31',
    weekday: '星期五',
    time: '11:33',
    name: '小白防晒嗨',
    profit: '¥1,280',
    image: '/static/images/coffee-product.png',
    isFavorited: true
  },
  {
    id: 2,
    date: '2025.10.30',
    weekday: '星期四',
    time: '14:20',
    name: '老王烧烤',
    profit: '¥980',
    image: '/static/images/bbq-product.png',
    isFavorited: true
  },
  {
    id: 3,
    date: '2025.10.29',
    weekday: '星期三',
    time: '09:45',
    name: '老李鸡蛋灌饼',
    profit: '¥1,150',
    image: '/static/images/egg-pancake.png',
    isFavorited: true
  },
  {
    id: 4,
    date: '2025.10.28',
    weekday: '星期二',
    time: '16:10',
    name: '贵州糯米饭',
    profit: '¥890',
    image: '/static/images/rice.png',
    isFavorited: true
  },
  {
    id: 5,
    date: '2025.10.27',
    weekday: '星期一',
    time: '12:05',
    name: '夏日冰粉',
    profit: '¥750',
    image: '/static/images/ice-product.png',
    isFavorited: true
  },
  {
    id: 6,
    date: '2025.10.26',
    weekday: '星期日',
    time: '18:30',
    name: '炸鸡排',
    profit: '¥1,420',
    image: '/static/images/chicken-product.png',
    isFavorited: true
  },
  {
    id: 7,
    date: '2025.10.25',
    weekday: '星期六',
    time: '10:15',
    name: '鲜榨果汁',
    profit: '¥680',
    image: '/static/images/juice-product.png',
    isFavorited: true
  },
  {
    id: 8,
    date: '2025.10.24',
    weekday: '星期五',
    time: '13:50',
    name: '章鱼小丸子',
    profit: '¥1,120',
    image: '/static/images/takoyaki-product.png',
    isFavorited: true
  },
  {
    id: 9,
    date: '2025.10.23',
    weekday: '星期四',
    time: '15:25',
    name: '麻辣烫',
    profit: '¥1,350',
    image: '/static/images/hotpot-product.png',
    isFavorited: true
  },
  {
    id: 10,
    date: '2025.10.22',
    weekday: '星期三',
    time: '11:10',
    name: '煎饼果子',
    profit: '¥950',
    image: '/static/images/pancake-product.png',
    isFavorited: true
  },
  {
    id: 11,
    date: '2025.10.21',
    weekday: '星期二',
    time: '17:40',
    name: '烤冷面',
    profit: '¥820',
    image: '/static/images/coldnoodle-product.png',
    isFavorited: true
  },
  {
    id: 12,
    date: '2025.10.20',
    weekday: '星期一',
    time: '14:55',
    name: '臭豆腐',
    profit: '¥1,080',
    image: '/static/images/tofu-product.png',
    isFavorited: true
  }
])

// 热门产品数据
const hotProducts = ref([
  {
    id: 101,
    name: '珍珠奶茶',
    profit: '¥850',
    image: '/static/images/bubble-tea.png',
    isFavorited: false
  },
  {
    id: 102,
    name: '水果沙拉',
    profit: '¥720',
    image: '/static/images/fruit-salad.png',
    isFavorited: false
  },
  {
    id: 103,
    name: '炸串',
    profit: '¥1,100',
    image: '/static/images/fried-skewers.png',
    isFavorited: false
  },
  {
    id: 104,
    name: '手抓饼',
    profit: '¥680',
    image: '/static/images/hand-pancake.png',
    isFavorited: false
  },
  {
    id: 105,
    name: '关东煮',
    profit: '¥920',
    image: '/static/images/oden.png',
    isFavorited: false
  }
])

// 分页相关
const currentPage = ref(1)
const itemsPerPage = 10
const jumpPage = ref('')
const scrollTop = ref(0)
const showHotProductsModal = ref(false)

// 计算属性
const totalItems = computed(() => favorites.value.filter(item => item.isFavorited).length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const currentPageItems = computed(() => {
  const favoritedItems = favorites.value.filter(item => item.isFavorited)
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return favoritedItems.slice(startIndex, endIndex)
})

onMounted(() => {
  // 组件挂载后的初始化代码
})

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 刷新页面
const refreshPage = () => {
  uni.showToast({
    title: '刷新成功',
    icon: 'success'
  })
  // 重置文本框
  jumpPage.value = ''
}

// 切换收藏状态
const toggleFavorite = (id) => {
  const item = favorites.value.find(item => item.id === id)
  if (item) {
    item.isFavorited = !item.isFavorited
    
    // 如果当前页没有收藏项了，跳转到上一页
    if (currentPageItems.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
    
    uni.showToast({
      title: item.isFavorited ? '已收藏' : '已取消收藏',
      icon: 'none'
    })
  }
}

// 上一页
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToTop()
    // 重置文本框
    jumpPage.value = ''
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToTop()
    // 重置文本框
    jumpPage.value = ''
  }
}

// 跳转到指定页
const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (isNaN(page) || page < 1 || page > totalPages.value) {
    uni.showToast({
      title: '该页面不存在',
      icon: 'none'
    })
    // 重置文本框
    jumpPage.value = ''
    return
  }
  
  currentPage.value = page
  jumpPage.value = '' // 跳转后重置文本框
  scrollToTop()
}

// 滚动到顶部
const scrollToTop = () => {
  scrollTop.value = 0
}

// 显示热门产品弹窗
const showHotProducts = () => {
  showHotProductsModal.value = true
}

// 关闭热门产品弹窗
const closeHotProducts = () => {
  showHotProductsModal.value = false
}

// 切换热门产品收藏状态
const toggleHotProductFavorite = (id) => {
  const product = hotProducts.value.find(product => product.id === id)
  if (product) {
    product.isFavorited = !product.isFavorited
    
    // 如果收藏，添加到收藏列表
    if (product.isFavorited) {
      const now = new Date()
      const date = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`
      const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()]
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      
      favorites.value.unshift({
        id: Date.now(), // 使用时间戳作为新ID
        date,
        weekday,
        time,
        name: product.name,
        profit: product.profit,
        image: product.image,
        isFavorited: true
      })
      
      uni.showToast({
        title: '已添加到收藏',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	.reload-custom {
		width: 60rpx;
		height: 60rpx;
		border-radius: 8rpx;
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
	}
.favorites-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5; /* 极浅灰色背景 */
  position: relative;
}


/* 收藏内容区域 */
.favorites-content {
  flex: 1;
  overflow: hidden;
  padding: 30rpx;
}

.favorites-scroll {
  height: 100%;
}

/* 收藏项样式 */
.favorite-item {
  background-color: #fff; /* 纯白色背景 */
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25rpx;
}

.favorite-date {
  font-size: 28rpx;
  color: #666;
}

.favorite-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.favorite-weekday {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.favorite-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.favorite-star {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  font-size: 32rpx;
  color: #ccc;
  transition: all 0.2s ease;
}

.star-active {
  color: #ffcc00; /* 黄色星号 */
}

/* 产品信息 */
.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 16rpx;
  padding: 25rpx;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.product-profit {
  font-size: 24rpx;
  color: #f56c6c;
}

.product-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
}

/* 分页器 */
.pagination {
  background-color: #fff;
  padding: 30rpx;
  border-top: 1rpx solid #eee;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25rpx;
}

.pagination-text {
  font-size: 26rpx;
  color: #666;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: 70rpx; /* 确保有足够高度 */
}

/* 分页按钮样式 */
.page-btn {
  width: 80rpx;
  height: 60rpx;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.page-btn:active {
  background-color: #e0e0e0;
  transform: translateY(-50%) scale(0.95);
}

.page-btn:disabled {
  background-color: #f5f5f5;
  color: #ccc;
}

.page-btn-icon {
  font-size: 32rpx;
  font-weight: bold;
}

.prev-btn {
  left: 0;
}

.next-btn {
  right: 0;
}

/* 占位元素 - 确保布局平衡 */
.placeholder {
  width: 80rpx;
  height: 60rpx;
  visibility: hidden;
}

/* 跳转控件样式 */
.page-input-container {
  display: flex;
  align-items: center;
  gap: 15rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.jump-text {
  width: 50rpx;
  font-size: 24rpx;
  color: #666;
}

.page-input {
  width: 100rpx;
  height: 50rpx;
  border: 1rpx solid #ddd;
  border-radius: 6rpx;
  padding: 0 12rpx;
  font-size: 24rpx;
  text-align: center;
  background-color: #fff;
}

.page-text {
  font-size: 26rpx;
  color: #666;
}

.jump-btn {
  color: #fff;
  border: none;
  border-radius: 6rpx;
  padding: 0 24rpx;
  font-size: 20rpx;
  transition: all 0.2s ease;
}


/* 右下角添加按钮 */
.add-button {
  position: fixed;
  bottom: 140rpx;
  right: 40rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  z-index: 10;
  transition: all 0.2s ease;
}

.add-button:active {
  background-color: #555;
  transform: scale(0.95);
}

.add-icon {
  font-size: 40rpx;
  color: #fff;
  font-weight: bold;
}

/* 热门产品弹窗 */
.hot-products-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 90%;
  max-height: 80%;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  z-index: 101;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  width: 50rpx;
  height: 50rpx;
  border-radius: 12rpx;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:active {
  background-color: #e0e0e0;
  transform: scale(0.95);
}

.close-icon {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.hot-products-list {
  max-height: 600rpx;
  padding: 20rpx;
}

.hot-product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.hot-product-item:last-child {
  border-bottom: none;
}

.hot-product-item .product-info {
  display: flex;
  align-items: center;
  background: none;
  padding: 0;
  flex: 1;
}

.hot-product-item .product-image {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}

.hot-product-item .product-details {
  flex: 1;
}

.add-favorite-btn {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8rpx;
  font-size: 24rpx;
  transition: all 0.2s ease;
}

.add-favorite-btn.added {
  background-color: #ffcc00;
  color: #fff;
}

.add-favorite-btn:active {
  transform: scale(0.95);
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
</style>