<template>
  <view class="goods-container">
    <!-- 顶部导航栏 -->
	<uni-nav-bar right-width="150rpx" status-bar left-icon="left" title="我的商品" @clickLeft="uni.navigateBack()" :fixed="true">
		<template #right>
			<view class="nav-right">
			  <view class="nav-icon" @click="showSearch = true">
			    <uni-icons type="search" size="20" color="#333"></uni-icons>
			  </view>
			  <view class="nav-icon" @click="showFilter = true">
			    <uni-icons type="bars" size="20" color="#333"></uni-icons>
			  </view>
			</view>
		</template>
	</uni-nav-bar>


    <!-- 快速操作栏 -->
    <view class="quick-actions">
      <view class="action-item" @click="goToAddGoods">
        <view class="action-icon add">
          <uni-icons type="plus" size="24" color="#fff"></uni-icons>
        </view>
        <text class="action-text">添加商品</text>
      </view>
      
      <view class="action-item" @click="batchOperation('onsale')">
        <view class="action-icon onsale">
          <uni-icons type="arrow-up" size="20" color="#fff"></uni-icons>
        </view>
        <text class="action-text">批量上架</text>
      </view>
      
      <view class="action-item" @click="batchOperation('offsale')">
        <view class="action-icon offsale">
          <uni-icons type="arrow-down" size="20" color="#fff"></uni-icons>
        </view>
        <text class="action-text">批量下架</text>
      </view>
      
      <view class="action-item" @click="showBatchDelete = true">
        <view class="action-icon delete">
          <uni-icons type="trash" size="20" color="#fff"></uni-icons>
        </view>
        <text class="action-text">批量删除</text>
      </view>
    </view>

    <!-- 批量操作栏 -->
    <view class="batch-actions" v-if="selectedGoods.length > 0">
      <view class="batch-info">
        <text>已选择 {{ selectedGoods.length }} 个商品</text>
      </view>
      <view class="batch-buttons">
        <view class="batch-btn cancel" @click="clearSelection">取消</view>
        <view class="batch-btn confirm" @click="executeBatchOperation">确认</view>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view 
      class="goods-list" 
      scroll-y 
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 空状态 -->
      <view class="empty-state" v-if="goodsList.length === 0 && !loading">
        <image src="/static/images/empty-goods.png" class="empty-image"></image>
        <text class="empty-text">暂无商品</text>
        <text class="empty-desc">快去添加您的第一个商品吧</text>
        <button class="add-btn" @click="goToAddGoods">添加商品</button>
      </view>

      <!-- 商品卡片 -->
      <view 
        class="goods-item" 
        v-for="goods in goodsList" 
        :key="goods.id"
        :class="{ selected: isSelected(goods.id) }"
        @click="toggleSelect(goods.id)"
      >
        <!-- 选择框 -->
        <view class="selection-box" @click.stop="toggleSelect(goods.id)">
          <view class="checkbox" :class="{ checked: isSelected(goods.id) }">
            <uni-icons v-if="isSelected(goods.id)" type="checkmark" size="16" color="#fff"></uni-icons>
          </view>
        </view>

        <view class="goods-content">
          <view class="goods-image">
            <image :src="goods.image" mode="aspectFill" class="image"></image>
            <view class="goods-status" :class="goods.status">
              {{ getStatusText(goods.status) }}
            </view>
          </view>
          
          <view class="goods-info">
            <view class="goods-header">
              <view class="goods-name">{{ goods.name }}</view>
              <view class="goods-sales">销量: {{ goods.sales }}</view>
            </view>
            
            <view class="goods-desc">{{ goods.description }}</view>
            
            <view class="goods-meta">
              <text class="goods-price">¥{{ goods.price }}</text>
              <text class="goods-stock">库存: {{ goods.stock }}</text>
            </view>
            
            <!-- 商品操作按钮 -->
            <view class="goods-actions">
              <view class="action-btn edit" @click.stop="editGoods(goods)">
                <uni-icons type="compose" size="16" color="#fff"></uni-icons>
                <text>编辑</text>
              </view>
              
              <view 
                class="action-btn" 
                :class="goods.status === 'onsale' ? 'offsale' : 'onsale'"
                @click.stop="toggleGoodsStatus(goods)"
              >
                <uni-icons 
                  :type="goods.status === 'onsale' ? 'arrow-down' : 'arrow-up'" 
                  size="16" 
                  color="#fff"
                ></uni-icons>
                <text>{{ goods.status === 'onsale' ? '下架' : '上架' }}</text>
              </view>
              
              <view class="action-btn delete" @click.stop="showDeleteConfirm(goods)">
                <uni-icons type="trash" size="16" color="#fff"></uni-icons>
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 批量删除确认 -->
    <uni-popup ref="batchDeletePopup" type="dialog">
      <uni-popup-dialog 
        type="warn"
        title="批量删除"
        content="确定要删除选中的商品吗？此操作不可撤销。"
        :duration="2000"
        @confirm="confirmBatchDelete"
        @close="cancelBatchDelete"
      ></uni-popup-dialog>
    </uni-popup>

    <!-- 单个商品删除确认 -->
    <uni-popup ref="deletePopup" type="dialog">

    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 响应式数据
