<template>
	<view class="register-page">
		<!-- 头部 -->
		<view class="header">
			<navigator url="/pages/login/login" class="back-btn">
				<uni-icons size="30" type="left"></uni-icons>
			</navigator>
			<text class="title">注册</text>
			<text class="subtitle">欢迎使用智慧市井</text>
		</view>

		<!-- 表单 -->
		<view class="form-container">
			<!-- 国家/地区 -->
			<picker @change="onCountryChange" :value="countryIndex >= 0 ? countryIndex : 0" :range="countries">
				<view class="picker-item">
					<text>{{ countryIndex >= 0 ? countries[countryIndex] : '请选择国家/地区' }}</text>
					<text class="arrow">▼</text>
				</view>
			</picker>

			<!-- 手机号 -->
			<view class="input-group">
				<text class="prefix">+86</text>
				<input v-model="phone" type="tel" placeholder="请输入手机号码" class="input-field" />
			</view>

			<!-- 验证码 -->
			<view class="input-group">
				<input v-model="code" type="text" placeholder="请输入验证码" />
				<view class="get-code-btn" :class="{ disabled: !canGetCode }" @click="canGetCode && getCode()">
					{{ canGetCode ? '获取验证码' : `${countdown}s 后重试` }}
				</view>
			</view>

			<!-- 密码 -->
			<view class="input-group">
				<input v-model="password" type="password" placeholder="请输入6~20位密码" />
			</view>

			<!-- 确认密码 -->
			<view class="input-group">
				<input v-model="confirmPassword" type="password" placeholder="请再次输入密码" />
			</view>
		</view>

		<!-- 注册按钮 -->
		<button class="register-btn" @click="handleRegister">注册</button>

		<!-- 返回登录 -->
		<navigator url="/pages/login/login" class="login-link">
			<text>返回登录</text>
		</navigator>

		<!-- 用户协议 -->
		<view class="agreement">
			<text>未注册手机号登录后将自动生成账号且代表</text>
			<text class="agree-text">已阅读并同意《用户协议》</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	// 数据定义
	const countries = ['中国', '美国', '日本']
	const countryIndex = ref(-1)
	const phone = ref('')
	const code = ref('')
	const password = ref('')
	const confirmPassword = ref('')
	const countdown = ref(0) // 倒计时剩余秒数
	const canGetCode = computed(() => countdown.value === 0) // 是否可以获取验证码

	//验证码
	const getCode = () => {
		if (!phone.value) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}

		if (!canGetCode.value) {
			return // 倒计时期间禁止重复点击
		}

		// 模拟发送验证码
		uni.showToast({
			title: '验证码已发送',
			icon: 'success'
		})

		// 启动 60 秒倒计时
		countdown.value = 60
		const timer = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0) {
				clearInterval(timer)
			}
		}, 1000)
	}
	// 选择国家
	const onCountryChange = (e) => {
		countryIndex.value = e.detail.value // 更新索引
		console.log('选中了:', countries[e.detail.value]) // 可选：调试用
	}

	// 注册逻辑
	const handleRegister = () => {
		if (!phone.value) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}
		if (!code.value) {
			uni.showToast({
				title: '请输入验证码',
				icon: 'none'
			})
			return
		}
		if (password.value.length < 6 || password.value.length > 20) {
			uni.showToast({
				title: '密码长度需为6-20位',
				icon: 'none'
			})
			return
		}
		if (password.value !== confirmPassword.value) {
			uni.showToast({
				title: '两次密码不一致',
				icon: 'none'
			})
			return
		}

		// 提交注册逻辑（可调用 API）
		uni.showToast({
			title: '注册成功',
			icon: 'success'
		})
	}
</script>

<style lang="scss" scoped>
	.register-page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {

		padding: 80rpx 0 30rpx;
		/* 上移：减少顶部内边距 */
		background-color: #409eff;
		color: white;

	}
	.back-btn {
	  font-size: 0;
	  margin-right: 20rpx;
	  line-height: 1;
	}



	.title {
		font-size: 60rpx;
		font-weight: bold;
		padding-left: 50rpx;
		padding-right: 10rpx;

	}

	.subtitle {
		font-size: 28rpx;
		opacity: 0.5;
		margin-top: 10upx;
	}

	.form-container {
		padding: 30rpx;
		margin-top: 40upx;
	}

	.picker-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80upx;
		border-bottom: 1px solid #ccc;
		font-size: 32upx;
		color: #666;
	}

	.arrow {
		font-size: 28upx;
	}

	.input-group {
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 40rpx;
		padding-bottom: 10rpx;

	}



	.prefix {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 80upx;
		text-align: center;
		line-height: 80upx;
		font-size: 32upx;
		color: #333;
		margin-right: 10rpx;
		border-right: solid #ccc;
		z-index: 1;
	}


	.input-group input {
		width: 100%;
		flex: 1;
		/* ← 关键：自动占剩余空间 */
		height: 80rpx;
		border-bottom: 1px solid #ccc;
		font-size: 32rpx;
		color: #333;
		outline: none;
		min-width: 0;
		/* 防止 flex 子项最小宽度限制 */
		padding: 0;
	}

	.input-group input {
		width: 100%;
		height: 80rpx;
		border-bottom: 1px solid #ccc;
		font-size: 32rpx;
		color: #333;
		outline: none;
		padding: 0;
	}

	.input-field {
		flex: 1;
		height: 80rpx;
		border-bottom: 1px solid #ccc;
		font-size: 32rpx;
		padding: 0;
		margin-left: 100rpx;
	}




	.get-code-btn {
		position: absolute;
		top: -20rpx;
		/* 在输入框上方 40rpx */
		right: 0;
		width: 165rpx;
		height: 80rpx;
		background-color: #409eff;
		color: white !important;
		font-size: 30rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 80rpx;
		cursor: pointer;
	}

	.get-code-btn.disabled {
		background-color: #cccccc;
		color: #999 !important;
		opacity: 0.7;
		cursor: not-allowed;
	}

	.register-btn {
		width: 100%;
		height: 80upx;
		margin: 60upx auto 0;
		background-color: #409eff;
		color: white;
		font-size: 36upx;
		border-radius: 40upx;
	}

	.login-link {
		display: block;
		text-align: center;
		margin: 40upx auto;
		color: #333;
		font-size: 32upx;
	}

	.agreement {
		text-align: center;
		font-size: 28upx;
		color: #666;
		margin-top: 120upx;
	}

	.agree-text {
		color: #409eff;
		font-weight: bold;
		display: block;
	}
</style>