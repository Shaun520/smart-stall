<template>
	<view class="container">
		<!-- 导航栏-->
		<uni-nav-bar  height="250rpx"  right-width="0" left-width="0" status-bar >
			<template  #default>
				<view class="position">
					<view class="opt" style="display: flex;">
						<uni-icons @tap="uni.navigateBack()" class="left" size="24" type="left"></uni-icons>
						<view class="choose-pos">
							<view class="start" @tap="handleChooseStart">
								<view class="icon-start"></view>
								<input disabled type="text" v-model="startPos" />
							</view>
							<view class="end" @tap="handleChooseEnd">
								<view class="icon-end"></view>
								<input  disabled type="text" v-model="endPos" />
							</view>
						</view>
					</view>
					<view class="way" @tap="handleWayClick">
						<view class="walk" :class="{ active: activeWay === 'walk' }">步行</view>
						<view class="drive" :class="{ active: activeWay === 'drive' }">驾车</view>
						<view class="bus" :class="{ active: activeWay === 'bus' }">公交</view>
						<view class="ride" :class="{ active: activeWay === 'ride' }">骑行</view>
					</view>
				</view>
			</template>
		</uni-nav-bar>
		

		<view class="map_box">
			<!-- <map show-location id="navi_map" :longitude="longitude" :latitude="latitude" scale="12" :markers="markers"
				:polyline="polyline"></map> -->
		</view>

		<view class="text_box">
			<view class="text">总路程：<span style="font-weight: 500;">{{distance}}</span></view>
			<view class="text">总计时长：<span style="font-weight: 500;">{{cost}}</span></view>
			<view class="detail_button" @tap="goDetail">开始导航</view>
		</view>
	</view>
</template>





<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	// import AMapWX from '../../common/amap-wx.130.js'
	//地图起始经纬度
	const longitude = ref('')
	const latitude = ref('')
	
	//终点和起点的选择
	const choose = ref('')
	//起点
	const startPos= ref('湘潭')
	//终点
	const endPos= ref('株洲')
	const activeWay = ref('walk')
	const handleWayClick = (event) => {
		// 检查点击的是哪个子元素
		const target = event._relatedInfo.anchorTargetText;
		// 如果点击的是子元素且具有特定的类名
		if (target == "步行") {
			activeWay.value = 'walk';
		} else if (target == "驾车") {
			activeWay.value = 'drive';
		} else if (target == "公交") {
			activeWay.value = 'bus';
		} else if (target == "骑行") {
			activeWay.value = 'ride';
		}
	};

	//处理起点位置选择逻辑
	const handleChooseStart = () => {
		uni.navigateTo({
			url:'/pages/map/search?choose=start',
		})
	}
	//处理终点位置选择逻辑
	const handleChooseEnd = () => {
		uni.navigateTo({
			url:'/pages/map/search?choose=end',
		})
	}
	const markers = ref([{
			iconPath: "@/static/logo.png",
			id: 0,
			latitude: 39.989643,
			longitude: 116.481028,
			width: 23,
			height: 33
		},
		{
			iconPath: "@/static/logo.png",
			id: 0,
			latitude: 39.90816,
			longitude: 116.434446,
			width: 24,
			height: 34
		}
	]);

	const distance = ref('155米');
	const cost = ref('1小时26分钟');
	const polyline = ref([]);
	
	
	onLoad((e)=>{
		// //数据初始化
		// const {getPos,getStartPos,getEndPos,setEndPos,setStartPos,setPos} = useMapStore()
		// longitude.value = getPos().longitude
		// latitude.value = getPos().latitude
		// startPos.value =  getStartPos()
		// endPos.value = getEndPos()
		// //数据处理
		// if(e && Object.keys(e).length > 0){
		// 	choose.value = e.choose
		// 	if(e.latitude !== 'undefined' ){
		// 		setPos({latitude:e.latitude,longitude:e.longitude})
		// 		longitude.value = getPos().longitude
		// 		latitude.value = getPos().latitude
		// 	}
			 
		// 	if(choose.value === 'start' ){
		// 		setStartPos(e.name)
		// 		startPos.value =  getStartPos()
		// 	}
			 
		// 	else if(choose.value === 'end'){
		// 		setEndPos(e.name)
		// 		endPos.value = getEndPos()
		// 	}
			 
		// }
		
	})


	/*const walkPlan = () => {

		const myAmapFun = new AMapWX({
			key: 'ceb7e1c0a3168aed1d9bd09fc0210956'
		});
		myAmapFun.getWalkingRoute({
			origin: '116.481028,39.989643',
			destination: '116.434446,39.90816',
			success: (data) => {
				console.log('data:',data)
				const points = [];
				if (data.paths && data.paths[0] && data.paths[0].steps) {
					
					const steps = data.paths[0].steps;
					for (let i = 0; i < steps.length; i++) {
						const poLen = steps[i].polyline.split(';');
						for (let j = 0; j < poLen.length; j++) {
							
							points.push({
								longitude: parseFloat(poLen[j].split(',')[0]),
								latitude: parseFloat(poLen[j].split(',')[1])
							});
						}
					}
				}
				

				polyline.value = [{
					points: points,
					color: "#32CD32",
					width: 8,
					arrowLine: true
				}];

				if (data.paths[0] && data.paths[0].distance) {
					distance.value = data.paths[0].distance + '米';
				}
				if (data.paths[0] && data.paths[0].duration) {
					cost.value = parseInt(data.paths[0].duration / 60) + '分钟';
				}
			},
			fail: (info) => {
				console.log(info);
			}
		});
	}
*/

	const goDetail = () => {
		uni.navigateTo({
			url: '../navigation_walk_detail/navigation'
		});
	};

	const goToCar = () => {
		uni.redirectTo({
			url: '../navigation_car/navigation'
		});
	};

	const goToBus = () => {
		uni.redirectTo({
			url: '../navigation_bus/navigation'
		});
	};

	const goToRide = () => {
		uni.redirectTo({
			url: '../navigation_ride/navigation'
		});
	};

	const goToWalk = () => {
		uni.redirectTo({
			url: '../navigation_walk/navigation'
		});
	};