const showSearch = ref(false)
const showFilter = ref(false)
const refreshing = ref(false)
const loading = ref(false)
const batchDeletePopup = ref()
const deletePopup = ref()
const showBatchDelete = ref(false)

// 当前操作的商品
const currentGoods = ref(null)

// 选中的商品ID列表
const selectedGoods = ref([])
const currentBatchOperation = ref('')

// 商品列表数据
const goodsList = ref([
  {
    id: 1,
    name: '新鲜水果礼盒',
    description: '当季新鲜水果组合，包含苹果、橙子、葡萄等',
    price: 88.8,
    stock: 50,
    image: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.uI9rlGwe4fNarclJMN94jwHaHa?w=217&h=217&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1',
    status: 'onsale',
    sales: 120
  },
  {
    id: 2,
    name: '手工烘焙饼干',
    description: '纯手工制作，无添加防腐剂',
    price: 25.5,
    stock: 5,
    image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.CiaNAawklnovhdhLiZzl0QHaE7?w=274&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1',
    status: 'lowstock',
    sales: 89
  },
  {
    id: 3,
    name: '有机蔬菜套餐',
    description: '农场直供有机蔬菜，健康美味',
    price: 45.0,
    stock: 0,
    image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.oFbStVMhUb76qVzkUAia7wHaEd?w=264&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1',
    status: 'offsale',
    sales: 156
  }
])

// 方法定义
const goBack = () => {
  uni.navigateBack()
}

const goToAddGoods = () => {
  uni.navigateTo({
    url: '/pages/goods/add'
  })
}

const editGoods = (goods) => {
  uni.navigateTo({
    url: `/pages/goods/edit?id=${goods.id}`
  })
}

// 选择商品
const toggleSelect = (goodsId) => {
  const index = selectedGoods.value.indexOf(goodsId)
  if (index > -1) {
    selectedGoods.value.splice(index, 1)
  } else {
    selectedGoods.value.push(goodsId)
  }
}

const isSelected = (goodsId) => {
  return selectedGoods.value.includes(goodsId)
}

const clearSelection = () => {
  selectedGoods.value = []
  currentBatchOperation.value = ''
}

// 批量操作
const batchOperation = (operation) => {
  if (goodsList.value.length === 0) {
    uni.showToast({
      title: '暂无商品可操作',
      icon: 'none'
    })
    return
  }
  
  currentBatchOperation.value = operation
  selectedGoods.value = goodsList.value.map(goods => goods.id)
}

const executeBatchOperation = () => {
  if (selectedGoods.value.length === 0) {
    uni.showToast({
      title: '请先选择商品',
      icon: 'none'
    })
    return
  }

  if (currentBatchOperation.value === 'delete') {
    batchDeletePopup.value.open()
    return
  }

  // 执行批量上架/下架
  goodsList.value.forEach(goods => {
    if (selectedGoods.value.includes(goods.id)) {
      goods.status = currentBatchOperation.value
    }
  })

  uni.showToast({
    title: '操作成功',
    icon: 'success'
  })
  
  clearSelection()
}

// 单个商品状态切换
const toggleGoodsStatus = (goods) => {
  const newStatus = goods.status === 'onsale' ? 'offsale' : 'onsale'
  const action = newStatus === 'onsale' ? '上架' : '下架'
  
  uni.showModal({
    title: '提示',
    content: `确定要${action}该商品吗？`,
    success: (res) => {
      if (res.confirm) {
        goods.status = newStatus
        uni.showToast({
          title: `${action}成功`,
          icon: 'success'
        })
      }
    }
  })
}

// 删除确认
const showDeleteConfirm = (goods) => {
  currentGoods.value = goods
  deletePopup.value.open()
}

const confirmDelete = () => {
  if (currentGoods.value) {
    const index = goodsList.value.findIndex(item => item.id === currentGoods.value.id)
    if (index !== -1) {
      goodsList.value.splice(index, 1)
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      })
    }
  }
}

const cancelDelete = () => {
  currentGoods.value = null
}

