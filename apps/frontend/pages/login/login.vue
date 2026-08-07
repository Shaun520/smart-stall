<template>
	<view class="login-container">
		<!-- Logo 文字 → 相对定位，不浮动 -->
		<view class="logo-text">
			<text class="logo-title">智慧市井</text>
			<text class="logo-slogan">让地摊经济，迈入AI时代</text>
		</view>
		<!-- 登录表单容器 -->
		<view class="form-container">
			<!-- 用户名/手机号 -->
			<view class="input-group">
				<text class="label">用户名/手机号</text>
				<view class="input-wrapper">
					<uni-icons type="person"></uni-icons>
					<input v-model="username" type="text" placeholder="请输入用户名或手机号" class="input-field" @focus="onFocus"
						@blur="onBlur" />
				</view>
			</view>

			<!-- 密码 -->
			<view class="input-group">
				<view class="password-label">
					<text class="label">{{showVerifyLogin?"验证码":"密码"}}</text>
					<text class="forget-password" @click="goForgetPassword">忘记密码？</text>
				</view>
				<view class="input-wrapper">
					<uni-icons type="locked" v-if="!showVerifyLogin"></uni-icons>
					<block v-if="!showPassword">
						<input v-model="password" :password="showVerifyLogin?false:true" :placeholder="showVerifyLogin?'请输入验证码':'请输入密码'" class="input-field"
							@focus="onFocus" @blur="onBlur" @confirm="handleLogin"/>
					</block>
					<block v-else>
						<input v-model="password" type="text" :placeholder="showVerifyLogin?'请输入验证码':'请输入密码'" class="input-field" @focus="onFocus"
							@blur="onBlur" @confirm="handleLogin"/>
					</block>
					<uni-icons @click="togglePassword" v-if="!showPassword && !showVerifyLogin"
						type="eye"></uni-icons>
					<uni-icons @click="togglePassword" v-else-if="showPassword && !showVerifyLogin"
						type="eye-slash"></uni-icons>
					<view class="btn-getCode" v-else @tap="handleGetCode">{{msg}}</view>

				</view>
			</view>

			<!-- 记住我 & 验证码登录 -->
			<view class="remember-group">
				<view class="checkbox-group">
					<checkbox style="transform: scale(0.8);" :checked="rememberMe" @change="onCheckboxChange" />
					<text>记住我</text>
				</view>
				<text class="verify-login" @click="handleSwitchWay">{{showVerifyLogin?"密码":"验证码"}}登录</text>
			</view>

			<!-- 登陆按钮 -->
			<button class="login-btn" @click="handleLogin">登录</button>

			<!-- 注册链接 -->
			<view class="register-link">
				<text>没有账号？</text>
				<text class="link-text" @click="goRegister">立即注册</text>
			</view>

			<!-- 分割线 -->
			<view class="divider">
				<text class="divider-text">或使用以下方式登陆</text>
			</view>

			<!-- 第三方登录 -->
			<view class="third-party-login">
				<uni-icons size="26" color="#32CCFE" type="qq" @click="loginWithQQ"></uni-icons>
				<uni-icons size="26" color="#51C67F" type="weixin" @click="loginWithWeChat"></uni-icons>
			</view>
		</view>

		<!-- 底部协议 -->
		<view class="footer">
			<text class="footer-text">
				注册即代表您同意我们的
				<text class="link-text" @click="goAgreement">使用条款</text>
				和
				<text class="link-text" @click="goAgreement">用户协议</text>

			</text>
		</view>
		
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import { loginApi } from '../../apis/user'
    import {onLoad} from '@dcloudio/uni-app'

	
	//输入框数据
	const username = ref('')
	const password = ref('')
	const rememberMe = ref(false)
	const showPassword = ref(false) // 是否显示密码
	const showVerifyLogin = ref(false)
	
	const msg = ref('获取验证码')  //验证码提示
	let time = null  //定时器 - 实现防抖
	
	//获取验证码逻辑函数
	const handleGetCode = ()=>{
		
		if(time) return
		 
		msg.value = 60
		time = setInterval(()=>{
			if(msg.value == 0){
				clearInterval(time)
				time = null
				msg.value = '获取验证码'
				return 
			}
			msg.value--
		},1000)
	}

	// 输入框聚焦/失焦动画
	const onFocus = () => {
		// 可以添加聚焦动画
	}
	const onBlur = () => {
		// 可以添加失焦动画
	}

	// 切换密码可见性
	const togglePassword = () => {
		showPassword.value = !showPassword.value
	}

	// checkbox 改变
	const onCheckboxChange = (e) => {
		rememberMe.value = e.detail.value
	}



	// 登录处理
	const handleLogin =async () => {
		if (!username.value || !password.value) {
			uni.showToast({
				title: '请输入用户名和密码',
				icon: 'none'
			})
			return
		}
		
		try {
				const res = await loginApi({
					username: username.value,
					phone: username.value,
					password: password.value
				})
			    
				
				//登录成功
				if(res.errno == 0){
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					})
					uni.setStorageSync('token',res.data.token)
					uni.setStorageSync('refreshToken',res.data.refreshToken)
					
					setTimeout(()=>{
						uni.reLaunch({
							url:'/pages/index/index'
						})
					},500)
				}
				else{
					uni.showToast({
						title: '登录失败',
						icon: 'none'
					})
				
				}
				  
				
			} catch (err) {
				
				uni.showToast({
					title: err.message,
					icon: 'none'
				})
			}
		
	}

	// 忘记密码
	const goForgetPassword = () => {
		uni.navigateTo({
			url: '/pages/login/forget-password'
		})
	}

	// 注册
	const goRegister = () => {
		uni.navigateTo({
			url: '/pages/login/register'
		})
	}

	// 协议
	const goAgreement = () => {
		uni.navigateTo({
			url: '/pages/agreement/agreement'
		})
	}
	
	const handleSwitchWay = ()=>{
		showVerifyLogin.value = !showVerifyLogin.value
		username.value = '',
		password.value = ''
	}
	
	//若存在token,则跳转到首页
	onLoad(()=>{
		if(uni.getStorageSync('token'))
		  uni.reLaunch({
		  	url:'/pages/index/index'
		  })
	})

	// 微信登录
	const loginWithWeChat = () => {
		uni.login({
			provider: 'weixin',
			success: (res) => {
				
				uni.showToast({
					title: '微信登录中...'
				})
			},
			fail: (err) => {
				console.error('微信登录失败:', err)
			}
		})
	}

	

	// QQ登录
	const loginWithQQ = () => {
		uni.showToast({
			title: 'QQ登录暂未开放',
			icon: 'none'
		})
	}
