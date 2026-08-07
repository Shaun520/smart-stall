<template>
	<view class="container">
		<!-- 头部栏 -->
		<uni-nav-bar
			shadow
			status-bar
			left-icon="left"
			title="生成类似海报"
			@clickLeft="goBack"
			:fixed="true"
		/>
		
		<scroll-view class="content" scroll-y>
			<!-- 原海报预览 -->
			<view class="original-poster-section">
				<view class="section-title">
					<text>参考海报</text>
				</view>
				<view class="original-poster">
					<image 
						:src="originalPoster.image" 
						mode="aspectFill"
						class="poster-image"
					></image>
					<view class="poster-info">
						<text class="title">{{ originalPoster.title }}</text>
						<text class="desc">{{ originalPoster.description }}</text>
					</view>
				</view>
			</view>
			
			<!-- 调整选项 -->
			<view class="adjust-options-section">
				<view class="section-title">
					<text>调整选项</text>
				</view>
				
				<!-- 风格调整 -->
				<view class="option-group">
					<view class="option-title">海报风格</view>
					<view class="style-options">
						<view 
							class="style-option"
							:class="{ active: formData.style === 'simple' }"
							@click="selectStyle('simple')"
						>
							<view class="style-icon">🎨</view>
							<text class="style-text">简约风</text>
						</view>
						<view 
							class="style-option"
							:class="{ active: formData.style === 'color' }"
							@click="selectStyle('color')"
						>
							<view class="style-icon">🌈</view>
							<text class="style-text">鲜艳风</text>
						</view>
						<view 
							class="style-option"
							:class="{ active: formData.style === 'minimalist' }"
							@click="selectStyle('minimalist')"
						>
							<view class="style-icon">⚪</view>
							<text class="style-text">极简风</text>
						</view>
						<view 
							class="style-option"
							:class="{ active: formData.style === 'retro' }"
							@click="selectStyle('retro')"
						>
							<view class="style-icon">📻</view>
							<text class="style-text">复古风</text>
						</view>
					</view>
				</view>
				
				<!-- 描述调整 -->
				<view class="option-group">
					<view class="option-title">海报描述</view>
					<textarea 
						class="description-input"
						v-model="formData.description"
						placeholder="请输入新的海报描述..."
						maxlength="100"
						@input="validateDescription"
					></textarea>
					<view class="input-info">
						<text class="error-text" v-if="formErrors.description">{{ formErrors.description }}</text>
						<text class="char-count">{{ formData.description.length }}/100</text>
					</view>
				</view>
				
				<!-- 尺寸调整 -->
				<view class="option-group">
					<view class="option-title">海报尺寸</view>
					<view class="size-options">
						<view 
							class="size-option"
							:class="{ active: formData.size === '1664x2496' }"
							@click="selectSize('1664x2496')"
						>
							<text class="size-text">摊位广告牌</text>
							<text class="size-desc">80x120cm</text>
						</view>
						<view 
							class="size-option"
							:class="{ active: formData.size === '2048x2048' }"
							@click="selectSize('2048x2048')"
						>
							<text class="size-text">手机分享</text>
							<text class="size-desc">1:1正方形</text>
						</view>
						<view 
							class="size-option"
							:class="{ active: formData.size === '1440x2560' }"
							@click="selectSize('1440x2560')"
						>
							<text class="size-text">长图尺寸</text>
							<text class="size-desc">9:16比例</text>
						</view>
					</view>
				</view>
				
				<!-- 高级选项 -->
				<view class="option-group">
					<view class="option-header" @click="toggleAdvancedOptions">
						<text class="option-title">高级选项</text>
						<uni-icons 
							:type="showAdvancedOptions ? 'arrowup' : 'arrowdown'" 
							size="16" 
							color="#999"
						></uni-icons>
					</view>
					
					<view class="advanced-options" v-if="showAdvancedOptions">
						<!-- 色彩倾向 -->
						<view class="advanced-option">
							<text class="advanced-label">色彩倾向</text>
							<view class="color-options">
								<view 
									class="color-option"
									:class="{ active: formData.colorTendency === 'warm' }"
									@click="selectColorTendency('warm')"
								>
									<view class="color-dot warm"></view>
									<text>暖色调</text>
								</view>
								<view 
									class="color-option"
									:class="{ active: formData.colorTendency === 'cool' }"
									@click="selectColorTendency('cool')"
								>
									<view class="color-dot cool"></view>
									<text>冷色调</text>
								</view>
								<view 
									class="color-option"
									:class="{ active: formData.colorTendency === 'neutral' }"
									@click="selectColorTendency('neutral')"
								>
									<view class="color-dot neutral"></view>
									<text>中性色</text>
								</view>
							</view>
						</view>
						
						<!-- 布局风格 -->
						<view class="advanced-option">
							<text class="advanced-label">布局风格</text>
							<view class="layout-options">
								<view 
									class="layout-option"
									:class="{ active: formData.layout === 'balanced' }"
									@click="selectLayout('balanced')"
								>
									<text>均衡布局</text>
								</view>
								<view 
									class="layout-option"
									:class="{ active: formData.layout === 'focus' }"
									@click="selectLayout('focus')"
								>
									<text>焦点突出</text>
								</view>
								<view 
									class="layout-option"
									:class="{ active: formData.layout === 'minimal' }"
									@click="selectLayout('minimal')"
								>
									<text>极简留白</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 预览区域 -->
			<view class="preview-section" v-if="showPreview">
				<view class="section-title">
					<text>效果预览</text>
				</view>
				<view class="preview-content">
					<image 
						:src="previewImage" 
						mode="aspectFit"
						class="preview-image"
						v-if="previewImage"
					></image>
					<view class="preview-placeholder" v-else>
						<uni-icons type="image" size="48" color="#ccc"></uni-icons>
						<text class="placeholder-text">调整选项后预览效果</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<button class="btn-preview" @click="generatePreview" :disabled="generating">
				<uni-icons type="eye" size="18" color="#5A78EA"></uni-icons>
				<text>{{ generating ? '生成中...' : '预览效果' }}</text>
			</button>
			<button class="btn-generate" @click="generatePoster" :disabled="generating">
				<uni-icons type="plus" size="18" color="#fff"></uni-icons>
				<text>{{ generating ? '生成中...' : '立即生成' }}</text>
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getPosterDetailsApi } from '../../apis/poster'

