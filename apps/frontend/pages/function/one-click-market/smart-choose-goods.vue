<template>
	<view @tap="handlePageClick">
		<!-- 导航栏 -->
		<view @tap.stop="">
			<uni-nav-bar @clickRight="moreIsView = true" right-icon="more-filled" status-bar background-color="#E7F6FC"
				left-icon="left" @clickLeft="uni.navigateBack()" />
		</view>
		<!-- 更多操作列表 -->
		<view class="more-list" v-if='moreIsView'>
			<view class="item" v-for="(item, index) in moreList" :key="index" @tap.stop="handleMoreAction">
				<uni-icons :type="item.icon" size="16" color="#666"></uni-icons>
				<text class="text">{{ item.text }}</text>
			</view>
		</view>

		<view class="product-container">
			<!-- 页面标题 -->
			<view class="header">
				<view class="main-title">摆摊选品配置</view>
				<view class="sub-title">智能商品匹配与定价策略</view>
			</view>
			<!-- AI推荐概览 -->

			<view class="overview-section">
				<view class="section-title">AI推荐概览</view>
				<view class="overview-cards">
					<view class="overview-card">
						<view class="card-icon">
							<uni-icons type="shop" size="24" color="#1890ff"></uni-icons>
						</view>
						<view class="card-content">
							<view class="card-label">推荐商品</view>
							<view class="card-value">5</view>
						</view>
					</view>

					<view class="overview-card">
						<view class="card-icon">
							<uni-icons type="star-filled" size="24" color="#faad14"></uni-icons>
						</view>
						<view class="card-content">
							<view class="card-label">匹配度</view>
							<view class="card-value highlight">88%</view>
						</view>
					</view>
					<view class="overview-card">
						<view class="card-icon">
							<uni-icons type="wallet" size="24" color="#52c41a"></uni-icons>
						</view>
						<view class="card-content">
							<view class="card-label">预期利润</view>
							<view class="card-value success">65%</view>

						</view>
					</view>

					<view class="overview-card">
						<view class="card-icon">
							<uni-icons type="shop" size="24" color="#52c41a"></uni-icons>
						</view>
						<view class="card-content">
							<view class="card-label">库存充足</view>
							<view class="card-value success">92%</view>

						</view>
					</view>

				</view>
			</view>

			<!-- 智能推荐商品 -->
			<view class="product-section">
				<view class="section-title">
					<view class="left">智能推荐商品</view>
					<view class="right">
						<uni-icons type="right" @tap="uni.navigateTo({
							url:'/pages/function/one-click-market/goods-details'
						})"></uni-icons>
					</view>
				</view>

				<!-- 商品卡片1 -->
				<view class="product-card">
					<view class="product-image">
						<image
							src="https://tse2-mm.cn.bing.net/th/id/OIP-C.7v_k57ddqTtDadxx8H7FyAHaE7?w=225&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3"
							mode="aspectFill" class="product-img"></image>
						<view class="product-tags">
							<view class="product-tag red">高利润</view>
							<view class="product-tag blue">易销售</view>
						</view>
					</view>
					<view class="product-info">
						<view class="product-name">网红爆款薯片组合装</view>
						<view class="price-info">
							<view class="price-item">
								<view class="price-label">进货价</view>
								<view class="price-value">￥8.5</view>
							</view>
							<view class="price-item">
								<view class="price-label">建议售价</view>
								<view class="price-value highlight">￥15</view>
							</view>
							<view class="price-item">
								<view class="price-label">预期利润</view>
								<view class="profit-value success">76%</view>
							</view>
						</view>
						<button class="add-btn" @click="addToConfig(1)">加入配置</button>
					</view>
				</view>

				<!-- 商品卡片2 -->
				<view class="product-card">
					<view class="product-image">
						<image
							src="https://tse2-mm.cn.bing.net/th/id/OIP-C.jn_FTvJBryRmyAsH73CASAHaE7?w=276&h=184&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3"
							mode="aspectFill" class="product-img"></image>
						<view class="product-tags">
							<view class="product-tag red">高利润</view>
							<view class="product-tag orange">学生喜爱</view>
						</view>
					</view>
					<view class="product-info">
						<view class="product-name">进口巧克力礼盒</view>
						<view class="price-info">
							<view class="price-item">
								<view class="price-label">进货价</view>
								<view class="price-value">￥20</view>
							</view>
							<view class="price-item">
								<view class="price-label">建议售价</view>
								<view class="price-value highlight">￥36</view>
							</view>
							<view class="price-item">
								<view class="price-label">预期利润</view>
								<view class="profit-value success">80%</view>
							</view>
						</view>
						<button class="add-btn" @click="addToConfig(2)">加入配置</button>
					</view>
				</view>

				<!-- 商品卡片3 -->
				<view class="product-card">
					<view class="product-image">
						<image
							src="https://tse1-mm.cn.bing.net/th/id/OIP-C.JB7rmZRMGjuF7k2ZjbeR2wHaE7?w=276&h=184&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3"
							mode="aspectFill" class="product-img"></image>
						<view class="product-tags">
							<view class="product-tag blue">易销售</view>
							<view class="product-tag green">复购率高</view>
						</view>
					</view>
					<view class="product-info">
						<view class="product-name">奶茶饮料套装</view>
						<view class="price-info">
							<view class="price-item">
								<view class="price-label">进货价</view>
								<view class="price-value">￥10</view>
							</view>
							<view class="price-item">
								<view class="price-label">建议售价</view>
								<view class="price-value highlight">￥18</view>
							</view>
							<view class="price-item">
								<view class="price-label">预期利润</view>
								<view class="profit-value success">80%</view>
							</view>
						</view>
						<button class="add-btn" @click="addToConfig(3)">加入配置</button>
					</view>
				</view>
			</view>

			<!-- 智能定价策略 -->
			<view class="strategy-section">
				<view class="section-title">智能定价策略</view>
				<view class="strategy-card">
					<view class="strategy-item">
						<uni-icons type="compose" size="20" color="#1890ff"></uni-icons>
						<view class="strategy-content">
							<view class="strategy-text">动态定价建议：根据时段调整价格可提升15%收益</view>
						</view>
					</view>
					<view class="strategy-item">
						<uni-icons type="search" size="20" color="#1890ff"></uni-icons>
						<view class="strategy-content">
							<view class="strategy-text">竞品分析：周边同类商品价格￥12-18</view>
						</view>
					</view>
					<view class="strategy-item">
						<uni-icons type="pricetag" size="20" color="#1890ff"></uni-icons>
						<view class="strategy-content">
							<view class="strategy-text">价格区间：建议定价￥15，接受度最高</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 库存管理建议 -->
			<view class="inventory-section">
				<view class="section-title">库存管理建议</view>
				<view class="inventory-card">
					<view class="inventory-item">
						<uni-icons type="notification" size="20" color="#fa8c16"></uni-icons>
						<view class="inventory-content">
							<view class="inventory-title">库存预警</view>
							<view class="inventory-text">薯片类需补货</view>
						</view>
					</view>
					<view class="inventory-item">
						<uni-icons type="camera" size="20" color="#52c41a"></uni-icons>
						<view class="inventory-content">
							<view class="inventory-title">补货建议</view>
							<view class="inventory-text">建议采购50-80件</view>
						</view>
					</view>
					<view class="inventory-item">
						<uni-icons type="eye" size="20" color="#1890ff"></uni-icons>
						<view class="inventory-content">
							<view class="inventory-title">热销预测</view>
							<view class="inventory-text">下午3-6点销量最佳</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部操作按钮 -->
			<view class="action-section">
				<button class="confirm-btn" @click="confirmConfiguration">确认配置</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';


	//更多操作
	const moreIsView = ref(false)
	const moreList = ref([{
		icon: 'shop',
		text: '我的配置',
		action: 'viewMyPosters'
	}])

	//跳转我的配置界面
	const handleMoreAction = () => {
		uni.navigateTo({
			url: '/pages/function/one-click-market/my-goods'
		})
	}

	const handlePageClick = () => {
		if (moreIsView.value) moreIsView.value = false
	}

	// 已选择的商品
	const selectedProducts = ref([]);

	// 页面加载
	onLoad(() => {
		console.log('摆摊选品配置页面加载');
	});

	// 加入配置
	const addToConfig = (productId) => {
		if (!selectedProducts.value.includes(productId)) {
			selectedProducts.value.push(productId);
			uni.showToast({
				title: '已加入配置',
				icon: 'success',
				duration: 1000
			});
			console.log('已选择商品:', selectedProducts.value);
		} else {
			uni.showToast({
				title: '已添加过该商品',
				icon: 'none',
				duration: 1000
			});
		}
	};

	// 确认配置
	const confirmConfiguration = () => {
		if (selectedProducts.value.length === 0) {
			uni.showToast({
				title: '请至少选择一个商品',
				icon: 'none'
			});
			return;
		}

		uni.showModal({
			title: '确认配置',
			content: `确认选择 ${selectedProducts.value.length} 个商品进行配置吗？`,
			confirmText: '确认配置',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					uni.showLoading({
						title: '配置中...',
						mask: true
					});

					// 模拟配置保存
					setTimeout(() => {
						uni.hideLoading();
						uni.showToast({
							title: '配置保存成功',
							icon: 'success'
						});

						// 返回上一页
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}, 2000);
				}
			}
		});
	};
