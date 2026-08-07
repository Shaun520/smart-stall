<template>
  <view class="forgot-password-page">
    <!-- 头部 -->
    <view class="header">
      <navigator url="/pages/login/login" class="back-btn">
        <text class="iconfont">‹</text>
      </navigator>
      <text class="title">忘记密码</text>
      <text class="subtitle">请填写以下信息重置密码</text>
    </view>

    <!-- 表单容器 -->
    <view class="form-container">
      <!-- 账号输入 -->
      <view class="input-group">
        <input
          v-model="username"
          type="text"
          placeholder="请输入用户名或手机号"
          class="input-field"
        />
      </view>

      <!-- 新密码 -->
      <view class="input-group">
        <input
          v-model="newPassword"
          type="password"
          placeholder="请输入6~20位新密码"
          class="input-field"
        />
      </view>

      <!-- 确认密码 -->
      <view class="input-group">
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          class="input-field"
        />
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="resetPassword">重置密码</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 表单数据
const username = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 重置密码
const resetPassword = () => {
  // 1. 验证账号
  if (!username.value) {
    uni.showToast({ title: '请输入用户名或手机号', icon: 'none' })
    return
  }

  // 2. 验证密码长度
  if (newPassword.value.length < 6 || newPassword.value.length > 20) {
    uni.showToast({ title: '密码长度需为6-20位', icon: 'none' })
    return
  }

  // 3. 验证两次密码一致
  if (newPassword.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }

  // ✅ 模拟提交成功
  uni.showToast({ title: '密码重置成功', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack() // 返回登录页
  }, 1500)
}
</script>

<style scoped>
.forgot-password-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.header {
  padding: 70rpx 0 30rpx;
  background-color: #409eff;
  color: white;
  align-items: center;
  justify-content: flex-start;
}

.back-btn {
  font-size: 0;
  margin-right: 20rpx;
  line-height: 1;
}
.iconfont {
  color: #333;
  font-size: 100rpx;
  line-height: 1;
}

.title {
  font-size: 60rpx;
  font-weight: bold;
  padding-left: 40rpx;
  padding-right: 10rpx;
  padding-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.5;
  margin-top: 10upx;
}

.form-container {
  margin-top: 40upx;
  padding: 30rpx;
}

.input-group {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 40rpx;
  padding-bottom: 10rpx;

}
.input-group input {
  width: 100%;
  flex: 1; /* ← 关键：自动占剩余空间 */
  height: 80rpx;
  border-bottom: 1px solid #ccc;
  font-size: 32rpx;
  color: #333;
  outline: none;
  min-width: 0; /* 防止 flex 子项最小宽度限制 */
  padding: 0;
}

.input-field {
  flex: 1;
  height: 80rpx;
  border-bottom: 1px solid #ccc;
  font-size: 32rpx;
  padding: 0;
 
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  margin: 60rpx auto 0;
  background-color: #409eff;
  color: white;
  font-size: 36rpx;
  border-radius: 40rpx;
  line-height: 80rpx;
  text-align: center;
}
</style>