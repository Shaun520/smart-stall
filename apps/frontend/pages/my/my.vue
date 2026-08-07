<script setup>
	import {
		ref
	} from 'vue'
	import {
		getStatusBarHeight
	} from '../../utils/system';
	
	import {onShow} from '@dcloudio/uni-app'
	
	
	const info = ref({
		avatar:'',username:'',_id:''
	})
	
	
	
	onShow(()=>{
	    info.value.avatar = uni.getStorageSync('user').avatar
		info.value.username = uni.getStorageSync('user').username
		info.value._id = uni.getStorageSync('user')._id
	})
	
	
	
	//预览执照
	const handlePreView = ()=>{
		uni.previewImage({
			urls:['/static/qrcode.png'],
		})
	}
	//查看营收概览
	const handleRevenue = ()=>{
		uni.navigateTo({
			url:'/pages/my/my-revenue-detail'
		})
	}
	//跳转到编辑页面
	const handleNavEdit = ()=>{
		uni.navigateTo({
			url:"/pages/my/my-profile"
		})
	}
	//跳转到库存管理页面
	const handleNavStore = ()=>{
		uni.navigateTo({
			url:"/pages/my/my-inventory-management"
		})
	}
	//扫码
	const handleScan = ()=>{
		uni.scanCode({
			success: (res) => {
				console.log(res)
			}
		})
	}
	//
	const handleOpenCode = ()=>{
		uni.previewImage({
			urls:['https://tse3-mm.cn.bing.net/th/id/OIP-C.Vh7o3_5WiASfo4TLIAJ7ZQHaHa?w=142&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3'],
			
		})
	}
	//
	const handleAddItem = ()=>{
		uni.navigateTo({
			url:'/pages/my/my-add-item'
		})
	}
	//跳转到订单管理界面
	const handleNavOrder = ()=>{
		uni.navigateTo({
			url:'/pages/my/my-order-management'
		})
	}
	//退出登录
	const handleLogout = ()=>{
		uni.removeStorageSync('token')
		uni.removeStorageSync('user')
		uni.navigateTo({
			url:"/pages/login/login"
		})
	}
</script>


