<template>
  <view class="container" @tap="handlePageClick">
    <!-- 头部栏 -->
    <view @tap.stop="">
      <uni-nav-bar shadow right-icon="more-filled" status-bar left-icon="left" title="海报生成"
        @clickLeft="uni.navigateBack()" @clickRight="toggleMoreList" />
    </view>

    <!-- 更多操作 -->
    <view class="more-list" v-if='moreIsView'>
      <view class="item" v-for="(item, index) in moreList" :key="index" @tap.stop="handleMoreAction(item.action)">
        <uni-icons :type="item.icon" size="16" color="#666"></uni-icons>
        <text class="text">{{ item.text }}</text>
      </view>
    </view>

    <!-- 商品海报 -->
    <view class="goods common">
      <view class="title">商品海报</view>
      <view class="desc">只需上传商品照片并描述特征，我就能帮您创建专业级的商品海报，让您的摊位脱颖而出!</view>
      <view class="btn" @tap="openDrawer">
        <uni-icons size="28" color="#485EDE" type="camera-filled"></uni-icons>
        <text>生成商品海报</text>
      </view>
      <view class="photo">
        <image
          src="https://ts4.tc.mm.bing.net/th/id/OIP-C.K3enajFDnsFYBJzs9BM3EgHaD2?rs=1&pid=ImgDetMain&o=7&rm=3"
          mode="aspectFill"></image>
      </view>
    </view>

    <!-- 摊位宣传海报 -->
    <view class="stall common">
      <view class="title">摊位宣传海报</view>
      <view class="desc">上传多个商品照片，我将识别商品类别，生成全面的摊位宣传海报，吸引更多顾客。</view>
      <view class="btn" @tap="openDrawer">
        <uni-icons size="28" color="#485EDE" type="camera-filled"></uni-icons>
        <text>摊位宣传海报</text>
      </view>
      <view class="photo">
        <image
          src="https://tse1-mm.cn.bing.net/th/id/OIP-C.JSHUa4pENF-cjgZZr27IeAHaDt?w=307&h=175&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3"
          mode="aspectFill"></image>
      </view>
    </view>

    <view class="more">
      <view class="title">常见问题</view>
      <view class="list">
        <view class="item" v-for="item in questionsList" :key="item.id"
          :class="{active:activeIndex == item.id}">
          <view class="header">
            <view class="left">{{item.title}}</view>
            <uni-icons v-if="activeIndex !== item.id" type="down" @tap="handleSwitch(item.id)"></uni-icons>
            <uni-icons v-else type="up" @tap="handleSwitch(item.id)"></uni-icons>
          </view>
          <view class="content" v-if="activeIndex == item.id">
            {{item.answer}}
          </view>
        </view>
      </view>
    </view>

    <!-- 抽屉组件 -->
    <poster-drawer v-model:showDrawer="showDrawer" @generate="handleGeneratePoster" />
  </view>
</template>

<script setup>
import { ref } from 'vue'


// 抽屉显示状态
const showDrawer = ref(false)

// 更多操作相关状态
const moreIsView = ref(false)
const moreList = ref([{
    icon: 'color',
    text: '我的海报',
    action: 'viewMyPosters'
  },
  {
    icon: 'help',
    text: '使用教程',
    action: 'showTutorial'
  },
  {
    icon: 'info',
    text: '关于我们',
    action: 'showAbout'
  },
  {
    icon: 'clear',
    text: '清除记录',
    action: 'clearHistory'
  }
])

const keyword = ref('')
const activeIndex = ref('')

const questionsList = ref([{
    id: "1",
    title: "如何拍摄出更好的商品照片?",
    answer: "1.在自然光下拍摄，避免闪光灯直射导致反光;\n2.保持商品干净整洁，摆放整齐\n3.背景简单干净，突出商品主体,\n4.尽量从正面或45度角拍摄，展示商品全貌;\n5.确保照片清晰，对焦准确。"
  },
  {
    id: "2",
    title: "生成的海报可以修改吗?",
    answer: "是的，系统提供简单的编辑功能，您可以调整文字内容、更换背景颜色、调整布局等。如果需要更复杂的修改，可以下载海报后使用其他图片编辑软件进行调整"
  },
  {
    id: "3",
    title: "海报有哪些尺寸可以选择?",
    answer: "系统提供多种常用尺寸:\n1.摊位广告牌尺寸(80x120cm)\n2.手机分享尺寸(1:1正方形，适合微信朋友圈)\n3.长图尺寸(9:16，适合抖音、快手等短视频平台)\n4. A4打印尺寸(适合制作宣传单页)您可以根据实际需求选择合适的尺寸。"
  },
  {
    id: "4",
    title: "生成海报需要付费吗?",
    answer: "基础功能免费使用，每天可以生成3张海报。如果需要更多次数或使用高级模板和功能，可以升级到付费版，每月仅需19.9元，即可无限生成海报并使用所有高级功能。"
  }
])

// 切换常见问题显示
const handleSwitch = (id) => {
  activeIndex.value = id == activeIndex.value ? '' : id
}

// 打开抽屉
const openDrawer = () => {
  showDrawer.value = true
}

// 处理生成的海报
const handleGeneratePoster = (posterUrl) => {
  console.log('生成的海报URL:', posterUrl)
  // 可以在这里处理生成后的逻辑，比如保存记录等
}