</script>


<style lang="scss" scoped>
	page{
		background-color: #F7F7F7;
	}
	.position {
		width: 100vw;
		height: 230rpx;
		background-color: #F7F7F7F;
		border-radius: 15rpx;
		.opt{
			width: 100%;
			height: 100%;
			margin-top: 20rpx;
		}
		.choose-pos {
			width: 90%;
			height: 64%;
			margin: 0 auto;
			background-color: #F6F7FB;
			border-radius: 15rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;

			.start,
			.end {
				margin: 0 22rpx;
				gap: 12rpx;
				display: flex;
				font-size: 26rpx;
				align-items: center;
			}

			.start {
				
				.icon-start {
					border-radius: 50%;
					background-color: green;
					width: 16rpx;
					height: 16rpx;
				}
				padding-bottom: 15rpx;
				border-bottom: 1rpx dashed #aaa;
			}

			.end {
				.icon-end {
					border-radius: 50%;
					background-color: red;
					width: 16rpx;
					height: 16rpx;
				}
			}
		}

		.way {
			width: 100%;
			display: flex;
			justify-content: space-around;
			font-size: 26rpx;
			text-align: center;
			margin-top: -60rpx;
			view {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 120rpx;
				height: 45rpx;
				border-radius: 26rpx;
			}

			.active {
				background-color: #3D5D8C;
				color: #FFFFFF;
				font-weight: 700;

			}
		}
	}


	.map_box {}

	#navi_map {
		width: 100%;
		height: 100vh;
	}

	.text_box {
		position: absolute;
		height: 90px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		z-index: 33;
		height: 240rpx;
		background-color: #FFFFFF;
	}

	.text_box .text {
		margin: 15px;
		font-weight: bold;
	}

	.detail_button {
		padding: 3px 5px;
		color: #fff;
		background: #0091ff;
		width: 250rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		margin: 0 auto;
	}
</style>