<template>
	<view>
		<uni-nav-bar status-bar background-color="#E7F6FC" left-icon="left"  @clickLeft="uni.navigateBack()" />
	</view>
	<view class="location-container">
		<!-- 页面标题区域 -->
		<view class="header">
			<view class="main-title">智能选址推荐</view>
			<view class="sub-title">AI分析最优营销区域</view>
		</view>
		
		<!-- 筛选条件区域 -->
		<view class="filter-section">
			<view class="filter-item">
				<view class="filter-label">行业类型</view>
				<uni-data-select
					v-model="industryValue"
					:localdata="industryRange"
					placeholder="请选择行业类型"
					clearable
					@change="industryChange"
				></uni-data-select>
			</view>

			<view class="filter-item">
				<view class="filter-label">主要目标客群</view>
				<uni-data-select
					v-model="customerValue"
					:localdata="customerRange"
					placeholder="请选择目标客群"
					clearable
					@change="customerChange"
				></uni-data-select>
			</view>
		</view>
		
		<!-- 地图区域 -->
		<view class="map-section">
			<view class="map-placeholder">
				<map name="" style="width: 100%;height: 100%;" show-location></map>
			</view>
		</view>
		
		<!-- 推荐地点列表 -->
		<view class="location-list">
			<view class="location-label">
				<view class="left">推荐地点</view>
				<view class="right">
					<uni-icons type="right" @tap="uni.navigateTo({
						url:'/pages/function/one-click-market/location-details'
					})"></uni-icons>
				</view>
			</view>
			<!-- 朝阳大悦城 -->
			<view class="location-card"  @click="selectLocation(1)">
				<view class="location-image">
					<image src="https://tse4-mm.cn.bing.net/th/id/OIP-C.QaXIOB_naEUa-D1r6CBgpAHaE-?w=234&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1" mode="aspectFill"></image>
				</view>
				<view class="location-content">
					<view class="location-header">
						<view class="location-name">朝阳大悦城</view>
						<view class="location-score">
							<uni-icons type="star-filled" size="16" color="#FFB800"></uni-icons>
							4.8
						</view>
					</view>
					<view class="location-details">
						<view class="detail-item">
							<uni-icons type="staff-filled" size="16" color="#666"></uni-icons>
							<text class="detail-text">日均客流2.3万</text>
						</view>
						<view class="detail-item">
							<uni-icons type="wallet-filled" size="16" color="#666"></uni-icons>
							<text class="detail-text">8-12万/月</text>
						</view>
					</view>
					<view class="location-tags">
						<view class="tag-item">核心商圈</view>
						<view class="tag-item">年轻客群</view>
					</view>
					<view class="check-mark" v-if="selectedLocation === 1">
						<uni-icons type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
					</view>
				</view>
			</view>
			
			<!-- 三里屯太古里 -->
			<view class="location-card"  @click="selectLocation(2)">
				<view class="location-image">
					<image src="https://tse4-mm.cn.bing.net/th/id/OIP-C.Hx5X5pa6x8SG9K5RJJJWIAHaE8?w=241&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1" mode="aspectFill"></image>
				</view>
				<view class="location-content">
					<view class="location-header">
						<view class="location-name">三里屯太古里</view>
						<view class="location-score">
							<uni-icons type="star-filled" size="16" color="#FFB800"></uni-icons>
							4.9
						</view>
					</view>
					<view class="location-details">
						<view class="detail-item">
							<uni-icons type="staff-filled" size="16" color="#666"></uni-icons>
							<text class="detail-text">日均客流3.1万</text>
						</view>
						<view class="detail-item">
							<uni-icons type="wallet-filled" size="16" color="#666"></uni-icons>
							<text class="detail-text">15-20万/月</text>
						</view>
					</view>
					<view class="location-tags">
						<view class="tag-item">高端商圈</view>
						<view class="tag-item">国际化</view>
					</view>
					<view class="check-mark" v-if="selectedLocation === 2">
						<uni-icons type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
					</view>
				</view>
			</view>
			
			<!-- 西单大悦城 -->
			<view class="location-card" @click="selectLocation(3)">
				<view class="location-image">
					<image src="https://tse3-mm.cn.bing.net/th/id/OIP-C.tRY1djdnqBEXb97KefI6ygHaE7?w=274&h=182&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1" mode="aspectFill"></image>
				</view>
				<view class="location-content">
					<view class="location-header">
						<view class="location-name">西单大悦城</view>
						<view class="location-score">
							<uni-icons type="star-filled" size="16" color="#FFB800"></uni-icons>
							4.6
						</view>
					</view>
					<view class="location-details">
						<view class="detail-item">
							<uni-icons type="staff-filled" size="16" color="#666"></uni-icons>
							<text class="detail-text">日均客流1.8万</text>
						</view>
						<view class="detail-item">
							<uni-icons type="wallet-filled" size="16" color="#666"></uni-icons>
							<text class="detail-text">6-9万/月</text>
						</view>
					</view>
					<view class="location-tags">
						<view class="tag-item">传统商圈</view>
						<view class="tag-item">学生客群</view>
					</view>
					<view class="check-mark" v-if="selectedLocation === 3">
						<uni-icons type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		
		<!-- AI成功率预测 -->
		<view class="ai-prediction">
			<view class="prediction-header">
				<view class="prediction-title">AI成功率预测</view>
				<view class="prediction-rate">
					<uni-icons type="arrow-up" size="18" color="#52C41A"></uni-icons>
					85%
				</view>
			</view>
			<view class="prediction-advantages">
				<view class="advantage-item">
					<uni-icons type="checkbox" size="16" color="#52C41A"></uni-icons>
					客流量大
				</view>
				<view class="advantage-item">
					<uni-icons type="checkbox" size="18" color="#52C41A"></uni-icons>
					租金适中
				</view>
				<view class="advantage-item">
					<uni-icons type="checkbox" size="16" color="#52C41A"></uni-icons>
					竞争度低
				</view>
				<view class="advantage-item">
					<uni-icons type="checkbox" size="16" color="#52C41A"></uni-icons>
					交通便利
				</view>
			</view>
		</view>
		
		<!-- 底部操作按钮 -->
		<view class="action-section">
			<button class="confirm-btn" :class="{ 'active': selectedLocation }" 
				@click="confirmSelection" :disabled="!selectedLocation">
				确认选择
			</button>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.location-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #e6f7ff 0%, #E9F5F8 100%);
		padding: 20rpx 30rpx 40rpx;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
	
	// 头部样式
	.header {
		text-align: center;
		margin-bottom: 30rpx;
		
		.main-title {
			font-size: 40rpx;
			font-weight: 600;
			color: #1A5B7E;
			margin-bottom: 8rpx;
			line-height: 1.4;
		}
		
		.sub-title {
			font-size: 26rpx;
			color: #666;
			line-height: 1.4;
		}
	}
	
	// 筛选条件样式
	.filter-section {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		
		.filter-item {
			display: flex;
			flex-direction: column;
			
			.filter-label {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 8rpx;
			}
		}
	}
	
	// 地图区域样式
	.map-section {
		background: #fff;
		border-radius: 16rpx;
		padding: 40rpx 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		position: relative;
		
		.map-placeholder {
			height: 300rpx;
			border-radius: 12rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
		}
	}
	
	// 地点列表样式
	.location-list {
		background: #fff;
		margin-bottom: 30rpx;
		border-radius: 16rpx;
		.location-label{
			align-items: center;
			margin-bottom: 15rpx;
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			
			border: 1rpx solid #e3e3e3;
			.left{
				font-weight: 500;
				font-size: 36rpx;
				
			}
		}
		.location-card {
			display: flex;
			padding: 24rpx;
			margin-bottom: 20rpx;
			border-bottom: 1rpx solid #e3e3e3;
			transition: all 0.2s ease;
			position: relative;
			
			&:active {
				transform: translateY(2rpx);
				box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.05);
			}
			
			.location-image {
				width: 200rpx;
				height: 150rpx;
				border-radius: 12rpx;
				overflow: hidden;
				margin-right: 20rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.location-content {
				flex: 1;
				position: relative;
			}
			
			.location-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				
				.location-name {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
				}
				
				.location-score {
					font-size: 28rpx;
					font-weight: 600;
					color: #ff7a45;
					padding: 4rpx 12rpx;
					border-radius: 8rpx;
				}
			}
			
			.location-details {
				display: flex;
				flex-wrap: wrap;
				gap: 20rpx;
				margin-bottom: 10rpx;
				
				.detail-item {
					display: flex;
					align-items: center;
					
					.detail-text {
						font-size: 24rpx;
						color: #666;
						margin-left: 8rpx;
					}
				}
			}
			
			.location-tags {
				display: flex;
				flex-wrap: wrap;
				gap: 10rpx;
				
				.tag-item {
					font-size: 22rpx;
					color: #1890ff;
					background: #e6f7ff;
					padding: 4rpx 12rpx;
					border-radius: 6rpx;
				}
			}
			
			.check-mark {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 40rpx;
				height: 40rpx;	
			}
		}
	}
	
	// AI成功率预测样式
	.ai-prediction {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx 24rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		
		.prediction-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.prediction-title {
				font-size: 28rpx;
				font-weight: 600;
				color: #333;
			}
			
			.prediction-rate {
				font-size: 36rpx;
				font-weight: 500;
				color: #52c41a;
			}
		}
		
		.prediction-advantages {
			display: flex;
			flex-wrap: wrap;
			gap: 10rpx;
			
			.advantage-item {
				font-size: 24rpx;
				color: #666;
				background: #f6ffed;
				border: 1rpx solid #b7eb8f;
				padding: 6rpx 16rpx;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				gap: 5rpx;
			}
		}
	}
	
	// 底部操作按钮样式
	.action-section {
		display: flex;
		gap: 20rpx;
		
		.confirm-btn {
			flex: 1;
			height: 96rpx;
			line-height: 96rpx;
			background: #d9d9d9;
			color: #999;
			font-size: 32rpx;
			font-weight: 500;
			border-radius: 48rpx;
			border: none;
			transition: all 0.2s ease;
			
			&.active {
				background: #1890ff;
				color: #fff;
				box-shadow: 0 8rpx 24rpx rgba(24, 144, 255, 0.3);
			}
			
			&:active.active {
				background: #096dd9;
				transform: translateY(2rpx);
				box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
			}
			
			&::after {
				border: none;
			}
		}
	}