// 更多操作相关方法
const toggleMoreList = () => {
  moreIsView.value = !moreIsView.value
}

const handleMoreAction = (action) => {
  moreIsView.value = false

  switch (action) {
    case 'viewMyPosters':
      viewMyPosters()
      break
    case 'showTutorial':
      showTutorial()
      break
    case 'showAbout':
      showAbout()
      break
    case 'clearHistory':
      clearHistory()
      break
  }
}

const viewMyPosters = () => {
  uni.navigateTo({ url: '/pages/function/my-poster' })
}

const showTutorial = () => {
  uni.showModal({
    title: '使用教程',
    content: '1. 选择海报类型\n2. 上传商品图片\n3. 填写描述信息\n4. 选择风格尺寸\n5. 生成精美海报',
    showCancel: false,
    confirmText: '知道了'
  })
}

const showAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '爱摆摊 v1.0.0\n\n专为地摊商家设计的智能海报生成工具，让您的商品宣传更专业！',
    showCancel: false,
    confirmText: '确定'
  })
}

const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除所有生成记录吗？此操作不可撤销。',
    confirmColor: '#ff6b6b',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '记录已清除',
          icon: 'success'
        })
      }
    }
  })
}

// 点击页面其他区域关闭更多菜单
const handlePageClick = (event) => {
  if (moreIsView.value) {
    moreIsView.value = false
  }
}

// 输入框聚焦
const handleInputFocus = () => {
  // 可以添加输入框聚焦时的动画效果
}

// 输入框失焦
const handleInputBlur = () => {
  // 可以添加输入框失焦时的动画效果
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  background-color: #F7F7F7;
  min-height: 100vh;
  padding-bottom: 120rpx;

  .common {
    margin: 28rpx auto;
    border-radius: 20rpx;
    width: 90vw;
    height: 580rpx;
    background-color: #FFF;
    color: black;
    box-shadow: 0 2rpx 6rpx rgba(90, 120, 234, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 1rpx 3rpx rgba(90, 120, 234, 0.2);
    }

    .title {
      padding-top: 15rpx;
      font-size: 48rpx;
      font-weight: bold;
      margin: 0 0 5rpx 30rpx;
      font-style: italic;
      background: linear-gradient(135deg, #5A78EA 0%, #8A2BE2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .desc {
      margin: 0 0 28rpx 40rpx;
      font-size: 26rpx;
      font-weight: 600;
      line-height: 1.6em;
      color: #999;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 18rpx;
      padding-left: 18rpx;
      margin: 0 0 20rpx 40rpx;
      width: 350rpx;
      height: 80rpx;
      background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
      border-radius: 24rpx;
      font-weight: 500;
      color: #5E7FDC;
      transition: all 0.3s ease;
      box-shadow: 0 2rpx 8rpx rgba(90, 120, 234, 0.2);

      &:active {
        transform: scale(0.98);
        box-shadow: 0 1rpx 4rpx rgba(90, 120, 234, 0.3);
      }
    }

    .photo {
      text-align: center;

      image {
        border: 8rpx solid #FFF;
        width: 75vw;
        height: 250rpx;
        border-radius: 12rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      }
    }
  }

  .more-list {
    position: absolute;
    top: 170rpx;
    right: 10rpx;
    background-color: #FFFFFF;
    width: 220rpx;
    border-radius: 12rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
    z-index: 1000;
    padding: 10rpx 0;
    animation: fadeInDown 0.3s ease;
    
    .item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 20rpx 15rpx;
      transition: background-color 0.2s ease;
      
      &:active {
        background-color: #f5f5f5;
      }
      
      .text {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
      
      &:not(:last-child) {
        border-bottom: 1rpx solid #f0f0f0;
      }
    }
    
    &::before {
      content: '';
      position: absolute;
      top: -10rpx;
      right: 20rpx;
      width: 0;
      height: 0;
      border-left: 10rpx solid transparent;
      border-right: 10rpx solid transparent;
      border-bottom: 10rpx solid #FFFFFF;
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .active {
    height: auto !important;
    min-height: 65rpx;
  }

  .more {
    padding: 20rpx;
    margin: 0 auto;
    margin-top: 130rpx;
    width: 95vw;
    height: 750rpx;
    border-radius: 20rpx;

    .title {
      font-weight: bold;
      font-size: 38rpx;
      color: #333;
      margin-bottom: 20rpx;
    }

    .list {
      margin-top: 28rpx;

      .item {
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 30rpx;
          padding: 20rpx;
        }

        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 15rpx;
        box-shadow: 0 0 4rpx 2rpx rgba(0, 0, 0, 0.08);
        padding: 14rpx;
        background-color: #FFF;
        height: auto;
        min-height: 70rpx;
        margin-top: 24rpx;
        color: #666;
        font-size: 28rpx;
        transition: all 0.3s ease;

        &:active {
          transform: translateY(2rpx);
          box-shadow: 0 0 2rpx 1rpx rgba(0, 0, 0, 0.08);
        }

        .content {
          margin-top: 15rpx;
          padding: 10rpx 20rpx 20rpx;
          white-space: pre-line;
          word-break: break-all;
          line-height: 1.6em;
          border-top: 1rpx solid #f0f0f0;
          animation: fadeIn 0.3s ease;
        }
      }
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

 
}


</style>