</script>

<style lang="scss" scoped>
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #8eceff;
		position: relative;
		overflow: visible;
	}


	.top-bg {
		width: 100%;
		height: 180rpx;
		background-color: #1E90FF;
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
		position: relative;

		left: 0;
		z-index: 1;
	}

	.title-section {
		position: absolute;
		top: 120rpx;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		color: white;
	}

	.logo-text {
		text-align: center;
		color: white;
		position: absolute;
		top: 220rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 999;
	}

	.logo-title {
		font-size: 64rpx;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

	}

	.logo-slogan {
		font-size: 32rpx;
		color: #e6f7ff;
		margin-top: 10rpx;
		display: block;
		text-align: center;
	}

	.form-container {
		margin-top: 120rpx;
		width: 80%;
		width: 660rpx;
		background-color: white;
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		z-index: 1;
	}

	.input-group {
		margin-bottom: 40rpx;
	}

	.label {
		display: block;
		font-size: 28rpx;
		margin-bottom: 20rpx;
		color: #333;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 20rpx;
		padding: 0 20rpx;
		height: 80rpx;
		position: relative;
		.btn-getCode{
			font-size: 30rpx;
		}
	}



	.input-field {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		border: none;
		outline: none;
		background: transparent;
		padding: 0 10rpx;
	}
	.password-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
	}

	.forget-password {
		color: #409eff;
		font-size: 26rpx;
	}

	.remember-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		font-size: 26rpx;
	}

	.checkbox-group {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.verify-login {
		color: #409eff;
		font-size: 26rpx;
	}

	.login-btn {
		width: 100%;
		height: 80rpx;
		background-color: #409eff;
		color: white;
		font-size: 32rpx;
		border-radius: 20rpx;
		padding: 5rpx 0;
		margin-bottom: 30rpx;
	}

	.register-link {
		text-align: center;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.link-text {
		color: #409eff;
		font-weight: bold;
	}

	.divider {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 30rpx 0;
		position: relative;

	}

	.divider::before,
	.divider::after {
		content: '';
		position: absolute;
		width: 50%;
		height: 1px;
		background-color: #ddd;
		transform: translateY(-50%);

	}

	.divider::before {
		right: 50%;
	}

	.divider::after {
		left: 50%;
	}

	.divider-text {
		font-size: 26rpx;
		color: #999;
		padding: 0 20rpx;
		background-color: white;
	}

	.third-party-login {
		display: flex;
		justify-content: center;
		gap: 60rpx;
	}


	.footer {
		margin-top: 40rpx;
		text-align: center;
		font-size: 26rpx;
		color: #ffffff;
		padding: 0 40rpx;
	}

	.footer-text .link-text {
		color: #b7ffba;
		font-weight: 400;
	}
</style>