</style>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	
	// 筛选条件数据
	const industryValue = ref('餐饮美食');
	const budgetValue = ref('5-10万/月');
	const customerValue = ref('年轻白领');
	
	const industryRange = ref([
		{ value: '餐饮美食', text: '餐饮美食' },
		{ value: '零售百货', text: '零售百货' },
		{ value: '教育培训', text: '教育培训' },
		{ value: '生活服务', text: '生活服务' },
		{ value: '娱乐休闲', text: '娱乐休闲' }
	]);
	
	const budgetRange = ref([
		{ value: '1-3万/月', text: '1-3万/月' },
		{ value: '3-5万/月', text: '3-5万/月' },
		{ value: '5-10万/月', text: '5-10万/月' },
		{ value: '10-20万/月', text: '10-20万/月' },
		{ value: '20万以上/月', text: '20万以上/月' }
	]);
	
	const customerRange = ref([
		{ value: '年轻白领', text: '年轻白领' },
		{ value: '学生群体', text: '学生群体' },
		{ value: '家庭主妇', text: '家庭主妇' },
		{ value: '中高收入', text: '中高收入' },
		{ value: '老年群体', text: '老年群体' }
	]);
	
	// 选中的地点
	const selectedLocation = ref(null);
	
	// 筛选条件变化事件
	const industryChange = (e) => {
		console.log('行业类型选择:', e);
		// 这里可以添加筛选逻辑
	};
	
	const budgetChange = (e) => {
		console.log('预算范围选择:', e);
		// 这里可以添加筛选逻辑
	};
	
	const customerChange = (e) => {
		console.log('目标客群选择:', e);
		// 这里可以添加筛选逻辑
	};
	
	// 页面加载
	onLoad(() => {
		console.log('智能选址推荐页面加载');
	});
	
	// 选择地点
	const selectLocation = (locationId) => {
		selectedLocation.value = locationId;
		console.log(`选择地点ID: ${locationId}`);
		
		// 可以在这里添加高亮效果或状态更新
		uni.showToast({
			title: '已选择地点',
			icon: 'success',
			duration: 1000
		});
	};
	
	// 确认选择
	const confirmSelection = () => {
		if (!selectedLocation.value) {
			uni.showToast({
				title: '请先选择一个地点',
				icon: 'none'
			});
			return;
		}
		
		uni.showModal({
			title: '确认选址',
			content: '确认选择当前地点作为营销活动的位置吗？',
			confirmText: '确认选择',
			cancelText: '再考虑一下',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '选址成功',
						icon: 'success'
					});
					
					// 模拟保存选择，然后返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}
			}
		});
	};
</script>
