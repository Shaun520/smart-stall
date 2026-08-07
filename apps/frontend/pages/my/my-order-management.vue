<template>
	<view class="container">
		<!-- 状态栏 -->
		<uni-nav-bar status-bar left-icon="left" title="订单管理" @clickLeft="uni.navigateBack()" :fixed="true">

		</uni-nav-bar>
		<!-- 订单状态筛选 -->
		<view class="order-status-tabs">
			<view v-for="(status, index) in orderStatusList" :key="index" class="status-tab"
				:class="{ active: currentStatusIndex === index }" @click="changeStatus(index)">
				{{ status.name }}
			</view>
		</view>

		<!-- 订单列表（使用 scroll-view 正确写法） -->
		<scroll-view class="order-list" scroll-y="true" @scrolltolower="loadMoreData" :show-scrollbar="false">
			<!-- 订单卡片 -->
			<view v-for="order in filteredOrders" :key="order.orderId" class="order-card">
				<!-- 店铺信息 -->
				<view class="store-header">
					<text class="store-name">{{ order.storeName }}</text>
					<text class="order-status" :class="getStatusClass(order.status)">
						{{ getOrderStatusText(order.status) }}
					</text>
				</view>

				<!-- 商品信息 -->
				<view class="product-info" @click="goToOrderDetail(order.orderId)">
					<image :src="order.product.image" class="product-image" mode="aspectFill" />
					<view class="product-details">
						<text class="product-title">{{ order.product.title }}</text>
						<!-- 商品属性 -->
						<view class="product-attributes">
							<text v-for="(value, key) in order.product.attributes" :key="key" class="attribute">
								{{ key }}: {{ value }}
							</text>
						</view>
						<!-- 数量和价格 -->
						<view class="quantity-price">
							<view class="number">x{{ order.product.quantity }}</view>
							<view class="price"> ¥{{ order.product.price.toFixed(2) }}</view>
						</view>
					</view>
				</view>

				<!-- 操作按钮（位于右下角，不遮挡价格） -->
				<view class="action-buttons">
					<button v-if="order.status === 'pending'" class="btn btn-contact"
						@click.stop="contactBuyer(order.orderId)">
						联系买家
					</button>
					<button v-if="order.status === 'pending'" class="btn btn-confirm"
						@click.stop="confirmShipment(order.orderId)">
						确认发货
					</button>
					<button v-if="order.status === 'shipped'" class="btn btn-view"
						@click.stop="viewLogistics(order.orderId)">
						查看物流
					</button>
					<button v-if="order.status === 'shipped'" class="btn btn-complete"
						@click.stop="completeOrder(order.orderId)">
						完成订单
					</button>
					<button v-if="order.status === 'cancelled'" class="btn btn-delete"
						@click.stop="deleteOrder(order.orderId)">
						删除订单
					</button>
					<button class="btn btn-view" @click.stop="goToOrderDetail(order.orderId)">
						查看详情
					</button>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="hasMore" class="load-more" @click="loadMoreData">加载更多</view>
			<view v-else-if="!loading && !orders.length" class="no-data">暂无订单数据</view>
			<view v-else-if="!hasMore" class="no-more">已加载全部订单</view>
		</scroll-view>

	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'

	// 订单状态
	const orderStatusList = [{
			name: '全部订单',
			value: 'all'
		},
		{
			name: '待处理',
			value: 'pending'
		},
		{
			name: '待发货',
			value: 'toShip'
		},
		{
			name: '已发货',
			value: 'shipped'
		},
		{
			name: '已完成',
			value: 'completed'
		},
		{
			name: '已取消',
			value: 'cancelled'
		}
	]

	const currentStatusIndex = ref(0)
	const currentPage = ref(1)
	const pageSize = ref(5)
	const hasMore = ref(true)
	const loading = ref(false)
	const orders = ref([])

	// 获取状态文本
	const getOrderStatusText = (status) => {
		const map = {
			pending: '待处理',
			shipped: '已发货',
			completed: '已完成',
			cancelled: '已取消'
		}
		return map[status] || '未知状态'
	}

	// 获取状态样式类
	const getStatusClass = (status) => `status-${status}`

	// 过滤订单
	const filteredOrders = computed(() => {
		if (currentStatusIndex.value === 0) return orders.value
		const statusValue = orderStatusList[currentStatusIndex.value].value
		let filterStatus = ''
		switch (statusValue) {
			case 'pending':
			case 'toShip':
				filterStatus = 'pending'
				break
			case 'shipped':
				filterStatus = 'shipped'
				break
			case 'completed':
				filterStatus = 'completed'
				break
			case 'cancelled':
				filterStatus = 'cancelled'
				break
			default:
				filterStatus = ''
		}
		return filterStatus ? orders.value.filter(o => o.status === filterStatus) : orders.value
	})

	// 切换状态
	const changeStatus = (index) => {
		currentStatusIndex.value = index
		if (currentPage.value !== 1) {
			currentPage.value = 1
			hasMore.value = true
		}
	}

	// 模拟加载订单
	const fetchOrders = async (page = 1) => {
		if (loading.value) return
		loading.value = true
		await new Promise(r => setTimeout(r, 800))

		const mockData = [{
				orderId: '2023102512345678',
				storeName: '科技数码旗舰店',
				status: 'pending',
				product: {
					image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/cdbbd10a81e053bb8331aa4ee5c46788.png',
					title: '无线蓝牙耳机 主动降噪 高清音质 长续航 运动耳机',
					attributes: {
						颜色: '白色',
						规格: '标准版'
					},
					price: 299.00,
					quantity: 1
				}
			},
			{
				orderId: '2023102487654321',
				storeName: '时尚服饰专营店',
				status: 'shipped',
				product: {
					image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/9c6cf7e59dd8b63e3d975382f4c76a7a.png',
					title: '男士纯棉休闲衬衫 长袖修身免烫商务正装白衬衫',
					attributes: {
						颜色: '蓝色',
						尺码: 'XL'
					},
					price: 159.00,
					quantity: 1
				}
			},
			{
				orderId: '2023102398765432',
				storeName: '智能设备体验店',
				status: 'pending',
				createTime: '2023-10-23 09:45',
				product: {
					image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/09b0fc122de625b58fd261d48f36590b.png',
					title: '智能手表 心率监测 血氧检测 运动模式 长续航',
					attributes: {
						颜色: '黑色',
						规格: '42mm'
					},
					price: 399.00,
					quantity: 1
				},
				totalQuantity: 1,
				totalAmount: 399.00
			},
			{
				orderId: '2023102211223344',
				storeName: '生活家居生活馆',
				status: 'pending',
				createTime: '2023-10-22 16:20',
				product: {
					image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/274ce84e3e367fff6810aa6ff83bd1fd.png',
					title: '大容量玻璃水杯 带刻度 便携泡茶杯 耐高温',
					attributes: {
						颜色: '透明蓝',
						规格: '500ml'
					},
					price: 89.00,
					quantity: 2
				},
				totalQuantity: 2,
				totalAmount: 178.00
			},
			{
				orderId: '2023102055667788',
				storeName: '图书音像专营店',
				status: 'cancelled',
				createTime: '2023-10-20 10:15',
				product: {
					image: 'https://design.gemcoder.com/staticResource/echoAiSystemImages/e2a5495869ab1fbe11137a64ab63d9f4.png',
					title: 'JavaScript高级程序设计 第4版 前端开发进阶教程',
					attributes: {
						版本: '第四版'
					},
					price: 108.00,
					quantity: 1
				},
				totalQuantity: 1,
				totalAmount: 108.00
			}
		]

		const start = (page - 1) * pageSize.value
		const end = start + pageSize.value
		const pageData = mockData.slice(start, end)

		if (page === 1) {
			orders.value = pageData
		} else {
			orders.value.push(...pageData)
		}

		hasMore.value = pageData.length === pageSize.value && page < 2
		loading.value = false
	}

	// 加载更多
	const loadMoreData = () => {
		if (!hasMore.value || loading.value) return
		currentPage.value++
		fetchOrders(currentPage.value)
	}

	// 页面跳转
	const goToOrderDetail = (orderId) => {
		uni.navigateTo({
			url: `/pages/order/detail?orderId=${orderId}`
		})
	}
	const contactBuyer = (orderId) => {
		uni.showToast({
			title: '已发送消息给买家',
			icon: 'success'
		})
	}
	const confirmShipment = (orderId) => {
		uni.showModal({
			title: '确认发货',
			content: '确定要发货吗？',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '已确认发货',
						icon: 'success'
					})
					const order = orders.value.find(o => o.orderId === orderId)
					if (order) order.status = 'shipped'
				}
			}
		})
	}
	const viewLogistics = (orderId) => {
		uni.navigateTo({
			url: `/pages/order/logistics?orderId=${orderId}`
		})
	}
	const completeOrder = (orderId) => {
		uni.showModal({
			title: '完成订单',
			content: '确定订单已完成吗？',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '订单已完成',
						icon: 'success'
					})
					const order = orders.value.find(o => o.orderId === orderId)
					if (order) order.status = 'completed'
				}
			}
		})
	}
	const deleteOrder = (orderId) => {
		uni.showModal({
			title: '删除订单',
			content: '确定要删除该订单吗？',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '已删除订单',
						icon: 'success'
					})
					const index = orders.value.findIndex(o => o.orderId === orderId)
					if (index > -1) orders.value.splice(index, 1)
				}
			}
		})
	}

	// 页面加载
	onMounted(() => {
		fetchOrders()
	})
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 60px;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}


	.order-status-tabs {
		display: flex;
		overflow-x: auto;
		white-space: nowrap;
		background-color: #fff;
		padding: 10px 15px;
		margin-bottom: 10px;
		border-bottom: 1px solid #eee;
	}

	.status-tab {
		padding: 6px 14px;
		margin-right: 10px;
		background-color: #f0f0f0;
		border-radius: 20px;
		font-size: 14px;
		color: #666;
		border-bottom: 2px solid transparent;
	}

	.status-tab.active {
		background-color: #007aff;
		color: #FFF;
		font-weight: bold;
	}

	.order-list {
		height: 100vh;
	}

	.order-card {
		background-color: #fff;
		border-radius: 12px;
		margin: 10rpx 15px 30px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		position: relative;
		min-height: 210px;
	}

	.store-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 15px;
		border-bottom: 1px solid #eee;
		background-color: #f9f9f9;
	}

	.store-name {
		font-weight: 500;
		color: #333;
		font-size: 15px;
	}

	.order-status {
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 500;
	}

	.status-pending {
		background-color: #fff3cd;
		color: #856404;
	}

	.status-shipped {
		background-color: #d1ecf1;
		color: #0c5460;
	}

	.status-completed {
		background-color: #d4edda;
		color: #155724;
	}

	.status-cancelled {
		background-color: #f8d7da;
		color: #721c24;
	}

	/* 商品信息 */
	.product-info {
		display: flex;
		padding: 12px 15px;

		padding-bottom: 30px;
		/* 增加底部内边距，为按钮留出空间 */
	}

	.product-image {
		width: 80px;
		height: 80px;
		border-radius: 8px;
		margin-right: 12px;
		background-color: #f0f0f0;
	}

	.product-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.product-title {
		font-size: 15px;
		color: #333;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.product-attributes {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 6px;
	}

	.attribute {
		padding: 2px 6px;
		background-color: #f0f0f0;
		border-radius: 4px;
		font-size: 12px;
		color: #666;
	}

	.quantity-price {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		align-items: center;

		.number {
			font-size: 28rpx;
			color: #666;
		}

		.price {
			color: #F53F3F;
			font-size: 30rpx;
		}
	}

	/* 操作按钮容器 */
	.action-buttons {
		position: absolute;
		bottom: 20rpx;
		/* 距离卡片底部 12px */
		right: 15px;
		display: flex;
		gap: 8px;
		z-index: 10;
		flex-wrap: nowrap;
	}

	.btn {
		padding: 6px 8px;
		border: none;
		border-radius: 6px;
		font-size: 13px;
		line-height: 1;
		min-width: auto;
		max-width: 70px;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 0 1 auto;
	}

	.btn-view {
		background-color: #e9ecef;
		color: #495057;
	}

	.btn-confirm {
		background-color: #007aff;
		color: #fff;
	}

	.btn-complete {
		background-color: #28a745;
		color: #fff;
	}

	.btn-contact {
		background-color: #ffc107;
		color: #212529;
	}

	.btn-delete {
		background-color: #6c757d;
		color: #fff;
	}

	.load-more,
	.no-more,
	.no-data {
		text-align: center;
		padding: 15px;
		color: #666;
		font-size: 14px;
	}

	.load-more {
		background-color: #fff;
		margin: 0 15px 15px;
		border-radius: 12px;
	}

	.no-more,
	.no-data {
		color: #999;
		font-style: italic;
	}
</style>