const generating = ref(false)
const showAdvancedOptions = ref(false)
const showPreview = ref(false)
const previewImage = ref('')

// 原海报数据
const originalPoster = ref({})



// 表单数据
const formData = reactive({
	colorTendency: 'neutral',
	layout: 'balanced'
})

// 表单错误信息
const formErrors = reactive({
	description: ''
})

onLoad((options) => {
	if (options.id) {
		loadOriginalPoster(options.id)
	}
})

// 加载原海报数据
const loadOriginalPoster = async (id) => {
	try {
		// API调用
		const res =await getPosterDetailsApi(id)
		originalPoster.value = res.data
		
		// 初始化表单数据
		formData.style = originalPoster.value.style
		formData.description = originalPoster.value.description
		formData.size = originalPoster.value.size
		
	} catch (error) {
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	}
}

// 选择风格
const selectStyle = (style) => {
	formData.style = style
	generatePreview()
}

// 选择尺寸
const selectSize = (size) => {
	formData.size = size
	generatePreview()
}

// 选择色彩倾向
const selectColorTendency = (tendency) => {
	formData.colorTendency = tendency
	generatePreview()
}

// 选择布局
const selectLayout = (layout) => {
	formData.layout = layout
	generatePreview()
}

// 验证描述
const validateDescription = () => {
	if (!formData.description.trim()) {
		formErrors.description = '请输入海报描述'
	} else if (formData.description.length < 5) {
		formErrors.description = '描述至少需要5个字符'
	} else if (formData.description.length > 100) {
		formErrors.description = '描述不能超过100个字符'
	} else {
		formErrors.description = ''
	}
}

// 切换高级选项显示
const toggleAdvancedOptions = () => {
	showAdvancedOptions.value = !showAdvancedOptions.value
}

// 生成预览
const generatePreview = async () => {
	if (generating.value) return
	
	generating.value = true
	showPreview.value = true
	
	try {
		// 模拟AI生成预览
		await new Promise(resolve => setTimeout(resolve, 1000))
		
		// 实际开发中调用AI生成API
		// const response = await generatePreviewApi(formData)
		// previewImage.value = response.data.previewUrl
		
		// 模拟预览图片
		previewImage.value = 'https://ts1.cn.mm.bing.net/th/id/R-C.preview123?rik=Preview&pid=ImgRaw'
		
	} catch (error) {
		uni.showToast({
			title: '预览生成失败',
			icon: 'none'
		})
	} finally {
		generating.value = false
	}
}

