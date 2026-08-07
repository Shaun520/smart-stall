<script setup>
	// import AMapWX from '@/common/amap-wx.130.js'
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'




	//终点和起点的选择
	const choose = ref('')
	//关键字搜索
	const keywords = ref('')

	const list = ref([{
		"id": [],
		"name": "北京市",
		"district": "北京市",
		"adcode": "110101",
		"location": [],
		"address": "东城区",
		"typecode": "190102",
		"city": []
	}, {
		"id": "B000A83C36",
		"name": "北京站",
		"district": "北京市东城区",
		"adcode": "110101",
		"location": "116.427354,39.902830",
		"address": "毛家湾胡同甲13号",
		"typecode": "150200",
		"city": []
	}, ])

	onLoad((e) => {
		choose.value = e.choose
		keywords.value = e.name
		
		//handleSearch()
	})

	const handleSearch = () => {
		// const myAmapFun = new AMapWX({
		// 	key: 'ceb7e1c0a3168aed1d9bd09fc0210956'
		// });
		// uni.showLoading()
		// myAmapFun.getInputtips({
		// 	keywords:keywords.value,
		// 	location: '',
		// 	success: function(data) {
		// 		if (data && data.tips) {
		// 		   list.value = data.tips
		// 		} else {
		// 		   list.value = [] // 确保空数组时显示提示
		// 		}
		// 		uni.hideLoading()
		// 	},
		// 	fail: function() {
		// 		list.value = [] // 请求失败时也设为空数组
		// 		uni.hideLoading()
		// 	}
		// })
	}

	const judge = (name) => {
		// const {
		// 	getEndPos,
		// 	getStartPos
		// } = mapStore
		// if (getStartPos() === name && choose.value === 'end' || getEndPos() === name && choose.value === 'start')
		// 	return false
		// return true
	}

	//处理跳转逻辑
	const handleNavTo = (item) => {
		//判断起点和终点：不能选择一样
		// if (!judge(item.name)) {
		// 	uni.showModal({
		// 		title: "终点和起点不能选择一样",
		// 		showCancel: false
		// 	})
		// 	return
		// }

		// let position = item.location

		// if (position && Object.keys(position).length === 0) {} else position = position.split(',')
		// uni.navigateTo({
		// 	url: `/pages/map/map?name=${item.name}&longitude=${position[0]}&latitude=${position[1]}&choose=${choose.value}`
		// })
		
		uni.navigateTo({
			url:'/pages/map/map'
		})
	}

	//处理返回逻辑
	const handleBack = () => {
		uni.navigateBack()
	}

	const handleTest = () => {
		uni.getFuzzyLocation({
			type: 'wgs84', // 或 'gcj02'
			altitude: false, // 不获取高度
			success: (res) => {
				console.log('模糊位置:', res.latitude, res.longitude);
			},
			fail: (err) => {
				console.error('获取位置失败:', err);
			}
		})
	}
</script>

<template>
	<view class="container">
		<!-- 导航栏：标题 + 保存按钮 -->
		<uni-nav-bar status-bar left-width="80rpx" left-icon="left"  @clickLeft="uni.navigateBack()" :fixed="true">
			<template #default>
				<view class="search-input">
					<input type="text"  placeholder="请输入搜索地点"/>
				</view>
			</template>
			<template #right>
				<view class="search-btn">
					搜索
				</view>
			</template>
		</uni-nav-bar>
	

		<!-- 搜索列表/历史记录 -->
		<view class="history" :class="{'empty-list':!list.length}">
			<view class="label" v-if="list.length">
				<view class="text">搜索结果</view>
				<view class="opt" >
					<view class="clear" @tap="list = []">清空</view>
					<view>|</view>
					<view class="manage">管理</view>
				</view>
			</view>
			
			<!-- 空状态提示 -->
			<view v-if="list.length === 0" class="empty-state">
				<uni-icons type="search" size="60" color="#ccc"></uni-icons>
				<view class="empty-text">暂无搜索结果</view>
				<view class="empty-subtext">请尝试其他关键词</view>
			</view>
			
			<!-- 搜索结果列表 -->
			<view v-else class="list">
				<view class="item" v-for="item in list" :key="item.id" @tap="handleNavTo(item)">
					<uni-icons :type="item.location && item.location.length>0?'location':'search'" size="22"></uni-icons>
					<view class="text">
						<view class="name">{{item.name}}</view>
						<view class="detail">
							<view class="district">{{item.district}}</view>
							<view class="address">{{item.address?item.address:''}}</view>
						</view>
					</view>
					<uni-icons type="close" size="20" @tap.stop="list = list.filter(i => i.id !== item.id)"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.search-input{
		display:flex;
		align-items: center;
		margin-left: -20rpx;
		input{
			width:400rpx;
		}
	}
	.search-btn{
		font-size: 30rpx;
		color:#55aaff;
	}
	.empty-list{
		background-color: #F5F5F5 !important;
		box-shadow: none !important;
		border:none !important;
	}
	.container {
		min-height: 100vh;
		background-color: #f5f5f5;
		
		

		.history {
			margin: 20rpx;
			margin-top: 30rpx;
			background-color: #fff;
			border-radius: 10px;
			padding: 20rpx;
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

			.label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #f0f0f0;
				

				.text {
					font-weight: 550;
					font-size: 28rpx;
				}

				.opt {
					display: flex;
					gap: 20rpx;
					font-size: 24rpx;
					color: #aaa;
					
					.clear, .manage {
						&:active {
							color: #007AFF;
						}
					}
				}
			}
			
			.empty-state {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 80rpx 0;
				color: #999;
				
				
				.empty-text {
					margin-top: 20rpx;
					font-size: 28rpx;
				}
				
				.empty-subtext {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #ccc;
				}
			}

			.list {
				margin-top: 20rpx;

				.item {
					font-size: 26rpx;
					display: flex;
					gap: 15rpx;
					margin-bottom: 25rpx;
					align-items: flex-start;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #f5f5f5;

					.text {
						flex: 1;
						overflow: hidden;
						
						.name {
							font-weight: bold;
							font-size: 28rpx;
							margin-bottom: 8rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						
						.detail {
							display: flex;
							flex-direction: column;
							gap: 5rpx;
							color: #888;
							font-size: 22rpx;
							
							.district, .address {
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
					
					.uni-icons {
						color: #ccc;
						flex-shrink: 0;
						margin-top: 5rpx;
					}
				}
				
				.item:last-child {
					border-bottom: none;
					margin-bottom: 0;
				}
			}
		}
	}
</style>