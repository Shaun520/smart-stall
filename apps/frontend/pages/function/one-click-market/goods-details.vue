<script setup>
import {ref} from 'vue'

const list = ref([
	{
		id:'1',
		image:"https://tse2-mm.cn.bing.net/th/id/OIP-C.7v_k57ddqTtDadxx8H7FyAHaE7?w=225&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3",
		name:"网红爆款薯片组合装",
		purchase_price:'8.5',
		sale:'15',
		profit:'75%',
		sign:[{name:'高利润',type:'normal'},{name:'易销售',type:'warning'}]
	},
	{
		id:'2',
		image:"https://tse2-mm.cn.bing.net/th/id/OIP-C.jn_FTvJBryRmyAsH73CASAHaE7?w=276&h=184&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3",
		name:"进口巧克力礼盒",
		purchase_price:'9',
		sale:'18',
		profit:'70%',
		sign:[{name:'学生喜爱',type:'normal'},{name:'易销售',type:'warning'}]
	},
	{
		id:'3',
		image:"https://tse1-mm.cn.bing.net/th/id/OIP-C.JB7rmZRMGjuF7k2ZjbeR2wHaE7?w=276&h=184&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3",
		name:"奶茶饮料套装",
		purchase_price:'10',
		sale:'15',
		profit:'65%',
		sign:[{name:'学生喜爱',type:'normal'},{name:'复购率高',type:'warning'}]
	},
	 {
	    id: '4',
	    image: "https://tse2-mm.cn.bing.net/th/id/OIP-C.VdsWFdUV66OuuRVBSpsKogHaHa?w=200&h=200&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
	    name: "坚果大礼包",
	    purchase_price: '12',
	    sale: '25',
	    profit: '108%',
	    sign: [{name: '健康零食', type: 'normal'}, {name: '节日热销', type: 'warning'}]
	  },
	  {
	    id: '5',
	    image: "https://tse1-mm.cn.bing.net/th/id/OIP-C.cz9wVofMgGRXDszMwvI-UQHaFa?w=200&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1",
	    name: "速溶咖啡组合",
	    purchase_price: '7.5',
	    sale: '18',
	    profit: '140%',
	    sign: [{name: '办公必备', type: 'normal'}, {name: '高复购', type: 'warning'}]
	  },

])
</script>


<template>
  <view class="container">
	<!-- 头部栏 -->
	<uni-nav-bar status-bar title="推荐商品列表" left-icon="left"  @clickLeft="uni.navigateBack()" />
	
	<!-- 商品列表 -->
	<view class="list">
		<view class="product-card" v-for="item in list" :key="item.id">
			<view class="product-image">
				<image :src="item.image" mode="aspectFill" class="product-img"></image>
				<view class="product-tags">
					<view v-for="(i,index) in item.sign" :key="index" :class="{red:i.type == 'warning',blue:i.type == 'normal'}" class="product-tag">{{i.name}}</view>
				</view>
			</view>
			<view class="product-info">
				<view class="product-name">{{item.name}}</view>
				<view class="price-info">
					<view class="price-item">
						<view class="price-label">进货价</view>
						<view class="price-value">￥{{item.purchase_price}}</view>
					</view>
					<view class="price-item">
						<view class="price-label">建议售价</view>
						<view class="price-value highlight">￥{{item.sale}}</view>
					</view>
					<view class="price-item">
						<view class="price-label">预期利润</view>
						<view class="profit-value success">{{item.profit}}</view>
					</view>
				</view>
				<button class="add-btn" @click="addToConfig(1)">加入配置</button>
			</view>
		</view>
	</view>
  </view>
</template>


<style lang="scss" scoped>
page{
	background-color: #f5f5f5;
}
.container{
	.list{
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
}


</style>
