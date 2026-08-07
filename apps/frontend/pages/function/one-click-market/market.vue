<template>
	<view>
		<uni-nav-bar status-bar background-color="#E7F6FC" left-icon="left"  @clickLeft="uni.navigateBack()" />
	</view>
	<view class="marketing-container">
		<!-- 页面标题区域 -->
		<view class="header">
			<view class="main-title">一键营销</view>
			<view class="sub-title">智能化营销解决方案</view>
		</view>

		<!-- 流程指示器 -->
		<view class="process-indicator">
			<view class="process-step active">
				<view class="step-circle">1</view>
				<view class="step-label">选址规划</view>
			</view>
			<view class="process-step">
				<view class="step-circle">2</view>
				<view class="step-label">商品配置</view>
			</view>
			<view class="process-step">
				<view class="step-circle">3</view>
				<view class="step-label">广告设计</view>
			</view>
			<view class="process-step">
				<view class="step-circle">4</view>
				<view class="step-label">完成发布</view>
			</view>
		</view>

		<!-- 功能模块 -->
		<view class="function-modules">
			<!-- 智能选址推荐 -->
			<view class="module-card" @click="handleModuleClick('location')">
				<view class="module-icon">
					<uni-icons type="location-filled" size="24" color="#1890ff"></uni-icons>
				</view>
				<view class="module-content">
					<view class="module-title">智能选址推荐</view>
					<view class="module-desc">根据用户画像推荐最佳营销区域</view>
				</view>
				<view class="module-action">
					<view class="module-link" v-if="!modules[0].completed">开始规划</view>
					<uni-icons v-if="modules[0].completed" type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
					<uni-icons v-if="!modules[0].completed" type="right" size="16" color="#32ADE6"></uni-icons>
				</view>
			</view>

			<!-- 商品智能匹配 -->
			<view class="module-card" @click="handleModuleClick('goods')">
				<view class="module-icon">
					<uni-icons type="shop" size="24" color="#1890ff"></uni-icons>
				</view>
				<view class="module-content">
					<view class="module-title">商品智能匹配</view>
					<view class="module-desc">根据区域特征匹配最优商品组合</view>
				</view>
				<view class="module-action">
					<view class="module-link" v-if="!modules[1].completed">配置商品</view>
					<uni-icons v-if="modules[1].completed" type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
					<uni-icons v-if="!modules[1].completed" type="right" size="16" color="#32ADE6"></uni-icons>
				</view>
			</view>

			<!-- AI广告生成 -->
			<view class="module-card" @click="handleModuleClick('poster')">
				<view class="module-icon">
					<uni-icons type="image" size="24" color="#1890ff"></uni-icons>
				</view>
				<view class="module-content">
					<view class="module-title">AI广告生成</view>
					<view class="module-desc">自动生成符合品牌调性的营销素材</view>
				</view>
				<view class="module-action">
					<view class="module-link" v-if="!modules[2].completed">设计广告</view>
					<uni-icons v-if="modules[2].completed" type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
					<uni-icons v-if="!modules[2].completed" type="right" size="16" color="#32ADE6"></uni-icons>
				</view>
			</view>

			<!-- 一键发布推广 -->
			<view class="module-card" @click="handleModuleClick('publish')">
				<view class="module-icon">
					<uni-icons type="paperplane" size="24" color="#1890ff"></uni-icons>
				</view>
				<view class="module-content">
					<view class="module-title">一键发布推广</view>
					<view class="module-desc">多渠道同步发布营销活动</view>
				</view>
				<view class="module-action">
					<view class="module-link" v-if="!modules[3].completed">立即发布</view>
					<uni-icons v-if="modules[3].completed" type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
					<uni-icons v-if="!modules[3].completed" type="right" size="16" color="#32ADE6"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 开始营销按钮 -->
		<view class="action-section">
			<button class="start-marketing-btn" :class="{ 'disabled-btn': !allModulesCompleted }" 
				@click="startMarketing" :disabled="!allModulesCompleted">
				开始营销
			</button>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.marketing-container {
		height: 100vh;
		background: linear-gradient(135deg, #e6f7ff 0%, #E9F5F8 100%);
		padding: 20rpx 30rpx 40rpx;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	// 头部样式
	.header {
		border-radius: 16rpx;
		padding: 0 30rpx;
		text-align: center;

		.main-title {
			font-size: 48rpx;
			font-weight: 500;
			color: #1A5B7E;
			margin-bottom: 12rpx;
			line-height: 1.4;
		}

		.sub-title {
			font-size: 28rpx;
			color: #666;
			line-height: 1.4;
		}
	}

	// 流程指示器样式
	.process-indicator {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
		margin-bottom: 40rpx;

		.process-step {
			display: flex;
			flex-direction: column;
			align-items: center;
			flex: 1;
			position: relative;

			&:not(:last-child)::after {
				content: '';
				position: absolute;
				top: 20rpx;
				right: -50%;
				width: 100%;
				height: 4rpx;
				background: #D1D5DB;
				z-index: 1;
			}

			&.active {
				.step-circle {
					background: #32ADE6;
					color: #fff;
					border-color: #32ADE6;
					font-weight: 600;
				}

				.step-label {
					color: #32ADE6;
					font-weight: 500;
				}

				&:not(:last-child)::after {
					background: linear-gradient(to right, #1890ff 0%, #f0f0f0 100%);
				}
			}

			.step-circle {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				border: 2rpx solid #d9d9d9;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #999;
				margin-bottom: 12rpx;
				background: #fff;
				z-index: 2;
				position: relative;
			}

			.step-label {
				font-size: 24rpx;
				color: #999;
				line-height: 1.4;
			}
		}
	}

	// 功能模块样式
	.function-modules {
		width: 90vw;
		margin: 0 auto;
		.module-card {
			display: flex;
			align-items: center;
			background: #fff;
			border-radius: 16rpx;
			padding: 30rpx 24rpx;
			margin-bottom: 24rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			transition: all 0.2s ease;

			&:active {
				transform: translateY(2rpx);
				box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.05);
			}

			.module-icon {
				width: 80rpx;
				height: 80rpx;
				background: #e6f7ff;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 24rpx;
				flex-shrink: 0;
			}

			.module-content {
				flex: 1;

				.module-title {
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
					margin-bottom: 8rpx;
					line-height: 1.4;
				}

				.module-desc {
					font-size: 24rpx;
					color: #999;
					margin-bottom: 12rpx;
					line-height: 1.4;
				}
			}

			.module-action {
				display: flex;
				align-items: center;
				margin-left: 20rpx;
				
				.module-link {
					font-size: 24rpx;
					color: #32ADE6;
					font-weight: 500;
					line-height: 1.4;
					margin-right: 8rpx;
				}
			}
		}
	}

	// 底部操作区域样式
	.action-section {
		margin-top: 40rpx;
		text-align: center;

		.start-marketing-btn {
			width: 100%;
			height: 96rpx;
			line-height: 96rpx;
			background: #1890ff;
			color: #fff;
			font-size: 36rpx;
			font-weight: 600;
			border-radius: 48rpx;
			border: none;
			box-shadow: 0 8rpx 24rpx rgba(24, 144, 255, 0.3);
			transition: all 0.2s ease;

			&:active {
				background: #096dd9;
				transform: translateY(2rpx);
				box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
			}

			&::after {
				border: none;
			}

			&.disabled-btn {
				background: #d9d9d9;
				color: #999;
				box-shadow: none;
				opacity: 0.7;
			}
		}
	}
</style>

<script setup>
	import { ref, computed } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	// 响应式数据
	const currentStep = ref(1);
	const modules = ref([
		{
			id: 'location',
			title: '智能选址推荐',
			desc: '根据用户画像推荐最佳营销区域',
			linkText: '开始规划',
			icon: 'location-filled',
			completed: false
		},
		{
			id: 'goods',
			title: '商品智能匹配',
			desc: '根据区域特征匹配最优商品组合',
			linkText: '配置商品',
			icon: 'shop',
			completed: false
		},
		{
			id: 'poster',
			title: 'AI广告生成',
			desc: '自动生成符合品牌调性的营销素材',
			linkText: '设计广告',
			icon: 'image',
			completed: false
		},
		{
			id: 'publish',
			title: '一键发布推广',
			desc: '多渠道同步发布营销活动',
			linkText: '立即发布',
			icon: 'paperplane',
			completed: false
		}
	]);

	// 计算属性：检查所有模块是否已完成
	const allModulesCompleted = computed(() => {
		return modules.value.every(module => module.completed);
	});

	// 页面加载
	onLoad(() => {
		console.log('一键营销页面加载');
	});

	// 处理模块点击
	const handleModuleClick = (moduleId) => {
		
		uni.navigateTo({
			url:'/pages/function/one-click-market/smart-choose-' + moduleId
		})

		// 根据模块ID进行不同处理
		switch (moduleId) {
			case 'location':
				uni.showToast({
					title: '开始智能选址规划',
					icon: 'success'
				});
				break;
			case 'product':
				uni.showToast({
					title: '进入商品配置',
					icon: 'success'
				});
				break;
			case 'ad':
				uni.showToast({
					title: '开始广告设计',
					icon: 'success'
				});
				break;
			case 'publish':
				uni.showToast({
					title: '进入发布页面',
					icon: 'success'
				});
				break;
		}

		// 更新模块状态
		const moduleIndex = modules.value.findIndex(item => item.id === moduleId);
		if (moduleIndex !== -1) {
			modules.value[moduleIndex].completed = true;
		}
	};

	// 开始营销
	const startMarketing = () => {
		if (!allModulesCompleted.value) {
			uni.showToast({
				title: '请先完成所有功能模块',
				icon: 'none'
			});
			return;
		}

		uni.showLoading({
			title: '启动营销流程中...',
			mask: true
		});

		// 模拟API调用
		setTimeout(() => {
			uni.hideLoading();

			uni.showModal({
				title: '启动成功',
				content: '营销流程已启动，预计5-10分钟完成。请按步骤完成各项配置。',
				confirmText: '开始配置',
				cancelText: '稍后再说',
				success: (res) => {
					if (res.confirm) {
						// 跳转到第一个步骤
						handleModuleClick('location');
					}
				}
			});
		}, 1500);
	};
</script>
