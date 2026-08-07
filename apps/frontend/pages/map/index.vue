<script setup>
	import {
		ref
	} from 'vue'

	const keywordPoint = ref('')  //搜索地址关键字 
	const smartWord = ref('')  //智能寻址关键字
	const isDrawerOpen = ref(false)
	const isSecondDrawerOpen = ref(false) // 控制第二个抽屉
	const startY = ref(0)
	const currentY = ref(0)
	const translateY = ref(0)
	const drawerTranslateY = ref(0) // 第二个抽屉的位移
	const isListening = ref(false) // 是否正在语音识别
	const listeningText = ref('正在聆听...') // 语音识别状态文本

	// 当前拖拽阶段：0-初始状态，1-第一个抽屉，2-第二个抽屉
	const dragPhase = ref(0)

	const dataList = ref([{
			value: '8.2k',
			name: '日均人流量',
			color: '#E45B4E'
		},
		{
			value: '￥500',
			name: '平均收益',
			color: '#F3D593'
		},
		{
			value: '12家',
			name: '周边商铺',
			color: '#3D70D5'
		},
	])

	// 触摸开始
	const onTouchStart = (e) => {
		const touch = e.touches && e.touches[0] ? e.touches[0] : e.changedTouches && e.changedTouches[0] ? e
			.changedTouches[0] : null
		if (touch) {
			startY.value = touch.clientY
			currentY.value = touch.clientY

			// 根据当前状态确定拖拽阶段
			if (isSecondDrawerOpen.value) {
				dragPhase.value = 2
			} else if (isDrawerOpen.value) {
				dragPhase.value = 1
			} else {
				dragPhase.value = 0
			}
		}
	}

	// 触摸移动
	const onTouchMove = (e) => {
		currentY.value = e.touches[0].clientY
		const deltaY = startY.value - currentY.value

		// 第一阶段：从底部向上拖拽打开第一个抽屉
		if (dragPhase.value === 0 && deltaY > 0 && !isDrawerOpen.value) {
			translateY.value = -Math.min(deltaY * 0.5, 200)
		}
		// 第二阶段：从第一个抽屉向上拖拽打开第二个抽屉
		else if (dragPhase.value === 1 && deltaY > 0 && isDrawerOpen.value && !isSecondDrawerOpen.value) {
			drawerTranslateY.value = -Math.min(deltaY * 0.5, 300)
		}
		// 向下拖拽关闭第二个抽屉
		else if (dragPhase.value === 2 && deltaY < 0 && isSecondDrawerOpen.value) {
			drawerTranslateY.value = Math.max(deltaY * 0.5, -300)
		}
		// 向下拖拽关闭第一个抽屉
		else if (dragPhase.value === 1 && deltaY < 0 && isDrawerOpen.value && !isSecondDrawerOpen.value) {
			translateY.value = Math.max(deltaY * 0.5, -200)
		}
	}

	// 触摸结束
	const onTouchEnd = (e) => {
		const deltaY = startY.value - currentY.value
		const absDeltaY = Math.abs(deltaY)

		// 第一阶段拖拽结束：打开/关闭第一个抽屉
		if (dragPhase.value === 0) {
			if (absDeltaY > 30) {
				isDrawerOpen.value = deltaY > 0
				translateY.value = isDrawerOpen.value ? -200 : 0
			} else {
				translateY.value = isDrawerOpen.value ? -200 : 0
			}
		}
		// 第二阶段拖拽结束：打开/关闭第二个抽屉
		else if (dragPhase.value === 1) {
			if (absDeltaY > 30) {
				if (deltaY > 0) {
					// 向上拖拽，打开第二个抽屉
					isSecondDrawerOpen.value = true
					drawerTranslateY.value = -300
				} else {
					// 向下拖拽，关闭第一个抽屉
					isDrawerOpen.value = false
					translateY.value = 0
				}
			} else {
				drawerTranslateY.value = isSecondDrawerOpen.value ? -300 : 0
				translateY.value = isDrawerOpen.value ? -200 : 0
			}
		}
		// 第三阶段拖拽结束：关闭第二个抽屉
		else if (dragPhase.value === 2) {
			if (absDeltaY > 30) {
				if (deltaY < 0) {
					// 向下拖拽，关闭第二个抽屉
					isSecondDrawerOpen.value = false
					drawerTranslateY.value = 0
				}
			} else {
				drawerTranslateY.value = isSecondDrawerOpen.value ? -300 : 0
			}
		}
	}

	//扫一扫
	const handleScan = () => {
		uni.scanCode({

		})
	}
	//跳转到搜索地点页面
	const handleNavTo = () => {
		uni.navigateTo({
			url: `/pages/map/search?name=${keywordPoint.value}&choose=end` 
		})
	}
	//语音识别-start
	const handleMicStart = () => {
		isListening.value = true
		listeningText.value = '正在聆听...'	
		// #ifdef APP-PLUS
		let options = {
			engine: 'baidu'
		};
		let text = '';
		console.log('开始语音识别：');
		plus.speech.startRecognize(options, function(s) {
			console.log(s);
			text.value += s;
			listeningText.value = '识别中...'
		}, function(e) {
			console.log('语音识别失败：' + JSON.stringify(e));
			isListening.value = false
		});
		// #endif
	}
	
	//语音识别-end
	const handleMicEnd = ()=>{
		isListening.value = false
	}