const confirmBatchDelete = () => {
  selectedGoods.value.forEach(goodsId => {
    const index = goodsList.value.findIndex(item => item.id === goodsId)
    if (index !== -1) {
      goodsList.value.splice(index, 1)
    }
  })
  
  uni.showToast({
    title: '删除成功',
    icon: 'success'
  })
  
  clearSelection()
}

const cancelBatchDelete = () => {
  showBatchDelete.value = false
}

const onRefresh = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    uni.stopPullDownRefresh()
  }, 1000)
}

const getStatusText = (status) => {
  const statusMap = {
    'onsale': '出售中',
    'offsale': '已下架',
    'lowstock': '库存紧张'
  }
  return statusMap[status] || '未知状态'
}
</script>

<style lang="scss" scoped>
.goods-container {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: env(safe-area-inset-bottom);
}

// 导航栏样式

  .nav-right {
	width: 200rpx;
    display: flex;
    align-items: center;
    gap: 30rpx;

    .nav-icon {
      padding: 10rpx;
    }
  }


// 快速操作栏
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    padding: 10rpx;
    border-radius: 12rpx;
    transition: all 0.3s;

    &:active {
      background: #f5f5f5;
      transform: scale(0.95);
    }

    .action-icon {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.add {
        background: linear-gradient(135deg, #5A78EA, #8A2BE2);
      }

      &.onsale {
        background: #67C23A;
      }

      &.offsale {
        background: #909399;
      }

      &.delete {
        background: #ff6b6b;
      }
    }

    .action-text {
      font-size: 24rpx;
      color: #666;
      white-space: nowrap;
    }
  }
}

// 批量操作栏
.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .batch-info {
    font-size: 28rpx;
    color: #333;
  }

  .batch-buttons {
    display: flex;
    gap: 20rpx;

    .batch-btn {
      padding: 12rpx 24rpx;
      border-radius: 8rpx;
      font-size: 26rpx;

      &.cancel {
        background: #f5f5f5;
        color: #666;
      }

      &.confirm {
        background: #5A78EA;
        color: #fff;
      }
    }
  }
}

// 商品列表样式
.goods-list {
  height: calc(100vh - 300rpx);
  padding: 20rpx;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;

    .empty-image {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 40rpx;
    }

    .empty-text {
      font-size: 32rpx;
      color: #999;
      margin-bottom: 20rpx;
    }

    .empty-desc {
      font-size: 28rpx;
      color: #ccc;
      margin-bottom: 40rpx;
    }

    .add-btn {
      background: #5A78EA;
      color: #fff;
      border-radius: 50rpx;
      padding: 20rpx 40rpx;
      font-size: 28rpx;
    }
  }

  .goods-item {
    display: flex;
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    border: 2rpx solid transparent;

    &.selected {
      border-color: #5A78EA;
      background: #f8faff;
    }

    .selection-box {
      display: flex;
      align-items: flex-start;
      margin-right: 20rpx;

      .checkbox {
        width: 36rpx;
        height: 36rpx;
        border: 2rpx solid #ddd;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &.checked {
          background: #5A78EA;
          border-color: #5A78EA;
        }
      }
    }

    .goods-content {
      display: flex;
      flex: 1;
      gap: 20rpx;
    }

    .goods-image {
      position: relative;
      flex-shrink: 0;

      .image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
      }

      .goods-status {
        position: absolute;
        top: 10rpx;
        left: 10rpx;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        font-size: 20rpx;
        color: #fff;

        &.onsale {
          background: #67C23A;
        }

        &.offsale {
          background: #909399;
        }

        &.lowstock {
          background: #E6A23C;
        }
      }
    }

    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .goods-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10rpx;

        .goods-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          flex: 1;
          margin-right: 20rpx;
        }

        .goods-sales {
          font-size: 24rpx;
          color: #999;
          white-space: nowrap;
        }
      }

      .goods-desc {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 15rpx;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .goods-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15rpx;

        .goods-price {
          font-size: 36rpx;
          font-weight: 600;
          color: #ff6b6b;
        }

        .goods-stock {
          font-size: 24rpx;
          color: #999;
        }
      }

      .goods-actions {
        display: flex;
        gap: 10rpx;

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6rpx;
          padding: 12rpx 0;
          border-radius: 8rpx;
          font-size: 24rpx;
          color: #fff;

          &.edit {
            background: #5A78EA;
          }

          &.onsale {
            background: #67C23A;
          }

          &.offsale {
            background: #909399;
          }

          &.delete {
            background: #ff6b6b;
          }
        }
      }
    }
  }
}
</style>