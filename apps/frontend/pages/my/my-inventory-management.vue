<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		getInventoriesApi,
		editInventoryApi,
		delInventoryApi
	} from '@/apis/inventory.js'

	const categoryList = ref([{
		id: 0,
		name: '全部商品'
	}, {
		id: 1,
		name: '电子产品'
	}, {
		id: 2,
		name: '服装鞋帽'
	}, {
		id: 3,
		name: '家居用品'
	}, {
		id: 4,
		name: '食品饮料'
	}, {
		id: 5,
		name: '美妆个护'
	}, {
		id: 6,
		name: '办公用品'
	}])
	const categoryId = ref(categoryList.value[0].id)

	const statusList = ref([{
		name: "全部",
		color: "#E7EEFF",
		fontColor: "#165DFF",
		borderColor: "#BDD2FF"
	}, {
		name: "正常",
		color: "#E5F7E9",
		fontColor: "#86DB99",
		borderColor: "#C8E6C9"
	}, {
		name: "低库存",
		color: "#FFF2E5",
		fontColor: "#FF7D00",
		borderColor: "#FFDBB8"
	}, {
		name: "缺货",
		color: "#FEEBEB",
		fontColor: "#F53F3F",
		borderColor: "#FDC9C9"
	}])

	const statusId = ref(0)

	// 上下架状态
	const onlineStatusList = ref([{
			value: -1,
			name: "全部状态"
		},
		{
			value: 1,
			name: "已上架"
		},
		{
			value: 0,
			name: "已下架"
		}
	])
	const onlineStatus = ref(-1) // 默认显示全部

	//库存排序参数
	const orderIndex = ref(2)
	const orderList = ref(['库存升序', '库存降序', '最新添加', '销量降序', '销量升序'])

	// 库存列表
	const storeList = ref([])

	// 根据库存数量计算状态和tab样式
	const calculateInventoryStatus = (item) => {
		const available = item.available || 0;
		const total = item.total || 0;

		let status, tab;

		if (available === 0) {
			status = 'danger'; // 缺货
			tab = {
				text: "缺货",
				color: "#FEEBEB",
				fontColor: "#F53F3F"
			};
		} else if (available <= 10) { // 假设低库存阈值为10
			status = 'warning'; // 低库存
			tab = {
				text: "低库存",
				color: "#FFF2E5",
				fontColor: "#FF7D00"
			};
		} else {
			status = 'normal'; // 正常
			tab = {
				text: "正常",
				color: "#E5F7E9",
				fontColor: "#86DB99"
			};
		}

		return {
			status,
			tab
		};
	}

	// 映射后端数据到前端格式
	const mapApiDataToFrontend = (apiData) => {
		return apiData.map(item => {
			const {
				status,
				tab
			} = calculateInventoryStatus(item);

			return {
				_id: item._id,
				name: item.name,
				sku: item.sku || '',
				store: item.available || 0,
				total: item.total || 0,
				available: item.available || 0,
				ordered: item.ordered || 0,
				image: item.image,
				status: status,
				onlineStatus: item.status,
				categoryId: 4,
				tab: tab,
				date: item.updatedAt ? item.updatedAt.split('T')[0] : '2025-11-20',
				price: item.price || 0,
				description: item.description || '',
				salesAmount: (item.price || 0) * (item.ordered || 0)
			};
		});
	}

	// 计算属性：筛选后的商品列表
	const filteredStoreList = computed(() => {
		let list = [...storeList.value];

		if (categoryId.value !== 0) {
			list = list.filter(item => item.categoryId === categoryId.value);
		}

		if (statusId.value !== 0) {
			const statusMap = {
				1: 'normal',
				2: 'warning',
				3: 'danger'
			};
			list = list.filter(item => item.status === statusMap[statusId.value]);
		}

		if (onlineStatus.value !== -1) {
			list = list.filter(item => item.onlineStatus === onlineStatus.value);
		}

		switch (orderIndex.value) {
			case 0:
				list.sort((a, b) => a.available - b.available);
				break;
			case 1:
				list.sort((a, b) => b.available - a.available);
				break;
			case 2:
				list.sort((a, b) => new Date(b.date) - new Date(a.date));
				break;
			case 3:
				list.sort((a, b) => b.ordered - a.ordered);
				break;
			case 4:
				list.sort((a, b) => a.ordered - b.ordered);
				break;
		}

		return list;
	})



	//获取库存数据
	const getInventory = async () => {
		try {
			const res = await getInventoriesApi()
			if (res.errno === 0) {
				storeList.value = mapApiDataToFrontend(res.data)
			}
		} catch (e) {
			uni.showToast({
				title: "获取库存数据失败",
				icon: 'none'
			})
		}
	}

	//初始化数据
	onMounted(() => {
		getInventory()
	})

	//切换商品类别
	const handleCategory = (item) => {
		categoryId.value = item.id
	}

	//切换库存状态
	const handleStatus = (index) => {
		statusId.value = index
	}

	//切换上下架状态
	const handleOnlineStatus = (value) => {
		onlineStatus.value = value
	}

	//选择顺序
	function bindPickerChange(e) {
		orderIndex.value = e.detail.value
	}

	//预览
	const handlePreView = (url) => {
		uni.previewImage({
			urls: [url],
			current: 0
		})
	}

	//删除库存
	const handleDetele = (index) => {
		const actualIndex = storeList.value.findIndex(item => item._id === filteredStoreList.value[index]._id);
		uni.showModal({
			title: '删除商品库存',
			content: '确定要删除此商品库存吗？删除后无法恢复',
			confirmText: '删除',
			confirmColor: '#F53F3F',
			success: async (res) => {
				if (res.confirm) {
					try {
						//调用删除API
						const res = await delInventoryApi(storeList.value[actualIndex]._id)
						if (res.errno == 0) {
							storeList.value.splice(actualIndex, 1)
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
						} else
							uni.showToast({
								title: '删除失败',
								icon: 'error'
							})
					} catch (e) {
						uni.showToast({
							title: "删除异常",
							icon: "error"
						})
					}
				}
			}
		})
	}

	//编辑
	const handleEdit = (item) => {
		// 这里可以跳转到编辑页面
		uni.navigateTo({
			url: `/pages/my/my-add-item?id=${item._id}`
		})
	}

	//新增
	const handleAdd = () => {
		uni.navigateTo({
			url: '/pages/my/my-add-item'
		})
	}

	// 切换上下架状态
	const toggleOnlineStatus = (index) => {
		const actualIndex = storeList.value.findIndex(item => item._id === filteredStoreList.value[index]._id);
		const item = storeList.value[actualIndex];
		const newStatus = item.onlineStatus === 1 ? 0 : 1;

		uni.showModal({
			title: newStatus === 1 ? '上架商品' : '下架商品',
			content: newStatus === 1 ? '确定要上架此商品吗？' : '确定要下架此商品吗？下架后用户将不可见',
			success: async (res) => {
				if (res.confirm) {
					//调用API
					try {
						const res = await editInventoryApi(item._id, {
							status: newStatus
						})
						if (res.errno == 0) {
							item.onlineStatus = newStatus;
							uni.showToast({
								title: newStatus === 1 ? '上架成功' : '下架成功',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: '异常操作'
							})
						}
					} catch (e) {
						uni.showToast({
							title: '操作失败'
						})
					}
				

				}
			}
		})
	}
