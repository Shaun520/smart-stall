<script setup>
import {ref} from 'vue'
const list = ref([
	{
		id:'1',
		image:"https://tse3-mm.cn.bing.net/th/id/OIP-C.tRY1djdnqBEXb97KefI6ygHaE7?w=274&h=182&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
		name:"西单大悦城",
		like:"4.6",
		flow:"1.8万",
		profit:"4k-5k",
		sign:['传统商圈','学生客群']
	},
	{
		id:'2',
		image:"https://tse4-mm.cn.bing.net/th/id/OIP-C.Hx5X5pa6x8SG9K5RJJJWIAHaE8?w=241&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
		name:"三里屯太古里",
		like:"4.9",
		flow:"3.1万",
		profit:"5k-6k",
		sign:['高端商圈','国际化']
	},
	{
		id:'3',
		image:"https://tse4-mm.cn.bing.net/th/id/OIP-C.QaXIOB_naEUa-D1r6CBgpAHaE-?w=234&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
		name:"朝阳大悦城",
		like:"4.8",
		flow:"3.1万",
		profit:"5k-6k",
		sign:['高端商圈','国际化']
	},
	 {
	    id: '4',
	    image: "https://tse2-mm.cn.bing.net/th/id/OIP-C.7aJl1RcK3FEHNTN8Xy8ukAHaE8?w=250&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
	    name: "王府井百货",
	    like: "4.7",
	    flow: "2.5万",
	    profit: "4.5k-5.5k",
	    sign: ['历史地标', '旅游景点']
	  },
	  {
	    id: '5',
	    image: "https://tse4-mm.cn.bing.net/th/id/OIP-C.XNbYiI1esBdpYqUXk9iOlgHaEs?w=214&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
	    name: "国贸商城",
	    like: "4.9",
	    flow: "3.5万",
	    profit: "6k-8k",
	    sign: ['奢侈品', '商务区']
	  },
	  {
	    id: '6',
	    image: "https://tse4-mm.cn.bing.net/th/id/OIP-C.JSd2nv6nBpp-bD5DClIXWgHaE8?w=250&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
	    name: "蓝色港湾",
	    like: "4.8",
	    flow: "2.8万",
	    profit: "5k-7k",
	    sign: ['湖畔购物', '家庭娱乐']
	  },
	
])

</script>


<template>
  <view class="location-container">
	  <!-- 头部栏 -->
	<uni-nav-bar status-bar title="推荐地点列表"  left-icon="left"  @clickLeft="uni.navigateBack()" />
	
	<!-- 地点列表 -->
	<view class="list">
		<view class="location-card" @click="selectLocation(3)" v-for="item in list" :key="item.id">
			<view class="location-image">
				<image :src="item.image" mode="aspectFill"></image>
			</view>
			<view class="location-content">
				<view class="location-header">
					<view class="location-name">{{item.name}}</view>
					<view class="location-score">
						<uni-icons type="star-filled" size="16" color="#FFB800"></uni-icons>
						{{item.like}}
					</view>
				</view>
				<view class="location-details">
					<view class="detail-item">
						<uni-icons type="staff-filled" size="16" color="#666"></uni-icons>
						<text class="detail-text">日均客流{{item.flow}}</text>
					</view>
					<view class="detail-item">
						<uni-icons type="wallet-filled" size="16" color="#666"></uni-icons>
						<text class="detail-text">{{item.profit}}/月</text>
					</view>
				</view>
				<view class="location-tags">
					<view class="tag-item"  v-for="(i,index) in item.sign" :key="index">{{i}}</view>
				</view>
				<view class="check-mark" v-if="selectedLocation === 3">
					<uni-icons type="checkmarkempty" size="24" color="#52c41a"></uni-icons>
				</view>
			</view>
		</view>
	</view>
  </view>
</template>


<style lang="scss" scoped>
page{
	background-color: #f5f5f5;
}
.location-container{
	width: 100vw;
	height: 100vh;
	.list{
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
}


</style>
