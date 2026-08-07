<!-- pages/promotion/index.vue -->
<template>
	<view>
		<uni-nav-bar status-bar title="一键推广" left-icon="left" @clickLeft="uni.navigateBack()" />
	</view>
	<view class="promotion-page">

		<!-- 主要内容区域 -->
		<view class="content-preview">
			<view class="page-header">
				<text class="page-title">推广内容预览</text>
			</view>
			<view class="page-image">
				<image mode="aspectFill"
					src="https://tse2-mm.cn.bing.net/th/id/OIP-C.Gk7Rjbfqa7h1_449GzJYuAHaEr?w=295&h=186&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3">
				</image>
			</view>
			<view class="preview-card">
				<view class="preview-title">新品上市！限时优惠活动火热进行中，精选优质商
					品，超值价格等你来抢购！</view>
				<view class="preview-tags">
					<text class="tag"># 新品上市</text>
					<text class="tag"># 限时优惠</text>
					<text class="tag"># 精选好物</text>
				</view>
			</view>
		</view>

		<!-- 平台选择 -->
		<view class="platform-section">
			<text class="section-title">选择发布预览</text>
			<view class="platform-list">
				<view v-for="platform in platforms" :key="platform.id" class="platform-item"
					:class="{ active: platform.selected }" @click="togglePlatform(platform.id)">
					<view class="platform-icon">
						<image style="width: 50rpx;height: 50rpx;" mode="aspectFill" :src="platform.icon"></image>
					</view>
					<text class="platform-name">{{ platform.name }}</text>
				</view>
			</view>
		</view>

		<!-- 定时发布 -->
		<view class="schedule-section">
			<text class="section-title">定时发布</text>
			<view class="schedule-item">
				<text class="schedule-label">发布时间</text>
				<view class="schedule-input">
					<text class="placeholder-text">{{publish_time?publish_time : '选择发布时间'}}</text>
					<uni-datetime-picker hide-second v-model="publish_time"> <uni-icons type="arrowright" size="18"
							color="#999"></uni-icons>
					</uni-datetime-picker>
				</view>
			</view>
		</view>

		<!-- 话题输入 -->
		<view class="topic-section">
			<text class="section-title">#输入相关话题</text>
			<view class="topic-input">
				<input class="topic-input-field" placeholder="输入话题，用逗号分隔" placeholder-class="placeholder-text" />
			</view>
		</view>

		<!-- 发布地点 -->
		<view class="location-section">
			<text class="section-title">发布地点</text>
			<view class="location-item">
				<view class="location-info">
					<uni-icons type="location-filled" size="18" color="#007AFF"></uni-icons>
					<text class="location-text">{{location?location: '北京市朝阳区'}}</text>
				</view>
				<view>
					<uni-data-picker placeholder="请选择省份" popup-title="请选择所在地区" :localdata="dataProvince"
						v-model="selectedArea" @change="onchange" @nodeclick="onnodeclick" @popupopened="onpopupopened"
						@popupclosed="onpopupclosed">
						<uni-icons type="arrowright" size="18" color="#999"></uni-icons>
					</uni-data-picker>
				</view>

			</view>
		</view>

		<!-- 一键发布按钮 -->
		<view class="publish-button-container">
			<button class="publish-button" @click="handlePublish">
				一键发布到所选平台
			</button>
		</view>

		<!-- 同步发布选项 -->
		<view class="sync-option">
			<label class="sync-label">
				<checkbox :checked="syncAllPlatforms" @click="syncAllPlatforms = !syncAllPlatforms" color="#007AFF" />
				<text class="sync-text">将同步发布到已选择的所有平台</text>
			</label>

		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		unref
	} from 'vue'
	import { dataTree } from '../../../utils/data';
	
	const location = ref('')

	const selectedArea = ref('');
	const dataProvince= ref(dataTree);
	
	// 事件处理函数
	const onchange = (e) => {
	  location.value = ''
	  e.detail.value.forEach((item)=>{
		  location.value += item.text 
	  })
	};
	
	const onnodeclick = (node) => {
	  console.log('节点点击:', node);
	};
	
	const onpopupopened = () => {
	  console.log('弹窗打开');
	};
	
	const onpopupclosed = () => {
	  console.log('弹窗关闭');
	};

	//当前时间
	const now = computed(() => {
		const time = new Date()
		return time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate() + ' ' + time.getHours() + ':' +
			time.getMinutes()
	})

	//发布时间
	const publish_time = ref(unref(now))

	// 平台数据
	const platforms = ref([{
			id: 1,
			name: '朋友圈',
			icon: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.ueSGG2DW9NH4GwByIeWBiAAAAA?w=173&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3',
			selected: true
		},
		{
			id: 2,
			name: '微博',
			icon: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.mECg9Q73aUCvWzuNHOIxbgHaFx?w=235&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=2&pid=3.1&rm=2&ucfimg=1',
			selected: true
		},
		{
			id: 3,
			name: 'qq',
			icon: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.ZSQm3-OzYf4bCNEUbwzYuwHaHa?w=208&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=2&pid=3.1&rm=2&ucfimg=1',
			selected: true
		},
		{
			id: 4,
			name: '小红书',
			icon: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.8fVlquYmzgxaWlIHndPcnwHaHa?w=182&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=2&pid=3.1&rm=2&ucfimg=1',
			selected: true
		}
	])

	// 同步发布状态
	const syncAllPlatforms = ref(true)

	// 切换平台选择状态
	const togglePlatform = (id) => {
		const platform = platforms.value.find(p => p.id === id)
		if (platform) {
			platform.selected = !platform.selected
		}
	}

	// 发布处理
	const handlePublish = () => {
		const selectedPlatforms = platforms.value.filter(p => p.selected)
		if (selectedPlatforms.length === 0) {
			uni.showToast({
				title: '请选择至少一个平台',
				icon: 'none'
			})
			return
		}

		uni.showLoading({
			title: '发布中...'
		})

		// 模拟发布过程
		setTimeout(() => {
			uni.hideLoading()
			uni.showToast({
				title: '发布成功',
				icon: 'success'
			})
		}, 1500)
	}