// 生成海报
const generatePoster = async () => {
	// 验证表单
	validateDescription()
	if (formErrors.description) {
		uni.showToast({
			title: '请完善描述信息',
			icon: 'none'
		})
		return
	}
	
	generating.value = true
	
	try {
		// 调用AI生成API
		const response = await generateSimilarPosterApi({
			originalId: originalPoster.value.id,
			...formData
		})
		
		if (response.success) {
			uni.showToast({
				title: '生成成功',
				icon: 'success'
			})
			
			// 跳转到详情页
			setTimeout(() => {
				uni.redirectTo({
					url: `/pages/poster/detail?id=${response.data.id}`
				})
			}, 1500)
			
		} else {
			throw new Error('生成失败')
		}
		
	} catch (error) {
		console.error('生成海报失败:', error)
		uni.showToast({
			title: '生成失败，请重试',
			icon: 'none'
		})
	} finally {
		generating.value = false
	}
}

// 模拟API调用
const generateSimilarPosterApi = (data) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				data: {
					id: Date.now(),
					...data
				}
			})
		}, 2000)
	})
}

// 返回上一页
const goBack = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	min-height: 100vh;
}

.content {
	height: calc(100vh - 120rpx);
	padding: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
}

/* 原海报区域 */
.original-poster-section {
	background: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.original-poster {
	display: flex;
	gap: 20rpx;
	
	.poster-image {
		width: 120rpx;
		height: 160rpx;
		border-radius: 8rpx;
		flex-shrink: 0;
	}
	
	.poster-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		
		.title {
			font-size: 28rpx;
			font-weight: 600;
			color: #333;
		}
		
		.desc {
			font-size: 24rpx;
			color: #666;
			line-height: 1.4;
		}
	}
}

/* 调整选项区域 */
.adjust-options-section {
	background: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.option-group {
	margin-bottom: 40rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.option-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
}

.option-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	
	.option-title {
		margin-bottom: 0;
	}
}

/* 风格选项 */
.style-options {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
}

.style-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	padding: 20rpx;
	border: 2rpx solid #f0f0f0;
	border-radius: 12rpx;
	transition: all 0.3s ease;
	
	&.active {
		border-color: #5A78EA;
		background: #f0f4ff;
	}
	
	.style-icon {
		font-size: 40rpx;
	}
	
	.style-text {
		font-size: 24rpx;
		color: #333;
	}
}

/* 描述输入 */
.description-input {
	width: 100%;
	height: 120rpx;
	padding: 20rpx;
	background: #f8f9fa;
	border: 2rpx solid #f0f0f0;
	border-radius: 8rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	
	&:focus {
		border-color: #5A78EA;
	}
}

.input-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
	
	.error-text {
		font-size: 24rpx;
		color: #ff4d4f;
	}
	
	.char-count {
		font-size: 24rpx;
		color: #999;
	}
}

/* 尺寸选项 */
.size-options {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.size-option {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border: 2rpx solid #f0f0f0;
	border-radius: 8rpx;
	transition: all 0.3s ease;
	
	&.active {
		border-color: #5A78EA;
		background: #f0f4ff;
	}
	
	.size-text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}
	
	.size-desc {
		font-size: 24rpx;
		color: #999;
	}
}

/* 高级选项 */
.advanced-options {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.advanced-option {
	.advanced-label {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin-bottom: 15rpx;
	}
}

.color-options,
.layout-options {
	display: flex;
	gap: 20rpx;
}

.color-option,
.layout-option {
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 12rpx 20rpx;
	border: 2rpx solid #f0f0f0;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #666;
	transition: all 0.3s ease;
	
	&.active {
		border-color: #5A78EA;
		background: #f0f4ff;
		color: #5A78EA;
	}
}

.color-dot {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	
	&.warm {
		background: #ff6b6b;
	}
	
	&.cool {
		background: #4dabf7;
	}
	
	&.neutral {
		background: #adb5bd;
	}
}

/* 预览区域 */
.preview-section {
	background: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.preview-content {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 300rpx;
	border: 2rpx dashed #f0f0f0;
	border-radius: 8rpx;
}

.preview-image {
	width: 100%;
	max-height: 400rpx;
	border-radius: 8rpx;
}

.preview-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	padding: 60rpx;
	
	.placeholder-text {
		font-size: 26rpx;
		color: #999;
	}
}

/* 底部操作栏 */
.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #f0f0f0;
	display: flex;
	gap: 20rpx;
	
	button {
		flex: 1;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		font-size: 28rpx;
		border-radius: 12rpx;
		border: none;
		
		&:disabled {
			opacity: 0.6;
		}
		
		&.btn-preview {
			background: #f0f4ff;
			color: #5A78EA;
			border: 1rpx solid #5A78EA;
		}
		
		&.btn-generate {
			background: #5A78EA;
			color: #fff;
		}
	}
}

</style>