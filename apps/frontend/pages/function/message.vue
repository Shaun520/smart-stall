<template>
	<view class="container">
		<!-- 导航栏：标题-->
		<uni-nav-bar left-icon="left" @clickLeft="uni.navigateBack()" status-bar  title="消息中心" >
		</uni-nav-bar>
		<!-- 消息列表 -->
		<view class="list-container">
			<view @tap="handleNavDetail" v-for="(item, index) in conversationList" :key="index" class="conversation-item">
				<view class="header">
					<text>{{ item.name }}</text>
					<text class="arrow" :class="{ 'rotate': item.expanded }" @tap.stop="(e)=>toggleConversation(e,index)">▼</text>
				</view>
				<view v-show="item.expanded" class="content">
					{{ item.desc }}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const conversationList = ref([{
			name: '小白的咖啡',
			desc: '可以折叠/展开的内容区域，用于对复杂区域进行分组和隐藏，保持页面的整洁。',
			expanded: true
		},
		{
			name: '顾客老王',
			desc: '最近咨询了商品信息',
			expanded: false
		},
		{
			name: '智慧市井',
			desc: '订单已发货，请注意查收',
			expanded: false
		}
	])


	function toggleConversation(e,index) {
		e.preventDefault();
		this.conversationList[index].expanded = !this.conversationList[index].expanded;
	}

	function goBack() {
		uni.navigateBack();
	}
	
	//跳转聊天界面
	const handleNavDetail = ()=>{
		uni.navigateTo({
			url:'/pages/function/message-detail?id=1'
		})
	}
</script>

<style scoped>
	page {
		background-color: #f5f5f5;
	}

	.list-container {
		margin-top: 20rpx;
	}

	.conversation-item {
		background-color: #fff;
		margin: 0 30rpx 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 30rpx;
		font-size: 32rpx;
		cursor: pointer;
	}

	.arrow {
		font-size: 28rpx;
		transition: transform 0.3s;
	}

	.rotate {
		transform: rotate(180deg);
	}

	.content {
		padding: 20rpx 30rpx;
		color: #666;
		font-size: 28rpx;
		background-color: #f9f9f9;
	}
</style>