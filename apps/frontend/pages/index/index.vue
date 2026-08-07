<template>
	<view class="container">
		<!-- 顶部状态栏 -->
		<uni-nav-bar status-bar background-color="#E6F2FF" right-width="300rpx">
			<template #right>
				<view class="status-bar">
					<view class="show-container" @click="toggleStatusSelector">
						<view class="position" @click.stop="goToMap">定位</view>
						<div class="divider">|</div>
						<view class="working">
							<text class="status-text" :class="{
								'status-active': businessStatus === '营业中',
								'status-inactive': businessStatus === '停止营业'
							}">
								{{ businessStatus }}
							</text>
						</view>
						<view class="arrow" :class="{ 'rotate': showStatusSelector }">▼</view>
					</view>
				</view>
			</template>
		</uni-nav-bar>


		<!-- 营业状态选择器 -->
		<view class="status-options" v-if="showStatusSelector" @click.stop>
			<view class="status-option" :class="{ 'selected': businessStatus === '营业中' }" @click="selectStatus('营业中')">
				<text class="option-text">营业中</text>
				<text class="checkmark" v-if="businessStatus === '营业中'">✓</text>
			</view>
			<view class="status-option" :class="{ 'selected': businessStatus === '停止营业' }"
				@click="selectStatus('停止营业')">
				<text class="option-text">停止营业</text>
				<text class="checkmark" v-if="businessStatus === '停止营业'">✓</text>
			</view>
		</view>

		<!-- 页面标题 -->
		<view class="header">
			<view class="greeting-container">
				<view class="hi-badge">
					<text class="hi-text">HI</text>
				</view>
				<text class="greeting">亲爱的，{{username}}</text>
			</view>
		</view>

		<!-- AI 搜索框 -->
		<view class="search-section">
			<view class="search-container">
				<view class="search-box" @tap="handleRobotTalk">
					<uni-icons type="search"></uni-icons>
					<view class="input-container">
						<input v-model="searchInput" class="search-input" placeholder="输入时间、地址，获取AI个性化定制化建议"
							placeholder-style="color: #999;" />
					</view>
					<view class="search-arrow"></view>
				</view>
				<!-- 机器人图标 -->
				<view class="robot-container" @tap="handleRobotTalk">
					<image src="/static/images/ai-robot.png" class="robot-icon" mode="aspectFit"></image>
					<view class="robot-glow"></view>
				</view>
			</view>
		</view>

		<!-- 功能入口 -->
		<view class="function-row">
			<view class="function-card" @click="navigateTo('message')">
				<image src="/static/images/message-center.png" class="function-icon"></image>
				<text class="function-text">消息中心</text>
			</view>
			<view class="function-card" @click="navigateTo('todo')">
				<image src="/static/images/todo-list.png" class="function-icon"></image>
				<text class="function-text">待办事项</text>
			</view>
			<view class="function-card" @click="navigateTo('ai-collect')">
				<image src="/static/images/ai-favorite.png" class="function-icon"></image>
				<text class="function-text">收藏</text>
			</view>
		</view>

		<view class="function-grid">
			<view class="function-item" @click="navigateTo('product')">
				<image src="/static/images/product-icon.png" class="function-icon"></image>
				<text class="function-text">商品</text>
			</view>
			<view class="function-item" @click="navigateTo('ai-poster')">
				<image src="/static/images/ai-poster.png" class="function-icon"></image>
				<text class="function-text">AI 海报</text>
			</view>
			<view class="function-item" @click="navigateTo('ai-weather')">
				<image src="/static/images/ai-weather.png" class="function-icon"></image>
				<text class="function-text">天气策略官</text>
			</view>
			<view class="function-item" @click="navigateTo('more')">
				<image src="/static/images/more-icon.png" class="function-icon"></image>
				<text class="function-text">更多</text>
			</view>
		</view>
		<view class="divider-line"></view>

		<!-- 最新公告 -->
		<view class="announcement-section">
			<view class="announcement-container">
				<view class="announcement-label">
					<text class="label-text">最新公告</text>
				</view>
				<view class="announcement-content">
					<text class="announcement-text">AI爆款雷达推荐商品\n摊主可以根据通过输入地点时间获取定制化建议。</text>
				</view>
			</view>
		</view>

		<!-- 热门推荐 -->
		<view class="recommendation-section">
			<view class="tab-header">
				<view class="tab-item" :class="{ active: activeTab === 'product' }" @click="switchActiveTab('product')">
					<text class="tab-text">热门产品</text>
					<view class="tab-indicator" v-if="activeTab === 'product'"></view>
				</view>
				<view class="tab-item" :class="{ active: activeTab === 'stall' }" @click="switchActiveTab('stall')">
					<text class="tab-text">热门摊位</text>
					<view class="tab-indicator" v-if="activeTab === 'stall'"></view>
				</view>
			</view>

			<!-- 产品内容 -->
			<view class="recommendation-content" v-if="activeTab === 'product'">
				<view class="recommendation-item">
					<image src="/static/images/bbq-product.png" class="recommendation-img"></image>
					<view class="recommendation-info">
						<text class="recommendation-name">老王烧烤</text>
						<text class="recommendation-profit"><text style="color:#666;">预估利润：</text>¥1,280</text>
						<button class="marketing-btn" type="primary" @click="toggleMarketing('product1')">
							一键营销
						</button>
					</view>
				</view>
				<view class="recommendation-item">
					<image src="/static/images/coffee-product.png" class="recommendation-img"></image>
					<view class="recommendation-info">
						<text class="recommendation-name">小白的咖啡</text>
						<text class="recommendation-profit"><text style="color:#666;">预估利润：</text>¥980</text>
						<button class="marketing-btn" type="primary" @click="toggleMarketing('product2')">
							一键营销
						</button>
					</view>
				</view>
			</view>

			<!-- 摊位内容 -->
			<view class="recommendation-content" v-if="activeTab === 'stall'">
				<view class="recommendation-item">
					<image src="/static/images/egg-pancake.jpg" class="recommendation-img"></image>
					<view class="recommendation-info">
						<text class="recommendation-name">老李鸡蛋灌饼</text>
						<text class="recommendation-special"><text style="color:#666;">推荐单品：</text>鸡蛋灌饼</text>
						<button class="marketing-btn" type="primary" @click="toggleMarketing('stall1')">
							一键营销
						</button>
					</view>
				</view>
				<view class="recommendation-item">
					<image src="/static/images/rice.jpg" class="recommendation-img"></image>
					<view class="recommendation-info">
						<text class="recommendation-name">贵州糯米饭</text>
						<text class="recommendation-special"><text style="color:#666;">推荐单品：</text>糯米饭团</text>
						<button class="marketing-btn" type="primary" @click="toggleMarketing('stall2')">
							一键营销
						</button>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		getInfoApi
	} from '../../apis/user'

	const username = ref('用户')
	const businessStatus = ref('营业中')
	const showStatusSelector = ref(false)
	const activeTab = ref('product')
	const searchInput = ref('')
	const marketingActive = ref({
		product1: false,
		product2: false,
		stall1: false,
		stall2: false
	})
	const ws = uni.connectSocket({
		url: "ws://localhost:3001/ws",
		success: () => {
			console.log('连接成功')
		},
		fail: (err) => {
			console.log(err)
		}
	})

	//获取用户信息
	const getUserInfo = async () => {
		try {
			const res = await getInfoApi()
			if (res.errno == 0) {
				uni.setStorageSync('user', res.data)
				username.value = res.data.username
			}
		} catch (err) {
			uni.showToast({
				title: '获取用户信息异常'
			})
		}
	}

	onUnmounted(() => {
		ws.close()
	})

	onMounted(() => {
	
		// 加入房间
		ws.onMessage((e) => {
			const data = JSON.parse(e.data)
			if(data.data)
			console.log(data.data)
			else  console.log(data)
		})
		ws.onClose(() => {
			console.log('已关闭')
		})
		ws.onError((err) => {
			console.log(err)
		})
		ws.onOpen(()=>{
			ws.send({
				data: JSON.stringify({
					type: 'join_room',
					room: 'general'
				})
			});
		})
		if (!uni.getStorageSync('token')) {
			return uni.reLaunch({
				url: '/pages/login/login'
			})
		}
		getUserInfo()
	})

	// 切换营业状态选择器显示
	const toggleStatusSelector = (event) => {
		event.stopPropagation()
		showStatusSelector.value = !showStatusSelector.value
	}

	// 选择营业状态
	const selectStatus = (status) => {
		businessStatus.value = status
		showStatusSelector.value = false

		// 更新服务器状态
		updateBusinessStatus(status)
	}

	// 更新营业状态到服务器
	const updateBusinessStatus = async (status) => {
		try {
			// 这里调用API更新状态
			// await updateBusinessStatusApi(status)
			uni.showToast({
				title: `已设置为${status}`,
				icon: 'success',
				duration: 1500
			})
		} catch (error) {
			console.error('更新状态失败:', error)
			uni.showToast({
				title: '状态更新失败',
				icon: 'none'
			})
		}
	}

	// 跳转到地图
	const goToMap = (event) => {
		event.stopPropagation() // 阻止事件冒泡
		requestLocationPermission()
	}

	// 其他方法保持不变
	const switchActiveTab = (tab) => {
		activeTab.value = tab
	}

	const goToSearch = () => {
		uni.navigateTo({
			url: '/pages/search/index'
		})
	}

	const handleRobotTalk = () => {
		uni.navigateTo({
			url: '/pages/function/ai-talk'
		})
	}

	const toggleMarketing = (key) => {
		uni.navigateTo({
			url: '/pages/function/one-click-market/market'
		})
		marketingActive.value[key] = !marketingActive.value[key]
	}

	const navigateTo = (page) => {
		uni.navigateTo({
			url: "/pages/function/" + page
		})
	}


	// 1. 检查并申请权限
	function requestLocationPermission() {
		ws.send({
			data: JSON.stringify({
				type: 'chat',
				room: 'general',
				content: 'Hello everyone!'
			})
		})
		// 先检查用户是否已经授权
		/*uni.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userLocation']) {
					// 已有权限，直接获取位置
					getCurrentLocation();
				} else {
					// 没有权限，向用户申请
					uni.authorize({
						scope: 'scope.userLocation',
						success: () => {
							// 用户同意授权
							uni.showToast({
								title: '定位权限申请成功',
								icon: 'none'
							});
							getCurrentLocation();
						},
						fail: () => {
							// 用户拒绝授权，进行引导
							uni.showModal({
								title: '提示',
								content: '您拒绝了定位权限，是否前往应用设置开启？',
								success: (res) => {
									if (res.confirm) {
										// 引导用户跳转到应用设置页面
										uni.openSetting();
									}
								}
							});
						}
					});
				}
			}
		});*/
	}

	// 2. 获取当前位置信息
	function getCurrentLocation() {
		uni.getLocation({
			type: 'gcj02', // 坐标类型，'gcj02' 适用于高德、腾讯地图
			altitude: true, // 获取高度信息（如果需要）
			success: (res) => {
				console.log('当前位置经度：', res.longitude);
				console.log('当前位置纬度：', res.latitude);
				// 这里可以将位置信息存储到全局状态或进行下一步操作
				uni.showToast({
					title: '获取位置成功',
					icon: 'none'
				});
			},
			fail: (err) => {
				console.error('获取位置失败：', err);
				uni.showToast({
					title: '获取位置失败',
					icon: 'none'
				});
			}
		});
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #E6F2FF;
	}

	.status-bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		z-index: 1001;
		/* 提高层级 */

		.show-container {
			display: flex;
			align-items: center;
			gap: 10rpx;
			padding: 8rpx 16rpx;
			border-radius: 8rpx;
			position: relative;
			z-index: 10;
			transition: all 0.3s ease;

			.position {
				font-size: 28rpx;
				color: #007AFF;
				font-weight: 500;
				padding: 4rpx 8rpx;
				border-radius: 4rpx;
				transition: background-color 0.3s;
			}

			.divider {
				font-size: 24rpx;
				color: #DCDFE6;
				margin: 0 4rpx;
			}

			.working {
				.status-text {
					font-size: 28rpx;
					font-weight: 500;

					&.status-active {
						color: #07C160;
					}

					&.status-inactive {
						color: #909399;
					}
				}
			}

			.arrow {
				font-size: 20rpx;
				color: #909399;
				transition: transform 0.3s ease;

				&.rotate {
					transform: rotate(180deg);
				}
			}
		}
	}

	// 营业状态选择器
	.status-options {
		position: absolute;
		top: 80rpx;
		/* 调整位置 */
		right: 0;
		width: 200rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		z-index: 1002;
		/* 确保在选择器上方 */
		overflow: hidden;
		border: 1rpx solid #EBEEF5;
		animation: slideDown 0.3s ease;
		z-index: 999;

		.status-option {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 20rpx;
			border-bottom: 1rpx solid #F5F7FA;
			transition: background-color 0.3s;

			&:last-child {
				border-bottom: none;
			}

			&:active {
				background-color: #F5F7FA;
			}

			&.selected {
				background-color: #F0F9FF;
			}

			.option-text {
				font-size: 28rpx;
				color: #606266;
				font-weight: 500;
			}

			.checkmark {
				font-size: 24rpx;
				color: #07C160;
				font-weight: bold;
			}
		}
	}



	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.container {
		height: 100vh;
		background-image: url('/static/images/ditu.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-attachment: fixed;
		position: relative;
	}

	/* 添加半透明遮罩层，提高内容可读性 */
	.container::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
	}

	/* 确保所有内容都在遮罩层上方 */
	.header,
	.search-section,
	.function-row,
	.function-grid,
	.announcement-section,
	.recommendation-section {
		position: relative;
		z-index: 1;
	}

	/* 页面标题 */
	.header {
		padding: 20rpx 30rpx;
		background-color: rgba(255, 255, 255, 0.9);
	}

	.greeting-container {
		display: flex;
		align-items: center;
	}

	.hi-badge {
		position: relative;
		margin-right: 20rpx;
	}

	.hi-badge::before {
		content: '';
		position: absolute;
		top: -8rpx;
		left: -8rpx;
		right: -8rpx;
		bottom: -8rpx;
		background: linear-gradient(135deg, rgba(7, 193, 96, 0.2), rgba(0, 122, 255, 0.2));
		border-radius: 12rpx;
		z-index: 0;
	}

	.hi-text {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		position: relative;
		z-index: 1;
	}

	.greeting {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	/* 搜索框 */
	.search-section {
		padding: 30rpx;
		background-color: rgba(255, 255, 255, 0.9);
	}

	.search-container {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.search-box {
		flex: 4;
		display: flex;
		align-items: center;
		padding: 20rpx 24rpx;
		background-color: rgba(245, 245, 245, 0.9);
		border-radius: 50rpx;
		cursor: pointer;
		min-height: 90rpx;
		position: relative;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	.input-container {
		flex: 1;
		min-width: 0;
	}

	.search-input {
		width: 100%;
		font-size: 26rpx;
		color: #999;
		background: transparent;
		border: none;
		outline: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.search-input::placeholder {
		font-size: 26rpx;
		color: #999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* 添加指向机器人的尖角 */
	.search-arrow {
		position: absolute;
		right: -17rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 0;
		height: 0;
		border-top: 18rpx solid transparent;
		border-bottom: 18rpx solid transparent;
		border-left: 18rpx solid rgba(245, 245, 245, 0.9);
		z-index: 2;
		filter: drop-shadow(2rpx 0 2rpx rgba(0, 0, 0, 0.1));
	}

	/* 机器人图标优化 */
	.robot-container {
		flex: 0.8;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100rpx;
	}

	.robot-icon {
		width: 90rpx;
		height: 90rpx;
		z-index: 2;
		position: relative;
		filter: drop-shadow(0 4rpx 8rpx rgba(0, 122, 255, 0.3));
		transition: all 0.3s ease;
	}

	/* 添加光晕效果 */
	.robot-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100rpx;
		height: 100rpx;
		background: radial-gradient(circle, rgba(0, 122, 255, 0.2) 0%, rgba(0, 122, 255, 0) 70%);
		border-radius: 50%;
		z-index: 1;
		animation: pulse 2s infinite;
	}

	/* 机器人悬停效果 */
	.robot-container:hover .robot-icon {
		transform: scale(1.05) rotate(5deg);
		filter: drop-shadow(0 6rpx 12rpx rgba(0, 122, 255, 0.5));
	}

	@keyframes pulse {
		0% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(0.95);
		}

		50% {
			opacity: 0.8;
			transform: translate(-50%, -50%) scale(1.05);
		}

		100% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(0.95);
		}
	}

	/* 第一行功能入口 */
	.function-row {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		background-color: rgba(255, 255, 255, 0.9);
	}

	.function-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30rpx 20rpx;
		background-color: rgba(255, 255, 255, 0.95);
		border-radius: 16rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
		margin: 0 10rpx;
	}

	/* 第二行功能入口 */
	.function-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 30rpx;
		padding: 30rpx;
		background-color: rgba(255, 255, 255, 0.9);
	}

	.function-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.function-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 16rpx;
	}

	.function-text {
		font-size: 24rpx;
		color: #333;
	}

	/* 分界线 */
	.divider-line {
		height: 2rpx;
		background-color: rgba(238, 238, 238, 0.7);
		margin: 0 30rpx;
	}

	/* 公告区域 */
	.announcement-section {
		background-color: rgba(255, 255, 255, 0.9);
		padding: 30rpx;
	}

	.announcement-container {
		display: flex;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.announcement-label {
		flex: 0 0 200rpx;
		background: linear-gradient(135deg, rgba(230, 247, 255, 0.9), rgba(186, 231, 255, 0.9));
		padding: 30rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.label-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #1890ff;
		font-family: 'PingFang SC', sans-serif;
	}

	.announcement-content {
		flex: 1;
		background-color: rgba(240, 249, 255, 0.9);
		padding: 30rpx 20rpx;
	}

	.announcement-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		font-family: '楷体', 'KaiTi', serif;
		white-space: pre-line;
	}

	/* 推荐区域 */
	.recommendation-section {
		background-color: rgba(255, 255, 255, 0.9);
		margin-top: 20rpx;
		padding: 30rpx;
	}

	.tab-header {
		display: flex;
		border-bottom: 2rpx solid rgba(238, 238, 238, 0.7);
		margin-bottom: 30rpx;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		position: relative;
	}

	.tab-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #666;
	}

	.tab-item.active .tab-text {
		color: #007aff;
	}

	.tab-indicator {
		position: absolute;
		bottom: -2rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 120rpx;
		height: 4rpx;
		background: linear-gradient(90deg, #007aff, #00c6ff);
		border-radius: 2rpx;
	}

	.recommendation-content {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	.recommendation-item {
		display: flex;
		background-color: rgba(249, 249, 249, 0.9);
		border-radius: 16rpx;
		padding: 30rpx;
		gap: 30rpx;
		position: relative;
	}

	.recommendation-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
	}

	.recommendation-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.recommendation-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.recommendation-profit {
		font-size: 24rpx;
		color: #f56c6c;
		font-weight: 500;
		margin-bottom: 20rpx;
	}

	.recommendation-special {
		font-size: 24rpx;
		color: #07c160;
		font-weight: 500;
		margin-bottom: 20rpx;
	}

	.marketing-btn {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		border: none;
		border-radius: 8rpx;
		padding: 0 24rpx;
		font-size: 26rpx;
		width: auto;
	}

	/* 响应式调整 */
	@media (max-width: 375px) {
		.search-input {
			font-size: 24rpx;
		}

		.search-input::placeholder {
			font-size: 24rpx;
		}

		.search-box {
			padding: 18rpx 20rpx;
		}
	}
</style>