</script>

<template>
	<view class="container">
		<!-- 导航栏：标题 + 保存按钮 -->
		<uni-nav-bar status-bar  title="找位置" >
		</uni-nav-bar>
		<!-- 地图容器 -->
		<view class="map-container" :style="{ transform: `translateY(${translateY}px)` }">
			<!-- 搜索框 -->
			<view class="search-box">
				<uni-icons type="search" size="16"></uni-icons>
				<input type="text" v-model="keywordPoint" placeholder="查找地点、公交、地铁" @confirm="handleNavTo" />
				<view class="search-icons">
					<uni-icons type="scan" size="16" @tap="handleScan"></uni-icons>
					<uni-icons type="mic" size="16" @touchstart="handleMicStart"  @touchend="handleMicEnd"></uni-icons>
				</view>
			</view>

			<!-- 地图 -->
			<view class="map">
				<!-- <map id="map" style="width: 100%; height: 60%;"></map> -->
			</view>
		</view>

		<!-- 语音识别动画 - 移出map-container，固定在屏幕中间
		<view class="voice-recognition" v-if="isListening">
			<view class="voice-animation">
				<view class="voice-bar" v-for="i in 5" :key="i" 
					:style="{ animation: `barWave 1.2s ease-in-out infinite ${i * 0.15}s` }"></view>
			</view>
			<view class="voice-text">{{ listeningText }}</view>
		</view>

		<!-- 底部抽屉面板 -->
		<view class="drawer-panel" :class="{ 'drawer-open': isDrawerOpen, 'special': isDrawerOpen, }"
			:style="{ transform: `translateY(${drawerTranslateY}px)` }" @touchstart="onTouchStart"
			@touchmove="onTouchMove" @touchend="onTouchEnd">

			<!-- 拖动把手 -->
			<view class="drag-handle">
				<view :class="{'handle-bar':!isDrawerOpen}"></view>
			</view>

			<!-- 详情内容 -->
			<view :style="{
        backgroundImage: isSecondDrawerOpen ? 'url(https://www.bing.com/th/id/OGC.971f2d3452627c620b6d39b64db09075?o=7&pid=1.7&rm=3&rurl=http%3a%2f%2fbpic.588ku.com%2felement_origin_min_pic%2f19%2f03%2f07%2f45e64923a987617b2c6a864f85221fe5.jpg&ehk=TM2oH6syr8ootlMpQKujRmG2PtbGXP7cG5I1AOhDngo%3d)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }" class="detail-content"
				:class="{'detail-content-open':isDrawerOpen && !isSecondDrawerOpen,'detail-content-open-second':isSecondDrawerOpen }">
				<view class="analysis">
					<view class="title">
						<view class="left">当前位置分析</view>
					</view>
					<view class="main">
						<view class="position">
							<uni-icons size="24" type="location"></uni-icons>
							<view class="text">湘潭市xx区xx街</view>
						</view>
						<view class="data">
							<view class="item" v-for="item in dataList">
								<view class="value" :style="{color:item.color}">{{item.value}}</view>
								<view class="text">{{item.name}}</view>
							</view>
						</view>
						<view class="tab">
							<view class="allow common active">允许摆摊</view>
							<view class="time common">8:00-22:00</view>
							<view class="cost common">无需摆摊费</view>
							<view class="supply common">提供电源</view>
						</view>
						<view class="start">
							<button type="primary">开始营业</button>
							<text class="text">开始营业后，您的摊位将在消费者地图上显示</text>
						</view>
					</view>
				</view>
				<view class="smart">
					<view class="title">
						<view class="left">智能寻址</view>
					</view>
					<!-- 文本框 -->
					<view class="main">
						<!-- 输入区域 -->
						<view class="input-section">
							<view class="input-box">
								<uni-icons type="search" size="16" color="#999"></uni-icons>
								<input type="text" placeholder="输入关键词智能寻位" class="smart-input" v-model="smartWord" />
								<view class="opt">
									<uni-icons type="plus" size="20"></uni-icons>
									<uni-icons type="mic" size="20" @touchstart="handleMicStart" @touchend="handleMicEnd"></uni-icons>
									<uni-icons type="camera" size="20"></uni-icons>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 在weather部分的main内容区域添加以下内容 -->
				<view class="weather">
					<view class="title">
						<view class="left">天气策略官</view>
						<view class="right">
							查看更多
							<uni-icons type="right" size="14" color="#7991C3"></uni-icons>
						</view>
					</view>
					<view class="main">
						<!-- 天气概况 -->
						<view class="weather-overview">
							<view class="left">
								<view class="temperature">24℃</view>
								<view class="location-weather">北京市·阴转小雨</view>
							</view>
							<view class="right">
								<image src="/static/rain.png"></image>
							</view>
						</view>

						<view class="advice">
							<view class="left">
								<!-- 经营建议 -->
								<view class="business-suggestions">
									<view class="suggestion-title">经营建议：</view>
									<view class="suggestion-list">
										<view class="suggestion-item">准备雨具商品，如雨衣、雨伞等</view>
										<view class="suggestion-item">考虑售卖热饮，如姜茶、热咖啡等</view>
										<view class="suggestion-item">准备防水布和重物固定摊位</view>
										<view class="suggestion-item">可准备一些一次性雨衣作为赠品</view>
									</view>
								</view>
							</view>
							<view class="right">
								<!-- 天气详情 -->
								<view class="weather-details">
									<view class="detail-item">
										<view class="detail-label">
											<image src="/static/humidity.png"></image>
											湿度
										</view>
										<view class="detail-value">78%</view>
									</view>
									<view class="detail-item">
										<view class="detail-label">
											<image src="/static/wind.png"></image>
											风力
										</view>
										<view class="detail-value">3级 东南风</view>
									</view>
									<view class="detail-item">
										<view class="detail-label">
											<image src="/static/ray.png"></image>紫外线
										</view>
										<view class="detail-value">弱</view>
									</view>
									<view class="detail-item">
										<view class="detail-label">
											<image src="/static/rain-possibility.png"></image>降水概率
										</view>
										<view class="detail-value">85%</view>
									</view>
								</view>
							</view>
						</view>


					</view>
				</view>
				<view class="other" style="height: 400rpx;"></view>
				<view class="hot">
					<view class="title">
						<view class="left">热门位置推荐</view>
						<view class="right">
							查看更多
							<uni-icons type="right" color="#7991C3" size="14"></uni-icons>
						</view>
					</view>
					<view class="main">
						<view class="photo">
							<image mode="aspectFill"
								src="https://vod-benshipin-xhncloud.voc.com.cn/208/2022/11/27/e98462b0c902176b705b91606db99010d450d7d71669559785862.jpg?pid=2101597">
							</image>
						</view>
						<view class="desc">
							<view class="one">
								<view class="location">湘潭市雨湖区XX路</view>
								<view class="icon">
									<uni-icons type="location"></uni-icons>
									距离您16.8公里
								</view>
							</view>
							<view class="two">
								<view class="flow common">
									<image src="/static/flow.png"></image>
									<text>人流量：高</text>
								</view>
								<view class="income common">
									<image src="/static/income.png"></image>
									<text>收益：中高</text>
								</view>
							</view>
							<view class="two">
								<view class="flow common">
									<image src="/static/chain.png"></image>
									<text>周边店铺：22家</text>
								</view>
								<view class="income common">
									<image src="/static/time.png"></image>
									<text>最佳时间：17:00后</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		position: relative;
		overflow: hidden;
		background-color: #F7F7F7;
	}

	.map-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		transition: transform 0.3s ease;
		z-index: 1;
	}

	.search-box {
		position: absolute;
		top: 210rpx;
		left: 30rpx;
		right: 30rpx;
		z-index: 10;
		display: flex;
		align-items: center;
		padding: 20rpx;
		background: white;
		border-radius: 15rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

		input {
			flex: 1;
			margin: 0 20rpx;
			font-size: 28rpx;
		}

		.search-icons {
			display: flex;
			gap: 20rpx;
		}
	}
	
	/* 语音识别动画  */
	.voice-recognition {
		position: fixed; 
		top: 50%; 
		left: 50%; 
		transform: translate(-50%, -50%); 
		background: rgba(51, 51, 51, 0.9);
		border-radius: 20rpx;
		padding: 30rpx 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 9999; 
		color: white;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
		min-width: 200rpx;
		
		.voice-animation {
			display: flex;
			align-items: flex-end; 
			justify-content: center;
			height: 40rpx;
			margin-bottom: 15rpx;
			gap: 8rpx;
			
			.voice-bar {
				width: 6rpx;
				height: 20rpx;
				background-color: white;
				border-radius: 3rpx;
				transform-origin: bottom center; /* 以底部为中心进行缩放 */
			}
		}
		
		.voice-text {
			font-size: 28rpx;
			color: white;
			font-weight: 400;
		}
	}
	
	@keyframes barWave {
		0%, 100% {
			transform: scaleY(1); /* 正常高度 */
			height: 10rpx;
			background-color: #FFFFFF;
		}
		25% {
			transform: scaleY(1.8); /* 向上伸长 */
			height: 25rpx;
			background-color: #4CD964; /* 绿色 */
		}
		50% {
			transform: scaleY(0.6); /* 向下缩短 */
			height: 8rpx;
			background-color: #FFCC00; /* 黄色 */
		}
		75% {
			transform: scaleY(1.4); /* 再次向上伸长 */
			height: 20rpx;
			background-color: #FF9500; /* 橙色 */
		}
	}

	.map {
		width: 100vw;
		height: 60vh;
		z-index: 0;
	}

	/* 底部抽屉面板 */
	.drawer-panel {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -640rpx;
		height: 1200rpx;
		background: white;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.15);
		transition: transform 0.3s ease, height 0.3s ease;
		z-index: 2;
	}

	.special {
		border-radius: 0;

	}

	.drawer-open {
		height: 144vh;
		overflow: hidden;
	}

	.drag-handle {
		padding: 20rpx 0;
		display: flex;
		justify-content: center;

		.handle-bar {
			width: 80rpx;
			height: 6rpx;
			background: #e0e0e0;
			border-radius: 3rpx;
		}
	}

	.detail-content {
		padding: 0 30rpx 120rpx;
		max-height: 180vh;
		overflow-y: auto;


		.title {
			font-size: 32rpx;
			font-weight: 600;
			display: flex;
			justify-content: space-between;
			align-items: center;

		}

		.analysis,
		.smart,
		.weather,
		.hot {
			background-color: #F7F7F7;
			padding: 20rpx;
			border-radius: 20rpx;
			margin-top: 20rpx;
		}

		.weather {
			.title {
				.right {
					font-size: 24rpx;
					color: #7991C3;
					font-weight: 500;
				}
			}

			.main {
				.weather-overview {
					display: flex;
					justify-content: space-between;
					padding: 0 20rpx;

					.left {
						display: flex;
						align-items: center;
					}

					.right {
						image {
							width: 120rpx;
							height: 120rpx;
						}
					}

					.temperature {
						font-size: 48rpx;
						font-weight: bold;
						color: #333;
						margin-right: 20rpx;
					}

					.location-weather {
						font-size: 28rpx;
						color: #666;
					}
				}

				.advice {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						.business-suggestions {
							margin-top: -20rpx;
							margin-bottom: 20rpx;

							.suggestion-title {
								font-size: 28rpx;
								font-weight: 600;
								color: #333;
								margin-bottom: 15rpx;
							}

							.suggestion-list {
								.suggestion-item {
									font-size: 22rpx;
									color: #666;
									margin-bottom: 10rpx;
									position: relative;
									padding-left: 20rpx;

									&::before {
										content: "•";
										position: absolute;
										left: 0;
										color: #7991C3;
									}
								}
							}
						}
					}

					.right {
						background-color: #FFF;
						width: 210rpx;
						height: 190rpx;
						border-radius: 10rpx;
						padding: 20rpx 10rpx;

						.weather-details {
							height: 150rpx;
							font-size: 20rpx;
							display: flex;
							flex-direction: column;
							align-items: flex-start;

							gap: 10rpx;

							.detail-item {
								display: flex;
								gap: 20rpx;
								width: 100%;
								justify-content: space-between;

								.detail-label {
									display: flex;
									align-items: center;
									gap: 5rpx;

									image {
										width: 25rpx;
										height: 25rpx;
									}
								}

								.detail-value {}
							}
						}
					}
				}



			}
		}

		.smart {
			.main {
				margin-top: 20rpx;

				.input-section {
					margin-bottom: 30rpx;

					.input-box {
						display: flex;
						align-items: center;
						background: white;
						border-radius: 20rpx;
						padding: 20rpx 25rpx;
						border: 2rpx solid #eee;

						.smart-input {
							flex: 1;
							margin: 0 20rpx;
							font-size: 28rpx;
						}

						.opt {
							display: flex;
							align-items: center;
							gap: 10rpx;
						}
					}
				}
			}
		}

		.analysis {
			.main {
				margin-top: 15rpx;

				.position {
					display: flex;
					align-items: center;
					gap: 10rpx;
					font-size: 28rpx;
					font-weight: 450;
				}

				.data {
					margin-top: 30rpx;
					display: flex;
					justify-content: space-between;

					.item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border: 2rpx solid #aaa;
						width: 200rpx;
						height: 120rpx;
						border-radius: 15rpx;

						.value {
							font-weight: 500;
							font-size: 32rpx;
						}

						.text {
							font-size: 24rpx;
							color: #666;
							margin-top: 10rpx;
						}
					}
				}

				.tab {
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					gap: 15rpx;
					font-size: 22rpx;
					flex-wrap: wrap;

					.common {
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 20rpx;
						border: 1rpx solid #999;
						height: 40rpx;
						width: 140rpx;
						padding: 10rpx;
					}

					.active {
						color: #91AD60;
						background-color: #EAF7CC;
						border-color: #91AD60;
					}
				}

				.start {
					margin-top: 30rpx;
					text-align: center;

					button {
						font-size: 32rpx;
						border-radius: 30rpx;
						background-color: #007AFF;
						color: white;
					}

					.text {
						display: block;
						font-size: 22rpx;
						color: #aaa;
						margin-top: 15rpx;
					}
				}
			}
		}

		.hot {
			height: 420rpx;
			background-color: rgba(255, 255, 255, 0.95);

			.title {
				.right {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					font-weight: 500;
					color: #7991C3;
				}
			}

			.main {
				margin-top: 20rpx;

				.photo {
					image {
						width: 85vw;
						height: 180rpx;
						border-radius: 20rpx;
					}
				}

				.desc {
					image {
						width: 35rpx;
						height: 35rpx;
					}

					.one {
						display: flex;
						align-items: center;
						gap: 30rpx;

						.location {
							font-size: 30rpx;
							font-weight: 400;
						}

						.icon {
							font-size: 26rpx;
							color: #666;
						}
					}

					.two {
						margin-top: 10rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						gap: 50rpx;
						font-size: 26rpx;
						color: #666;

						.common {
							display: flex;
							align-items: center;
							gap: 15rpx;
						}
					}
				}
			}
		}
	}

	.detail-content-open {
		margin-top: -10rpx;

	}

	.detail-content-open-second {
		margin-top: -220rpx;
		backdrop-filter: blur(5px); // 可选：添加模糊效果
		background-color: rgba(248, 248, 248, 0.8);

		.weather,
		.other {
			background-color: rgba(248, 248, 248, 0.8);
			border-radius: 20rpx;
			margin-top: 20rpx;
		}
	}
</style>