</script>



<style lang="scss" scoped>
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

	.product-container {
		min-height: 100vh;
		background: #E7F6FC;
		padding: 20rpx 30rpx 120rpx;
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
			color: #1a5b7e;
			margin-bottom: 8rpx;
			line-height: 1.4;
		}

		.sub-title {
			font-size: 26rpx;
			color: #666;
			line-height: 1.4;
		}
	}




	// 概览区域样式
	.overview-section {
		margin-bottom: 30rpx;

		.section-title {

			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 20rpx;
			padding-left: 10rpx;
		}

		.overview-cards {
			background-color: #ffffff;
			padding: 15rpx;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			gap: 5rpx;

			.overview-card {

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 10rpx;

				.card-content {
					text-align: center;

					.card-label {
						font-size: 24rpx;
						color: #999;
					}

					.card-value {
						font-size: 26rpx;
						font-weight: 500;
					}

				}
			}

		}
	}

	// 商品区域样式
	.product-section {
		margin-bottom: 30rpx;

		.section-title {
			display: flex;
			justify-content: space-between;
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 20rpx;
			padding-left: 10rpx;
		}

		.product-card {
			display: flex;
			background: #fff;
			border-radius: 16rpx;
			padding: 30rpx 20rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

			.product-image {
				width: 200rpx;
				margin-right: 20rpx;
				position: relative;

				.product-img {
					width: 200rpx;
					height: 200rpx;
					border-radius: 12rpx;
					background: #f5f5f5;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					color: #999;
				}

				.product-tags {
					display: flex;
					flex-wrap: wrap;
					gap: 8rpx;
					margin-top: 10rpx;

					.product-tag {
						font-size: 20rpx;
						padding: 4rpx 12rpx;
						border-radius: 4rpx;

						&.red {
							background: #fff2e8;
							color: #fa541c;
						}

						&.blue {
							background: #e6f7ff;
							color: #1890ff;
						}

						&.orange {
							background: #fff7e6;
							color: #fa8c16;
						}

						&.green {
							background: #f6ffed;
							color: #52c41a;
						}
					}
				}
			}

			.product-info {
				flex: 1;

				.product-name {
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
					margin-bottom: 20rpx;
					line-height: 1.4;
				}

				.price-info {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20rpx;

					.price-item {
						text-align: center;

						.price-label {
							font-size: 22rpx;
							color: #999;
							margin-bottom: 8rpx;
						}

						.price-value {
							font-size: 24rpx;
							color: #333;

							&.highlight {
								color: #1890ff;
								font-weight: 600;
							}
						}

						.profit-value {
							font-size: 24rpx;
							color: #52c41a;
							font-weight: 600;
						}
					}
				}

				.add-btn {
					width: 100%;
					height: 60rpx;
					line-height: 60rpx;
					background: #1890ff;
					color: #fff;
					font-size: 24rpx;
					font-weight: 500;
					border-radius: 8rpx;
					border: none;

					&:active {
						background: #096dd9;
					}

					&.added {
						background: #f0f0f0;
						color: #999;
					}
				}
			}
		}
	}

	// 策略区域样式
	.strategy-section {
		margin-bottom: 30rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 20rpx;
			padding-left: 10rpx;
		}

		.strategy-card {
			background: #fff;
			border-radius: 16rpx;
			padding: 30rpx 20rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

			.strategy-item {
				display: flex;
				align-items: flex-start;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.strategy-content {
					flex: 1;
					margin-left: 20rpx;

					.strategy-text {
						font-size: 24rpx;
						color: #333;
						line-height: 1.5;
					}
				}
			}
		}
	}

	// 库存区域样式
	.inventory-section {
		margin-bottom: 30rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 20rpx;
			padding-left: 10rpx;
		}

		.inventory-card {
			background: #fff;
			border-radius: 16rpx;
			padding: 30rpx 20rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

			.inventory-item {
				display: flex;
				align-items: flex-start;
				margin-bottom: 20rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.inventory-content {
					flex: 1;
					margin-left: 20rpx;

					.inventory-title {
						font-size: 24rpx;
						font-weight: 500;
						color: #333;
						margin-bottom: 4rpx;
					}

					.inventory-text {
						font-size: 24rpx;
						color: #666;
						line-height: 1.5;
					}
				}
			}
		}
	}

	// 底部操作按钮样式
	.action-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		padding: 20rpx 30rpx;
		box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
		z-index: 100;

		.confirm-btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			background: #1890ff;
			color: #fff;
			font-size: 32rpx;
			font-weight: 600;
			border-radius: 40rpx;
			border: none;
			box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);

			&:active {
				background: #096dd9;
			}
		}
	}
</style>