</script>

<style lang="scss" scoped>
	.promotion-page {
		padding: 20rpx 30rpx;

		min-height: 100vh;
	}

	.platform-section {
		padding: 15rpx;
		border-radius: 8rpx;
		border: 1rpx solid #F3F3F3;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 24rpx;
	}

	// 页面头部
	.page-header {
		margin-bottom: 40rpx;
	}

	.page-image {
		height: 200rpx;
		padding-left: 10rpx;

		image {
			height: 100%;
			border-radius: 15rpx;
		}
	}

	.page-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
		padding: 20rpx;
	}

	// 内容预览
	.content-preview {
		margin-bottom: 40rpx;
		border: 1rpx solid #F3F3F3;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		border-radius: 8rpx;
		padding: 15rpx;
	}

	.preview-card {
		border-radius: 20rpx;
		padding: 40rpx;

	}

	.preview-title {
		font-size: 28rpx;
		line-height: 1.5;
		margin-bottom: 20rpx;
		color: #666666;
		margin-left: -15rpx;
	}

	.preview-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		color: rgb(114, 194, 255);
		font-weight: 500;
	}

	.tag {
		background: rgba(152, 224, 255, 0.2);
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
	}

	// 平台选择
	.section-title {
		display: block;
		font-size: 28rpx;
		font-weight: 500;
		color: #666;
		margin-bottom: 24rpx;
	}

	.platform-list {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}

	.platform-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 150rpx;
		padding: 24rpx;
		border-radius: 16rpx;
		background-color: white;
		border: 2rpx solid #e0e0e0;
		transition: all 0.3s ease;
	}

	.platform-item.active {
		background-color: #f0f8ff;
	}

	.platform-icon {
		font-size: 48rpx;
		margin-bottom: 16rpx;
	}

	.platform-name {
		font-size: 26rpx;
		color: #333;
	}

	// 定时发布
	.schedule-section {
		margin-bottom: 40rpx;
	}

	.schedule-item {
		background-color: white;
		border-radius: 16rpx;
		padding: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.schedule-label {
		font-size: 28rpx;
		color: #333;
	}

	.schedule-input {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	// 话题输入
	.topic-section {
		margin-bottom: 40rpx;
	}

	.topic-input {
		background-color: white;
		border-radius: 16rpx;
		padding: 32rpx;
	}

	.topic-input-field {
		font-size: 28rpx;
		color: #333;
		width: 100%;
	}

	// 发布地点
	.location-section {
		margin-bottom: 40rpx;
	}

	.location-item {

		background-color: white;
		border-radius: 16rpx;
		padding: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.location-info {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.location-text {
		font-size: 28rpx;
		color: #333;
	}

	// 发布按钮
	.publish-button-container {
		margin: 60rpx 0 40rpx;
	}

	.publish-button {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 50rpx;
		font-size: 32rpx;
		height: 96rpx;
		line-height: 96rpx;
		border: none;

		&:after {
			border: none;
		}
	}

	// 同步选项
	.sync-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
	}

	.sync-label {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.sync-text {
		font-size: 26rpx;
		color: #666;
	}





	// 占位符文本
	.placeholder-text {
		color: #999;
		font-size: 28rpx;
	}
</style>