</script>

<template>
	<view class="container">
		<!-- 头部栏 -->
		<uni-nav-bar @clickRight="handleAdd" status-bar left-icon="left" title="库存管理" @clickLeft="uni.navigateBack()"
			:fixed="true">
			<template #right>
				<uni-icons class="plus" type="plusempty" size="20"></uni-icons>
			</template>
		</uni-nav-bar>

		<!-- 商品分类 -->
		<view class="category">
			<view class="title">
				<view class="left">商品分类</view>
			</view>

			<scroll-view class="main" scroll-x="true" :show-scrollbar="false" enhanced>
				<view class="scroll">
					<view class="item" v-for="(item,index) in categoryList" :key="index" @tap="handleCategory(item)"
						:class="{active:categoryId == item.id}">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 库存状态 -->
		<view class="status">
			<view class="title">
				<view class="left">库存状态</view>
			</view>
			<view class="main">
				<view class="item" :class="{active:index == statusId}"
					:style="{border:'1rpx solid'+item.borderColor,color:item.fontColor,backgroundColor:item.color}"
					v-for="(item,index) in statusList" :key="index" @tap="handleStatus(index)">{{item.name}}</view>
			</view>
		</view>

		<!-- 上下架状态 -->
		<view class="online-status">
			<view class="title">
				<view class="left">商品状态</view>
			</view>
			<view class="main">
				<view class="item" v-for="(item,index) in onlineStatusList" :key="index"
					:class="{active:onlineStatus == item.value}" @tap="handleOnlineStatus(item.value)">
					{{item.name}}
				</view>
			</view>
		</view>
		<!-- 库存列表 -->
		<view class="list">
			<view class="title">
				<view class="left">库存列表 ({{filteredStoreList.length}})</view>
				<view class="right">
					<picker @change="bindPickerChange" :value="orderIndex" :range="orderList">
						<text class="label">排序：</text>{{orderList[orderIndex]}}
					</picker>
				</view>
			</view>
			<view class="main">
				<view v-if="filteredStoreList.length>0" class="item" v-for="(item,index) in filteredStoreList"
					:key="item._id">
					<view class="body">
						<view class="left-content">
							<image :src="item.image" mode="aspectFill" class="product-image"></image>
							<view class="product-info">
								<!-- 商品名称和状态 -->
								<view class="row name-status-row">
									<text class="product-name">{{item.name}}</text>
									<view class="status-badges">
										<view class="online-badge"
											:class="item.onlineStatus == 1 ? 'online' : 'offline'">
											{{item.onlineStatus == 1 ? '已上架' : '已下架'}}
										</view>
										<view class="inventory-badge" :style="{
												color: item.tab.fontColor,
												backgroundColor: item.tab.color
											}">
											{{item.tab.text}}
										</view>
									</view>
								</view>

								<!-- SKU信息 -->
								<view class="row sku-row">
									<text class="sku-text">{{item.sku ? 'SKU:' + item.sku : '无SKU'}}</text>
								</view>

								<!-- 价格和库存 -->
								<view class="row price-inventory-row">
									<text class="price-text">¥{{item.price}}</text>
									<text class="inventory-text">
										库存：<text class="inventory-number">{{item.available}}
											<text style="color:black">/ </text>
											<text style="color:black;font-size:30rpx"> {{item.total}}</text>
										</text>
									</text>
								</view>

								<!-- 销售信息 -->
								<view class="row sales-row">
									<text class="sales-text">已卖：{{item.ordered}}</text>
									<text class="sales-amount-text"><text
											style="font-weight: 400;color:#666;">已赚：</text>¥ {{item.salesAmount}}</text>
								</view>
							</view>
						</view>
					</view>
					<!-- 操作按钮 - -->
					<view class="action-buttons">
						<view class="btn-group">
							<view class="btn-item" @tap="handlePreView(item.image)">
								<uni-icons type="eye" size="18" color="#666"></uni-icons>
								<text class="btn-text">查看</text>
							</view>
							<view class="btn-item" @tap="handleEdit(item)">
								<uni-icons type="compose" size="18" color="#165DFF"></uni-icons>
								<text class="btn-text">编辑</text>
							</view>
							<view class="btn-item" @tap="toggleOnlineStatus(index)">
								<uni-icons :type="item.onlineStatus === 1 ? 'eye-slash' : 'eye'" size="18"
									:color="item.onlineStatus === 1 ? '#FF7D00' : '#165DFF'">
								</uni-icons>
								<text class="btn-text">{{item.onlineStatus === 1 ? '下架' : '上架'}}</text>
							</view>
							<view class="btn-item delete" @tap="handleDetele(index)">
								<uni-icons type="trash" size="18" color="#F53F3F"></uni-icons>
								<text class="btn-text">删除</text>
							</view>
						</view>
					</view>
					<!-- 底部信息 -->
					<view class="footer">
						<text class="update-time">更新于：{{item.date}}</text>
						<text class="product-id">ID：{{item._id ? item._id.substring(0, 8) + '...' : ''}}</text>
					</view>
				</view>

				<view class="empty" v-else>
					<uni-icons type="info" size="48" color="#999"></uni-icons>
					<text>暂无商品数据</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.plus {
		width: 55rpx;
		height: 55rpx;
		border-radius: 8rpx;
		border: 1rpx solid #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container {
		width: 100vw;
		background-color: #F7F7F7;
		padding-bottom: 40rpx;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.left {
			font-size: 26rpx;
			font-weight: 500;
			color: #1a1a1a;
		}
	}

	.main {
		margin-top: 28rpx;
	}

	/* 分类、状态、上下架状态样式保持不变 */
	.category,
	.status,
	.online-status {
		margin-top: 3rpx;
		background-color: #FFF;
		height: 180rpx;
		padding: 24rpx;
	}

	.category .main .scroll {
		display: flex;
		gap: 16rpx;
	}

	.category .main .scroll .item {
		flex-shrink: 0;
		font-size: 22rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 130rpx;
		height: 55rpx;
		background-color: #F3F4F6;
		border-radius: 20rpx;
	}

	.category .main .scroll .active {
		background-color: #165DFF !important;
		color: #FFF;
	}

	.status .main,
	.online-status .main {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.status .main .item,
	.online-status .main .item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		width: 160rpx;
		height: 64rpx;
		border-radius: 10rpx;
		background-color: #F3F4F6;
		color: #666;
	}

	.status .main .active,
	.online-status .main .active {
		background-color: #165DFF;
		color: #FFF;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	}


	.common {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 200rpx;
		height: 120rpx;
		border-radius: 15rpx;
	}

	.common .value {
		font-weight: 600;
		font-size: 32rpx;
		text-align: center;
	}

	.goods {
		background-color: #EFF6FF;
	}

	.goods .label {
		color: #3B82F6;
	}

	.goods .value {
		color: #2563EB;
	}

	.stores {
		background-color: #F0FDF4;
	}

	.stores .label {
		color: #22C55E;
	}

	.stores .value {
		color: #16A34A;
	}

	.warning {
		background-color: #FFF7ED;
	}

	.warning .label {
		color: #F97316;
	}

	.warning .value {
		color: #EA580C;
	}

	.total-sales {
		background-color: #EFF6FF;
	}

	.total-sales .label {
		color: #3B82F6;
	}

	.total-sales .value {
		color: #2563EB;
	}

	.sales-amount {
		background-color: #F0FDF4;
	}

	.sales-amount .label {
		color: #22C55E;
	}

	.sales-amount .value {
		color: #16A34A;
	}

	.avg-price {
		background-color: #FFF7ED;
	}

	.avg-price .label {
		color: #F97316;
	}

	.avg-price .value {
		color: #EA580C;
	}

	/* 库存列表样式 - 重新设计 */
	.list {
		padding: 24rpx;
	}

	.list .title .right {
		font-size: 24rpx;
		color: #666;
	}

	.list .title .right .label {
		color: #999;
	}

	.list .main {
		.item {
			background-color: #FFF;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
			overflow: hidden;

			.body {
				padding: 30rpx;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;

				.left-content {
					display: flex;
					flex: 1;
					gap: 20rpx;

					.product-image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 12rpx;
						background-color: #f8f9fa;
						flex-shrink: 0;
					}

					.product-info {
						flex: 1;
						display: flex;
						flex-direction: column;
						gap: 16rpx;
						min-height: 160rpx;
						justify-content: space-between;

						.row {
							display: flex;
							align-items: center;
							justify-content: space-between;
						}

						.name-status-row {
							.product-name {
								font-size: 28rpx;
								font-weight: 600;
								color: #1a1a1a;
								flex: 1;
							}

							.status-badges {
								display: flex;
								gap: 10rpx;
								margin-left: 20rpx;

								.online-badge {
									font-size: 20rpx;
									padding: 4rpx 12rpx;
									border-radius: 6rpx;

									&.online {
										background-color: #E8F5E8;
										color: #52C41A;
									}

									&.offline {
										background-color: #F5F5F5;
										color: #999;
									}
								}

								.inventory-badge {
									font-size: 20rpx;
									padding: 4rpx 12rpx;
									border-radius: 6rpx;
									font-weight: 500;
								}
							}
						}

						.sku-row {
							.sku-text {
								font-size: 24rpx;
								color: #999;
							}
						}

						.price-inventory-row {
							.price-text {
								font-size: 26rpx;
								font-weight: 600;
								color: #FF6B35;
							}

							.inventory-text {
								font-size: 24rpx;
								color: #666;

								.inventory-number {
									font-weight: 600;
									color: #52C41A;
								}
							}
						}

						.sales-row {

							.sales-text,
							.sales-amount-text {
								font-size: 22rpx;
								color: #666;
							}

							.sales-amount-text {
								color: #165DFF;
								font-weight: 500;
							}
						}
					}
				}


			}

			.action-buttons {
				margin-left: 20rpx;
				flex-shrink: 0;

				.btn-group {
					display: flex;
					gap: 36rpx;
					justify-content: flex-end;

					.btn-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 6rpx;
						padding: 8rpx 16rpx;
						border-radius: 8rpx;
						transition: background-color 0.3s;

						&:active {
							background-color: #f5f5f5;
						}

						&.delete:active {
							background-color: #fee;
						}

						.btn-text {
							font-size: 20rpx;
							color: #666;
						}

						&.delete .btn-text {
							color: #F53F3F;
						}
					}
				}
			}

			.footer {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 30rpx;
				background-color: #fafafa;
				border-top: 1rpx solid #f0f0f0;

				.update-time,
				.product-id {
					font-size: 22rpx;
					color: #999;
				}

				.product-id {
					font-family: 'Courier New', monospace;
				}
			}
		}

		.empty {
			text-align: center;
			padding: 100rpx 0;
			color: #999;

			uni-icons {
				display: block;
				margin-bottom: 20rpx;
			}
		}
	}

	/* 响应式调整 */
	@media (max-width: 750rpx) {
		.list .main .item .body {
			flex-direction: column;

			.left-content {
				width: 100%;
			}

			.action-buttons {
				margin-left: 0;
				margin-top: 20rpx;
				width: 100%;

				.btn-group {
					flex-direction: row;
					justify-content: space-around;
				}
			}
		}
	}
</style>