<template>
	<view class="container">
		<!-- 头部资料栏 -->
		<view class="header">
			<view class="info">
				<view class="avatar">
					<image :src='info.avatar' mode="aspectFill"></image>
				</view>
				<view class="detail">
					<view class="name">
						<view class="text">{{info.username}}</view>
						<view v-if="false"></view>
					</view>
					<view class="id">ID:{{info._id}}</view>
					<view class="auth">
						<image src="/static/chain.png"></image>
						<view class="text">小吃摊</view>
					</view>
				</view>
			</view>
			<view class="edit" @tap="handleNavEdit">
				<view class="icon"><uni-icons size="28" color="#aaa" type="contact"></uni-icons></view>
				<view class="text">编辑资料</view>
			</view>
		</view>
		<!-- 主体部分 -->
		<view class="body">
			<!-- 收入记录 -->
			<view class="bills">
				<view class="title">
					<view class="text">营收概览</view>
					<view class="more" @tap="handleRevenue">查看更多<uni-icons style="margin-left: 8rpx;" color="#aaa"
							type="arrow-right"></uni-icons></view>
				</view>
				<view class="main">
					<view class="today">
						<view class="text">
							<view class="label">今日收入</view>
							<view class="icons">
								<image src="/static/arrow-up.png"></image>
							</view>
						</view>
						<view class="number">
							<view class="income">￥125</view>
							<view class="change passive">-2.5%</view>
						</view>
						<view class="detail">较昨日</view>
					</view>
					<view class="week ">
						<view class="text">
							<view class="label">本周收入</view>
							<view class="icons">
								<image src="/static/barChart.png"></image>
							</view>
						</view>
						<view class="number">
							<view class="income">￥125</view>
							<view class="change active">+12.5%</view>
						</view>
						<view class="detail">较上周</view>
					</view>
				</view>
			</view>
			<!-- 快捷功能 -->
			<view class="shortcut">
				<view class="title">
					<view class="text">快捷功能</view>
				</view>
				<!-- 功能列表 -->
				<view class="main">
					<view class="func-item" @tap="handleAddItem">
						<view class="icon add"><image src="/static/add.png"></image></view>
						<view class="text">新增品项</view>
					</view>
					<view class="func-item">
						<view class="icon voice"><image src="/static/voice.png"></image></view>
						<view class="text">语音记账</view>
					</view>
					<view class="func-item" @tap="handleOpenCode">
						<view class="icon qrcode"><image src="/static/qrcode.png"></image></view>
						<view class="text">收款码</view>
					</view>
					<view class="func-item" @tap="handleScan">
						<view class="icon scan"><image src="/static/scan.png"></image></view>
						<view class="text">扫一扫</view>
					</view>
				</view>
			</view>
			<!-- 官方认证 -->
			<view class="auth">
				<view class="title">
					<view class="text">摊主营业执照</view>
					<view class="approve">已认证</view>
				</view>
				<view class="main">
					<!-- 已认证 -->
					<view class="auth-approve" @tap="handlePreView">
						<view class="details">
							<view class="name">
								<image src="/static/chain.png" mode=""></image>
								<text>小吃摊营业执照</text>
							</view>
							<view class="id">证照编号：HZ-XC-2023-189342</view>
						</view>
						<view class="qrcode"><image src="/static/qrcode.png"></image></view>
					</view>
					<!-- 未认证 -->
					<view class="auth-reject" v-if="false">
						
					</view>
				</view>
			</view>
			<!-- 管理功能 -->
			<view class="manage">
				<view class="title">
					<view class="text">管理功能</view>
				</view>
				<view class="main">
					<view class="item" @tap="handleNavOrder">
						<view class="left">
							<view class="icon order"><image src="/static/order.png"></image></view>
							<text>订单管理</text>
						</view>
						<view class="right"><uni-icons type="arrow-right"></uni-icons></view>
					</view>
					<view class="item" @tap="handleNavStore">
						<view class="left">
							<view class="icon store"><image src="/static/store.png"></image></view>
							<text>库存管理</text>
						</view>
						<view class="right"><uni-icons type="arrow-right"></uni-icons></view>
					</view>
					<view class="item">
						<view class="left">
							<view class="icon help"><image src="/static/help.png"></image></view>
							<text>帮助中心</text>
						</view>
						<view class="right"><uni-icons type="arrow-right"></uni-icons></view>
					</view>
					<view class="item">
						<view class="left">
							<view class="icon contact"><image src="/static/contact.png"></image></view>
							<text>联系客服</text>
						</view>
						<view class="right"><uni-icons type="arrow-right"></uni-icons></view>
					</view>
					<view class="item" @tap="handleLogout">
						<view class="left">
							<view class="icon logout"><uni-icons color="#f74421" type="redo"></uni-icons></view>
							<text>退出登录</text>
						</view>
						<view class="right"><uni-icons type="arrow-right"></uni-icons></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<style lang="scss" scoped>
	image {
		width: 50rpx;
		height: 50rpx;
	}

	.container {
		background-color: #F7F7F7;
		height: 100vh;

		.header {
			align-items: center;
			width: 100vw;
			display: flex;
			background-color: #FFFF;
			justify-content: space-between;
			height: 200rpx;

			.info {
				display: flex;
				gap: 18rpx;
				margin-left: 20rpx;

				.avatar {
					image {
						width: 140rpx;
						height: 140rpx;
						border-radius: 50%;
					}
				}

				.detail {
					display: flex;
					flex-direction: column;
					gap: 5rpx;

					.name {
						font-weight: bold;
						font-size: 36rpx;
					}

					.id {
						color: #999;
						font-size: 26rpx;
					}

					.auth {
						image {
							width: 30rpx;
							height: 30rpx;
						}

						width: 150rpx;
						background-color:#EBF7FF;
						color: #30c1ff;
						font-size: 25rpx;
						display: flex;
						align-items: center;
						gap: 8rpx;
						border-radius: 8rpx;
					}
				}
			}

			.edit {
				margin-top: 20rpx;
				margin-right: 20rpx;
				font-size: 24rpx;
				color: #aaa;
				display: flex;
				align-items: center;
				flex-direction: column;
			}
		}

		.body {
			margin-top: 20rpx;
			
			height: 95vh;
			.title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.text {
					font-size: 36rpx;
					font-weight: bold;
				}
			}

			.bills,.shortcut,.auth,.manage {
				padding: 20rpx;
				height: 300rpx;
				background-color: #FFFF;
				margin-top: 20rpx;
			}
			.manage{
				height: 450rpx;
				.main{
					display: block;
					.item{
						margin-top: 20rpx;
						display: flex;
						justify-content: space-between;
						width: 90vw;
						align-items: center;
						border-bottom: 2rpx solid  #F7F7F7;
						padding-bottom: 20rpx;

						.left{
							display: flex;
							gap: 20rpx;
							align-items: center;
							font-weight: 500;
							font-size: 30rpx;
							.logout{
								background-color: #f79f8f;
							}
							.help{
								background-color: #F1EEFE;
							}
							.order{
								background-color:#E8F9F3;
							}
							.store{
								background-color: #FFF2EC;
							}
							.contact{
								background-color: #E5FBF1;
							}
							.icon{
								width: 65rpx;
								height: 65rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 10rpx;
								image{
									width: 40rpx;
									height: 40rpx;
								}
							}
						}
					}
				}
			}
			.auth{
				.main{
					.auth-approve{
						width: 80vh;
						background-color: #F9FBFC;
						height: 180rpx;
						border-radius: 10rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0 30rpx;
						.details{
							.name{
								display: flex;
								gap: 15rpx;
								font-size: 32rpx;
								font-weight: bold;
							}
							.id{
								margin-top: 10rpx;
								font-size: 26rpx;
								color: #aaa;
							}
						}
						.qrcode{
							width: 120rpx;
							height: 120rpx;
							border: 1rpx solid #E7E9EB;
							border-radius: 10rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							image{
								width: 100rpx;
								height: 100rpx;
							}
						}
					}
				}
			}
			.bills{
				.more {
					font-size: 24rpx;
					color: #aaa;
				}
				.main{
					.today:hover,.week:hover{
							 box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.15);
							  transform: translateY(2px); /* 轻微下移模拟按下效果 */
					}
				}
			}
			.auth{
				.approve{
					color: #3caa6a;
					font-size: 26rpx;
					background-color: #D7FFED;
					width: 100rpx;
					height: 40rpx;
					text-align: center;
					border-radius: 10rpx;
				}
			}
			
			.shortcut{
				.main{
					margin-top: 15rpx;
					justify-content: space-between;
					.func-item{
						display:flex;
						flex-direction: column;
						align-items: center;
						gap: 10rpx;
						.icon{
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100rpx;
							height: 100rpx;
							border-radius: 50%;
						}
						.text{
							font-size: 28rpx;
							font-weight: 500;
						}
						.add{
							 background-color: #F1EEFF;
						}
						.voice{
							background-color: #EBF6FB;
						}
						.qrcode{
							background-color: #FEF5E5;
						}
						.scan{
							background-color: #E7FBEF;
						}
					}
					
				}
			}

			.main {
				padding: 20rpx;
				display: flex;
				gap: 20rpx;

				.today,
				.week {
					display: flex;
					flex-direction: column;
					width: 40vw;
					background-color: #F9FBFC;
					border-radius: 15rpx;
					padding: 20rpx;

					.text {
						display: flex;
						justify-content: space-between;

						.label {
							color: #999;
						}
					}

					.number {
						display: flex;
						align-items: baseline;
						gap: 20rpx;

						.income {
							font-weight: bold;
							font-size: 36rpx;
							margin-left: -5rpx;
						}

						.change {
							font-size: 26rpx;
						}

						.active {
							color: #65B181;
						}

						.passive {
							color: #ff5500;
						}
					}

					.detail {
						font-size: 22rpx;
						color: #aaa;
					}
				}

			}
		}
	}
</style>