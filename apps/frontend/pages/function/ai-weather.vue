<template>
	<view class="weather-container">
		<!-- 头部区域 -->
		<view class="header" :style="{background: headerBackground}">
			<view class="title">
				<uni-icons size="22" color="#FFF" @tap="goBack" type="left"></uni-icons>
				<text class="title-text">天气策略官</text>
			</view>
			<!-- 位置信息 -->
			<view class="location-info">
				<view class="left">
					<view class="location">
						<uni-icons size="24" color="#fff" type="location-filled"></uni-icons>
						<text class="location-text">{{location.name}}</text>
					</view>
					<view class="temperature">{{location.temperature}}</view>
					<view class="weather-desc">{{currentWeather.desc}}</view>
				</view>
				<view class="right">
					<image :src="currentWeather.icon" mode="aspectFill"></image>
				</view>
			</view>
			<!-- 天气情况 -->
			<view class="weather-details">
				<view class="detail-item">
					<text class="detail-label">湿度</text>
					<text class="detail-value">{{currentWeather.humidity}}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">紫外线</text>
					<text class="detail-value">{{currentWeather.uv}}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">风力</text>
					<text class="detail-value">{{currentWeather.windPower}}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">风向</text>
					<text class="detail-value">{{currentWeather.windDirection}}</text>
				</view>
				<view class="detail-item">
					<text class="detail-label">降水概率</text>
					<text class="detail-value">{{currentWeather.rainProbability}}</text>
				</view>
			</view>
		</view>

		  <!-- AI智能经营策略 -->
		    <view class="strategy-section">
		      <view class="section-title">
		        <text class="section-icon">🤖</text>
		        <text class="section-text">AI智能经营策略</text>
		        <text class="date">今日</text>
		      </view>
		      
		      <view class="strategy-alert">
		        <text class="alert-icon">⚠️</text>
		        <text class="alert-text">未来3小时内将有降雨，建议提前做好准备</text>
		      </view>
		      
		      <view class="strategy-list">
		        <view class="strategy-item" v-for="(item, index) in strategies" :key="index">
		          <text class="item-number">{{ index + 1 }}</text>
		          <text class="item-text">{{ item }}</text>
		        </view>
		      </view>
		    </view>

		<!-- 摆摊建议模块 -->
		<view class="stall-suggestion-section">
			<view class="section-header">
				<view class="section-title">
					<image style="height: 40rpx;width: 40rpx;" src="/static/chain.png"></image>
					<text>摆摊建议</text>
				</view>
				<text class="section-date">今日</text>
			</view>
		
		
			<view class="recommendation-grid">
				<view class="recommendation-item">
					<text class="rec-icon">🛍️</text>
					<text class="rec-title">推荐商品</text>
					<text class="rec-content">热饮、雨具、便携小吃</text>
				</view>
				<view class="recommendation-item">
					<text class="rec-icon">⏰</text>
					<text class="rec-title">最佳时段</text>
					<text class="rec-content">上午 09:00 - 11:30</text>
				</view>
				<view class="recommendation-item">
					<text class="rec-icon">📍</text>
					<text class="rec-title">推荐地点</text>
					<text class="rec-content">商场门口、公交站附近</text>
				</view>
				<view class="recommendation-item">
					<text class="rec-icon">⚠️</text>
					<text class="rec-title">注意事项</text>
					<text class="rec-content">14:00后可能有大雨</text>
				</view>
			</view>
		</view>

		<!-- 未来七天天气 -->
		<view class="future-weather-section">
		      <view class="section-header">
		        <view class="section-title">
					<uni-icons color="#1296DB" type="calendar" size="23"></uni-icons>
		        	<text>未来七天天气</text>
		        </view>
		      </view>
		      
		      <scroll-view class="weather-scroll" scroll-x="true">
		        <view class="weather-cards">
		          <view class="weather-card" v-for="(day, index) in futureWeather" :key="index">
		            <text class="day-name">{{day.day}}</text>
		            <image :src="day.icon" class="weather-icon" mode="aspectFit"></image>
		            <text class="day-temp">{{day.temp}}</text>
		            <text class="day-weather">{{day.weather}}</text>
		          </view>
		        </view>
		      </scroll-view>
		    </view>
	
	
	<!-- 未来24小时降水概率 -->
		<view class="rain-probability-section">
			<view class="section-header">
				<view class="section-title">
					<image style="height: 40rpx;width: 40rpx;" src="/static/barChart.png"></image>
					<text>未来24小时降水概率</text>
				</view>
			</view>

			<view class="rain-chart">
				<view class="rain-bar" v-for="(hour, index) in rainProbability" :key="index">
					<view class="bar-container">
						<view class="rain-fill" :style="{height: hour.probability + '%'}"></view>
					</view>
					<text class="hour-label">{{hour.time}}</text>
					<text class="probability-label">{{hour.probability}}%</text>
				</view>
			</view>
		</view>

		<!-- 雨天热门商品 -->
		<view class="hot-products-section">
			<view class="section-title">
				<uni-icons color="#1296DB" type="cart-filled" size="23"></uni-icons>
				<text>雨天热门商品</text>
			</view>

			<view class="products-grid">
				<view class="product-card" v-for="(product, index) in hotProducts" :key="index">
					<view class="product-image">
						<image :src="product.image" mode="aspectFill"></image>
						<view class="product-tag" :class="product.tagType">{{product.tag}}</view>
					</view>
					<view class="product-info">
						<text class="product-name">{{product.name}}</text>
						<view class="product-price">
							<text class="price-symbol">¥</text>
							<text class="price-value">{{product.price}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	// 响应式数据
	const backgroundColor = ref('linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)')
	const backgroundImageUrl = ref(
		'https://www.bing.com/th/id/OGC.971f2d3452627c620b6d39b64db09075?o=7&pid=1.7&rm=3&rurl=http%3a%2f%2fbpic.588ku.com%2felement_origin_min_pic%2f19%2f03%2f07%2f45e64923a987617b2c6a864f85221fe5.jpg&ehk=TM2oH6syr8ootlMpQKujRmG2PtbGXP7cG5I1AOhDngo%3d'
		)

	const location = ref({
		name: '湘潭市',
		temperature: '24°'
	})

	const currentWeather = ref({
		desc: '阴转小雨',
		icon: '/static/rain.png',
		humidity: '78%',
		uv: '弱',
		windPower: '3级',
		windDirection: '东南风',
		rainProbability: '85%'
	})
	
	// 经营策略数据
	const strategies = ref([
	  '准备雨具商品，如雨衣、雨伞等',
	  '考虑售卖热饮，如姜茶、热咖啡等',
	  '准备防水布和重物固定摊位',
	  '可准备一些一次性雨衣作为赠品'
	])
	
	const futureWeather = ref([
	  { day: '周一', icon: '/static/rain.png', temp: '24°', weather: '小雨' },
	  { day: '周二', icon: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.gp7mTqX2ycNIUatqt5bhjwAAAA?w=157&h=158&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3', temp: '22°', weather: '阴' },
	  { day: '周三', icon: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.bUcfWYAd85xGW-7BmzUtRgHaHa?w=198&h=198&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3', temp: '28°', weather: '晴' },
	  { day: '周四', icon: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.3-udVphHGt-ec50VMmDzBwAAAA?w=179&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3', temp: '26°', weather: '多云' },
	  { day: '周五', icon: '/static/rain.png', temp: '23°', weather: '小雨' },
	  { day: '周六', icon: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.bUcfWYAd85xGW-7BmzUtRgHaHa?w=198&h=198&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3', temp: '27°', weather: '晴' },
	  { day: '周日', icon: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.3-udVphHGt-ec50VMmDzBwAAAA?w=179&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3', temp: '25°', weather: '多云' }
	])

	// 未来24小时降水概率数据
	const rainProbability = ref([{
			time: '现在',
			probability: 30
		},
		{
			time: '14:00',
			probability: 65
		},
		{
			time: '15:00',
			probability: 85
		},
		{
			time: '16:00',
			probability: 90
		},
		{
			time: '17:00',
			probability: 75
		},
		{
			time: '18:00',
			probability: 60
		},
		{
			time: '19:00',
			probability: 45
		},
		{
			time: '20:00',
			probability: 30
		}
	])

	// 雨天热门商品数据
	const hotProducts = ref([{
			name: '时尚雨衣',
			price: '25',
			tag: '热销',
			tagType: 'hot',
			image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.rRwn8_IK5jTbZMEMgJ73iAHaHa?w=200&h=200&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3'
		},
		{
			name: '折叠雨伞',
			price: '35',
			tag: '热销',
			tagType: 'hot',
			image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.1vHMFpWqRoAM3v58eMWnlwHaHa?w=188&h=188&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3'
		},
		{
			name: '姜茶原料包',
			price: '18',
			tag: '新品',
			tagType: 'new',
			image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.RUrhzU5ofJ3_hBudvPEi0wAAAA?w=200&h=200&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3'
		},
		{
			name: '一次性雨衣',
			price: '5',
			tag: '促销',
			tagType: 'sale',
			image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.xv-qifGOC7QkEMwS-iqiLgHaHa?w=189&h=189&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3'
		}
	])

	// 计算属性 - 头部背景
	const headerBackground = computed(() => {
		return `url(${backgroundImageUrl.value}) no-repeat center/cover, ${backgroundColor.value}`
	})

	// 返回函数
	const goBack = () => {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.weather-container {
		width: 100vw;
		min-height: 100vh;
		background: #f5f7fa;
		display: flex;
		flex-direction: column;
		padding-bottom: 40rpx;
		
	}
	.section-title{
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.header {
		width: 100%;
		min-height: 500rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		color: #fff;
		position: relative;
		opacity: 0.9;

		.title {
			padding-top: 64rpx;
			display: flex;
			align-items: center;
			margin-bottom: 40rpx;
			gap: 20rpx;

			.title-text {
				font-size: 36rpx;
				font-weight: 600;
			}
		}

		.location-info {
			padding: 0 36rpx;
			margin-bottom: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				.location {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;

					.location-text {
						font-size: 32rpx;
						font-weight: 500;
						margin-left: 10rpx;
					}
				}

				.temperature {
					font-size: 80rpx;
					font-weight: 300;
					line-height: 1;
					margin: 20rpx 0;
				}

				.weather-desc {
					font-size: 28rpx;
					opacity: 0.9;
					font-weight: 500;
				}
			}

			.right {
				image {
					width: 150rpx;
					height: 150rpx;
				}
			}
		}

		.weather-details {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 20rpx;

			.detail-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 16rpx;
				padding: 20rpx;

				.detail-label {
					font-size: 24rpx;
					opacity: 0.8;
					margin-bottom: 8rpx;
				}

				.detail-value {
					font-size: 28rpx;
					font-weight: 600;
				}
			}
		}
	}

	.strategy-section {
	  
	 background: #fff;
	 border-radius: 20rpx;
	 margin: 20rpx;
	 padding: 30rpx;
	 box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
	  
	  .section-title {
	    display: flex;
	    align-items: center;
	    margin-bottom: 30rpx;
	    .section-icon {
	      font-size: 36rpx;
	      margin-right: 15rpx;
	    }
	    
	    .section-text {
	      font-size: 34rpx;
	      font-weight: 600;
	      flex: 1;
	    }
	    
	    .date {
	      font-size: 28rpx;
	      color: #666;
	    }
	  }
	  
	  .strategy-alert {
	    display: flex;
	    align-items: center;
	    background: #fff9e6;
	    border-left: 8rpx solid #ffc107;
	    padding: 20rpx;
	    border-radius: 10rpx;
	    margin-bottom: 40rpx;
	    
	    .alert-icon {
	      font-size: 36rpx;
	      margin-right: 15rpx;
	    }
	    
	    .alert-text {
	      font-size: 28rpx;
	      color: #e6a700;
	      flex: 1;
	    }
	  }
	  
	  .strategy-list {
	    margin-bottom: 40rpx;
	    
	    .strategy-item {
	      display: flex;
	      align-items: flex-start;
	      margin-bottom: 30rpx;
	      
	      .item-number {
	        display: flex;
	        justify-content: center;
	        align-items: center;
	        width: 40rpx;
	        height: 40rpx;
	        background: #4d7cfe;
	        color: #fff;
	        border-radius: 50%;
	        font-size: 24rpx;
	        margin-right: 20rpx;
	        flex-shrink: 0;
	        margin-top: 5rpx;
	      }
	      
	      .item-text {
	        font-size: 30rpx;
	        line-height: 1.5;
	        color: #333;
	      }
	    }
	  }
	  
	

	}
	.rain-probability-section {
		background: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

		.section-header {
			margin-bottom: 30rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}
		}

		.rain-chart {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			height: 200rpx;

			.rain-bar {
				display: flex;
				flex-direction: column;
				align-items: center;
				flex: 1;

				.bar-container {
					height: 120rpx;
					width: 30rpx;
					background: #f0f0f0;
					border-radius: 15rpx;
					margin-bottom: 15rpx;
					position: relative;
					overflow: hidden;

					.rain-fill {
						position: absolute;
						bottom: 0;
						left: 0;
						right: 0;
						background: linear-gradient(to top, #4dabf7, #228be6);
						border-radius: 15rpx;
						transition: height 0.3s ease;
					}
				}

				.hour-label {
					font-size: 22rpx;
					color: #666;
					margin-bottom: 8rpx;
				}

				.probability-label {
					font-size: 22rpx;
					color: #333;
					font-weight: 500;
				}
			}
		}
	}

	.hot-products-section {
		background: #fff;
		border-radius: 20rpx;
		margin: 0 20rpx 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		
		.section-header {
			.section-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}
		}

		.products-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 20rpx;
			margin-top: 15rpx;

			.product-card {
				background: #f8f9fa;
				border-radius: 16rpx;
				overflow: hidden;

				.product-image {
					position: relative;
					height: 200rpx;

					image {
						width: 100%;
						height: 100%;
					}

					.product-tag {
						position: absolute;
						top: 10rpx;
						right: 10rpx;
						padding: 6rpx 12rpx;
						border-radius: 12rpx;
						font-size: 20rpx;
						font-weight: 500;
						color: #fff;

						&.hot {
							background: #ff6b6b;
						}

						&.new {
							background: #51cf66;
						}

						&.sale {
							background: #ff922b;
						}
					}
				}

				.product-info {
					padding: 20rpx;

					.product-name {
						display: block;
						font-size: 26rpx;
						font-weight: 500;
						color: #333;
						margin-bottom: 10rpx;
					}

					.product-price {
						.price-symbol {
							font-size: 24rpx;
							color: #ff6b6b;
							font-weight: 500;
						}

						.price-value {
							font-size: 28rpx;
							color: #ff6b6b;
							font-weight: 600;
						}
					}
				}
			}
		}
	}

	.stall-suggestion-section {
		background: #fff;
		border-radius: 20rpx;
		margin: 0 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.section-date {
				font-size: 26rpx;
				color: #999;
			}
		}

		.recommendation-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 20rpx;

			.recommendation-item {
				background: #f8f9fa;
				border-radius: 16rpx;
				padding: 24rpx;
				text-align: center;

				.rec-icon {
					font-size: 40rpx;
					display: block;
					margin-bottom: 12rpx;
				}

				.rec-title {
					display: block;
					font-size: 26rpx;
					font-weight: 500;
					color: #333;
					margin-bottom: 8rpx;
				}

				.rec-content {
					font-size: 24rpx;
					color: #666;
					line-height: 1.4;
				}
			}
		}
		
		
		
	}
	
	.future-weather-section {
	  background: #fff;
	  border-radius: 20rpx;
	  margin: 20rpx  20rpx;
	  padding: 30rpx;
	  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
	  
	  .section-header {
	    margin-bottom: 30rpx;
	    
	    .section-title {
	      font-size: 32rpx;
	      font-weight: 600;
	      color: #333;
	    }
	  }
	  
	  .weather-scroll {
	    white-space: nowrap;
	    
	    .weather-cards {
	      display: inline-flex;
	      gap: 20rpx;
	      
	      .weather-card {
	        display: inline-flex;
	        flex-direction: column;
	        align-items: center;
	        background: #f8f9fa;
	        border-radius: 16rpx;
	        padding: 20rpx;
	        min-width: 120rpx;
	        
	        .day-name {
	          font-size: 26rpx;
	          font-weight: 500;
	          margin-bottom: 15rpx;
	          color: #333;
	        }
	        
	        .weather-icon {
	          width: 60rpx;
	          height: 60rpx;
	          margin-bottom: 15rpx;
	        }
	        
	        .day-temp {
	          font-size: 28rpx;
	          font-weight: 600;
	          color: #333;
	          margin-bottom: 8rpx;
	        }
	        
	        .day-weather {
	          font-size: 24rpx;
	          color: #666;
	        }
	      }
	    }
	  }
	}
</style>