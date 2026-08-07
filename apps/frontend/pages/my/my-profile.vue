<template>
	<view class="container">
		<!-- 导航栏：标题 + 保存按钮 -->
		<uni-nav-bar status-bar left-icon="left" title="隔壁老王" @clickLeft="uni.navigateBack()" @clickRight="onSave()" :fixed="true">
			<template #right>
				<view class="save-btn">
					保存
				</view>
			</template>
		</uni-nav-bar>

		<!-- 表单主体 -->
		<view class="form">
			<!-- 头像 -->
			<view class="field avatar-field">
				<text class="label">头像</text>
				<view class="avatar-box" @tap="selectAvatar">
					<image :src="formData.avatar" class="avatar" mode="aspectFill" />
					<text class="change-text">更换头像</text>
				</view>
				<text class="error-message" v-if="errors.avatar">{{ errors.avatar }}</text>
			</view>

			<!-- 用户名 -->
			<view class="field">
				<text class="label">用户名</text>
				<input v-model="formData.username" class="input" :class="{ error: errors.username }" placeholder="请输入用户名" 
					@input="clearError('username')" @blur="validateField('username')" />
				<text class="error-message" v-if="errors.username">{{ errors.username }}</text>
			</view>

			<!-- 昵称 -->
			<view class="field">
				<text class="label">昵称</text>
				<input v-model="formData.nickname" class="input" :class="{ error: errors.nickname }" placeholder="请输入昵称" 
					@input="clearError('nickname')" @blur="validateField('nickname')" />
				<text class="error-message" v-if="errors.nickname">{{ errors.nickname }}</text>
			</view>

			<!-- 手机号码 -->
			<view class="field">
				<text class="label">手机号码</text>
				<input disabled v-model="formData.phone" class="input" :class="{ error: errors.phone }" type="number" maxlength="11"
					placeholder="请输入手机号码" @input="clearError('phone')" @blur="validateField('phone')" />
				<text class="error-message" v-if="errors.phone">{{ errors.phone }}</text>
			</view>

			<!-- 邮箱 -->
			<view class="field">
				<text class="label">邮箱</text>
				<input v-model="formData.email" class="input" :class="{ error: errors.email }" type="email" placeholder="请输入邮箱" 
					@input="clearError('email')" @blur="validateField('email')" />
				<text class="error-message" v-if="errors.email">{{ errors.email }}</text>
			</view>

			<!-- 性别 -->
			<view class="field">
				<text class="label">性别</text>
				<radio-group @change="onGenderChange">
					<label v-for="g in ['男', '女', '其他']" :key="g" class="radio-item">
						<radio :value="g" :checked="formData.gender === g" color="#007AFF" />
						<text class="radio-label">{{ g }}</text>
					</label>
				</radio-group>
				<text class="error-message" v-if="errors.gender">{{ errors.gender }}</text>
			</view>

			<!-- 个性签名 -->
			<view class="field">
				<text class="label">个性签名</text>
				<textarea v-model="formData.sign" class="textarea" :class="{ error: errors.sign }" placeholder="说点什么..." maxlength="50" auto-height 
					@input="clearError('sign')" @blur="validateField('sign')" />
				<text class="char-count">{{ formData.sign?.length || 0 }}/50</text>
				<text class="error-message" v-if="errors.sign">{{ errors.sign }}</text>
			</view>
		</view>

		<!-- 其他设置 -->
		<view class="section-title">其他设置</view>
		<view class="settings-list">
			<navigator url="/pages/setting/privacy" hover-class="item-hover" class="setting-item">
				隐私设置
			</navigator>
			<navigator url="/pages/setting/security" hover-class="item-hover" class="setting-item">
				账号安全
			</navigator>
		</view>

		<!-- 取消按钮（底部居中） -->
		<view class="bottom-action">
			<button class="btn-cancel" @tap="onCancel">取消</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import { editApi } from '../../apis/user'

	const user = uni.getStorageSync('user')

	// 表单数据
	const formData = reactive({
		avatar: user?.avatar || '',
		username: user?.username || '',
		nickname: user?.nickname || '',
		phone: user?.phone || '',
		email: user?.email || '',
		gender: user?.gender || '男',
		sign: user?.sign || ''
	})

	// 错误信息
	const errors = ref({})

	// 校验规则
	const rules = {
		required: (message) => (value) => {
			if (value === null || value === undefined || value === '') {
				return message || '该字段为必填项'
			}
			return ''
		},
		minLength: (min, message) => (value) => {
			if (value && value.length < min) {
				return message || `至少需要${min}个字符`
			}
			return ''
		},
		maxLength: (max, message) => (value) => {
			if (value && value.length > max) {
				return message || `不能超过${max}个字符`
			}
			return ''
		},
		pattern: (regex, message) => (value) => {
			if (value && !regex.test(value)) {
				return message
			}
			return ''
		}
	}

	// 表单校验规则配置
	const formRules = {
		username: [
			rules.required('用户名不能为空'),
			rules.minLength(2, '用户名至少2个字符'),
			rules.maxLength(20, '用户名不能超过20个字符'),
			rules.pattern(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, '用户名只能包含中文、英文、数字和下划线')
		],
		nickname: [
			rules.maxLength(20, '昵称不能超过20个字符')
		],
		phone: [
			rules.pattern(/^1[3-9]\d{9}$/, '请输入正确的手机号码')
		],
		email: [
			rules.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, '请输入正确的邮箱地址')
		],
		sign: [
			rules.maxLength(50, '个性签名不能超过50个字符')
		]
	}

	// 单个字段校验
	const validateField = (field) => {
		const fieldRules = formRules[field]
		if (!fieldRules) return true
		
		const value = formData[field]
		let isValid = true
		
		for (const rule of fieldRules) {
			const error = rule(value)
			if (error) {
				errors.value[field] = error
				isValid = false
				break
			}
		}
		
		if (isValid) {
			delete errors.value[field]
		}
		
		return isValid
	}

	// 清空错误信息
	const clearError = (field) => {
		if (errors.value[field]) {
			delete errors.value[field]
		}
	}

	// 整体表单校验
	const validateForm = () => {
		errors.value = {}
		let isValid = true
		
		Object.keys(formRules).forEach(field => {
			if (!validateField(field)) {
				isValid = false
			}
		})
		
		return isValid
	}

	// 选择头像
	function selectAvatar() {
		uni.showActionSheet({
			itemList: ['拍照', '从相册选择'],
			success: (res) => {
				const sourceType = res.tapIndex === 0 ? 'camera' : 'album'
				chooseImage(sourceType)
			}
		})
	}

	function chooseImage(sourceType) {
		uni.chooseImage({
			count: 1,
			mediaType: ['image'],
			sourceType: [sourceType],
			success: async (res) => {
				// 图片上传前的简单校验
				const tempFile = res.tempFiles[0]
				if (tempFile.size > 5 * 1024 * 1024) { // 5MB限制
					errors.value.avatar = '图片大小不能超过5MB'
					return
				}
				
				// 清除之前的错误
				clearError('avatar')
				
				// //进行图片上传---获得永久url
				// const res1 = await axios.post('https://api.imgbb.com/1/upload?key=46cc62d65f788f89c3d9d652fcc3d6df',
				// {image:res.tempFiles[0]},{headers:{'Content-Type':'multipart/form-data'}}
				// )

				// formData.avatar = res1.data.data.display_url
				
				// 临时显示图片
				formData.avatar = res.tempFilePaths[0]
			},
			fail: (err) => {
				if (!err.errMsg.includes('cancel')) {
					uni.showToast({
						title: '选择失败',
						icon: 'none'
					})
				}
			}
		})
	}

	// 性别选择
	function onGenderChange(e) {
		formData.gender = e.detail.value
		clearError('gender')
	}

	// 保存
	async function onSave() {
		// 先进行表单校验
		if (!validateForm()) {
			// 显示第一个错误
			const firstError = Object.values(errors.value)[0]
			uni.showToast({
				title: firstError,
				icon: 'none',
				duration: 2000
			})
			return
		}
		
		// 额外的必填校验
		if (!formData.username.trim()) {
			uni.showToast({
				title: '请输入用户名',
				icon: 'none'
			})
			return
		}
		try {
			//保存信息逻辑
			const res = await editApi({
				username:formData.username,
				nickname:formData.nickname,
				avatar:formData.avatar,
				email:formData.email,
		        gender:formData.gender,
				sign:formData.sign
			})
			if(res.errno == 0){
				//存储
				uni.setStorageSync('user',res.data)
				setTimeout(() => {
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					})
					uni.navigateBack()
				}, 800)
			}else{
				uni.showToast({
					title:"保存异常"
				})
			}
		} catch (err) {
			uni.showToast({
				title: "保存失败"
			})
		}
	}

	// 取消
	function onCancel() {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	$primary: #007aff;
	$text: #333;
	$border: #ddd;
	$bg: #f8f9fa;
	$error: #ff5500;

	.container {
		min-height: 100vh;
		background-color: $bg;
		padding: 0;
	}

	.save-btn {
		width: 100rpx;
		height: 60rpx;
		border-radius: 8rpx;
		border: 1rpx solid #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 表单区 */
	.form {
		background: #fff;
		margin: 20rpx 30rpx;
		padding: 20rpx 20rpx 40rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.06);
	}

	.field {
		margin-bottom: 40rpx;
		position: relative;
	}

	.label {
		font-size: 30rpx;
		color: $text;
		margin-bottom: 16rpx;
		display: block;
		font-weight: 500;
	}

	.input,
	.textarea {
		width: 93%;
		padding: 20rpx;
		border: 1rpx solid $border;
		border-radius: 8rpx;
		font-size: 28rpx;
		background-color: #fdfdfd;
		transition: border-color 0.3s;
		
		&.error {
			border-color: $error;
			background-color: #fffafa;
		}
	}

	.input:focus,
	.textarea:focus {
		border-color: $primary;
	}

	/* 错误信息样式 */
	.error-message {
		font-size: 24rpx;
		color: $error;
		margin-top: 8rpx;
		display: block;
		min-height: 36rpx;
	}

	/* 头像行 */
	.avatar-field {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.avatar-field .label {
		flex: none;
		width: 100%;
		text-align: left;
	}

	/* 样式部分：更新为垂直布局 */
	.avatar-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		border: 2rpx solid #007aff;
	}

	.change-text {
		font-size: 24rpx;
		color: #007aff;
		margin-top: 12rpx;
		text-align: center;
	}

	/* 性别 */
	.radio-item {
		margin-right: 30rpx;
		display: inline-flex;
		align-items: center;
	}

	.radio-label {
		margin-left: 8rpx;
		font-size: 28rpx;
		color: #555;
	}

	/* 个性签名 */
	.char-count {
		font-size: 24rpx;
		color: #999;
		text-align: right;
		margin-top: 10rpx;
	}

	/* 其他设置标题 */
	.section-title {
		margin: 50rpx 30rpx 20rpx;
		font-size: 26rpx;
		color: #666;
	}

	/* 设置列表 */
	.settings-list {
		margin: 0 30rpx;
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.06);
	}

	.setting-item {
		padding: 30rpx 20rpx;
		font-size: 30rpx;
		color: $text;
		border-bottom: 1rpx solid $border;

		&:last-child {
			border-bottom: none;
		}
	}

	.item-hover {
		background-color: #f0f0f0;
	}

	/* 底部取消按钮 */
	.bottom-action {
		padding: 40rpx 30rpx;
		text-align: center;
	}

	.btn-cancel {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background: #f1f1f1;
		color: #333;
		font-size: 30rpx;
		border-radius: 10rpx;
		border: 1rpx solid #ddd;
	}

	.btn-cancel::after {
		border: none;
	}
</style>