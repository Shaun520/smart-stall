<template>
	<view class="container">
		<!-- 头部栏 -->
		<uni-nav-bar status-bar left-icon="left" title="我的海报" @clickLeft="goBack" :fixed="true" />

		<!-- 筛选和搜索区域 -->
		<view class="filter-section">
			<view class="search-box">
				<uni-icons type="search" size="18" color="#999"></uni-icons>
				<input v-model="searchKeyword" class="search-input" placeholder="搜索海报标题或描述..." @input="handleSearch" />
				<uni-icons v-if="searchKeyword" type="clear" size="18" color="#999" @click="clearSearch"></uni-icons>
			</view>

			<view class="filter-options">
				<view class="filter-item" :class="{ active: filterStyle === '' }" @click="filterByStyle('')">
					全部
				</view>
				<view class="filter-item" :class="{ active: filterStyle === 'simple' }"
					@click="filterByStyle('simple')">
					简约风
				</view>
				<view class="filter-item" :class="{ active: filterStyle === 'color' }" @click="filterByStyle('color')">
					鲜艳风
				</view>
				<view class="filter-item" :class="{ active: filterStyle === 'minimalist' }"
					@click="filterByStyle('minimalist')">
					极简风
				</view>
				<view class="filter-item" :class="{ active: filterStyle === 'retro' }" @click="filterByStyle('retro')">
					复古风
				</view>
			</view>
		</view>

		<!-- 海报列表 -->
		<scroll-view class="poster-list" scroll-y @scrolltolower="loadMore" :refresher-enabled="true"
			:refresher-triggered="refreshing" @refresherrefresh="onRefresh">
			<view class="list-content">
				<view class="poster-item" v-for="poster in filteredPosters" :key="poster._id"
					@click="viewPosterDetail(poster._id)">
					<view class="poster-image">
						<image :src="poster.image" mode="aspectFill" class="image" @error="handleImageError(poster)">
						</image>
						<view class="poster-style">{{ getStyleText(poster.style) }}</view>
					</view>

					<view class="poster-info">
						<view class="poster-title">{{ poster.title }}</view>
						<view class="poster-desc">{{ poster.description }}</view>

						<view class="poster-meta">
							<view class="meta-item">
								<uni-icons type="calendar" size="14" color="#999"></uni-icons>
								<text class="meta-text">{{ formatDate(poster.createdAt) }}</text>
							</view>
							<view class="meta-item">
								<uni-icons type="eye" size="14" color="#999"></uni-icons>
								<text class="meta-text">{{ poster.viewCount }}次查看</text>
							</view>
						</view>
					</view>

					<view class="action-buttons">
						<button class="btn-download" @click.stop="downloadPoster(poster)">
							<uni-icons type="download" size="16" color="#fff"></uni-icons>
							<text>下载</text>
						</button>
						<button class="btn-share" @click.stop="sharePoster(poster)">
							<uni-icons type="redo" size="16" color="#5A78EA"></uni-icons>
							<text>分享</text>
						</button>
					</view>
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-if="filteredPosters.length === 0">
					<image
						src="https://ts1.cn.mm.bing.net/th/id/R-C.4e4c9d7c5c7c9d7c5c7c9d7c5c7c9d7c?rik=6Q6Q6Q6Q6Q6Q6Q&pid=ImgRaw"
						class="empty-image" mode="aspectFit"></image>
					<text class="empty-text">暂无海报记录</text>
					<button class="empty-btn" @click="goGenerate">去生成海报</button>
				</view>

				<!-- 加载更多 -->
				<view class="load-more" v-if="hasMore && filteredPosters.length > 0">
					<text class="load-text">{{ loading ? '加载中...' : '上拉加载更多' }}</text>
				</view>

				<!-- 没有更多数据 -->
				<view class="no-more" v-if="!hasMore && filteredPosters.length > 0">
					<text class="no-more-text">没有更多数据了</text>
				</view>
			</view>
		</scroll-view>

		<!-- 生成新海报按钮 -->
		<view class="floating-btn" @click="goGenerate">
			<uni-icons type="plus" size="24" color="#fff"></uni-icons>
			<text>生成新海报</text>
		</view>
		
		<!-- 海报抽屉组件 -->
		<poster-drawer v-model:showDrawer="showDrawer" @generate="handleGeneratePoster" />
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {onShow} from '@dcloudio/uni-app'
	import {
		getPosterListApi
	} from '../../apis/poster'
	import { formatDate } from '../../utils/timeFormatted'
	
	//抽屉开关
	const showDrawer = ref(false)
	
	// 海报数据
	const posterList = ref([])

	// 搜索和筛选相关
	const searchKeyword = ref('')
	const filterStyle = ref('')
	const refreshing = ref(false)
	const loading = ref(false)
	const hasMore = ref(true)
	const currentPage = ref(1)
	const pageSize = 10
	
	
	const handleGeneratePoster = (posterUrl)=>{
		console.log(url)
	}

	// 计算属性：筛选后的海报列表
	const filteredPosters = computed(() => {
		let filtered = posterList.value

		// 按风格筛选
		if (filterStyle.value) {
			filtered = filtered.filter(poster => poster.style === filterStyle.value)
		}

		// 按关键词搜索
		if (searchKeyword.value) {
			const keyword = searchKeyword.value.toLowerCase()
			filtered = filtered.filter(poster =>
				poster.title.toLowerCase().includes(keyword) ||
				poster.description.toLowerCase().includes(keyword)
			)
		}

		return filtered
	})

	// 页面加载
	onMounted(() => {
		loadPosters()
	})
	
	onShow(()=>{
		loadPosters()
	})



	// 加载海报数据
	const loadPosters = async () => {
		if (loading.value) return

		loading.value = true
		try {
			// API调用
			const res = await getPosterListApi()
			posterList.value = res.data

			hasMore.value = posterList.value.length < 50 // 模拟数据限制
		} catch (error) {
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		} finally {
			loading.value = false
			refreshing.value = false
		}
	}

	// 下拉刷新
	const onRefresh = () => {
		refreshing.value = true
		currentPage.value = 1
		// posterList.value = [] // 清空当前数据
		loadPosters()
	}

	// 加载更多
	const loadMore = () => {
		if (!hasMore.value || loading.value) return
		currentPage.value++
		loadPosters()
	}

	// 搜索处理
	const handleSearch = () => {
		currentPage.value = 1
		// 这里可以添加防抖处理
	}

	// 清空搜索
	const clearSearch = () => {
		searchKeyword.value = ''
	}

	// 按风格筛选
	const filterByStyle = (style) => {
		filterStyle.value = style
	}

	// 获取风格文本
	const getStyleText = (style) => {
		const styleMap = {
			simple: '简约风',
			color: '鲜艳风',
			minimalist: '极简风',
			retro: '复古风'
		}
		return styleMap[style] || '未知风格'
	}

	
	// 图片加载失败处理
	const handleImageError = (poster) => {
		// 设置默认图片
		poster.image =
			'https://ts1.cn.mm.bing.net/th/id/R-C.4e4c9d7c5c7c9d7c5c7c9d7c5c7c9d7c?rik=6Q6Q6Q6Q6Q6Q6Q&pid=ImgRaw'
	}

	// 查看海报详情
	const viewPosterDetail = (id) => {
		uni.navigateTo({
			url: `/pages/function/my-poster-detail?id=${id}`
		})
	}

	const savePoster = (poster) => {
		const imageUrl = poster.image;
		// 显示加载提示
		uni.showLoading({
			title: '下载中...',
			mask: true
		});

		uni.downloadFile({
			url: imageUrl,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: () => {
							uni.showToast({
								title: '已保存到相册',
								icon: 'success'
							});
						},
						fail: (err) => {
							uni.showToast({
								title: '保存失败，请检查权限',
								icon: 'none'
							});
						}
					});
				} else {
					uni.showToast({
						title: `下载失败: ${res.statusCode}`,
						icon: 'none'
					});
				}
			},
			fail: (err) => {

				uni.showToast({
					title: '网络错误，下载失败',
					icon: 'none'
				});
			},
			complete: () => {
				uni.hideLoading();
			}
		});
	}

	// 下载海报
	const downloadPoster = async (poster) => {
		uni.showLoading({
			title: '下载中...'
		})
		try {

			await savePoster(poster)


			// 更新查看次数
			poster.viewCount++

		} catch (error) {
			uni.showToast({
				title: '下载失败',
				icon: 'none'
			})
		}
	}

	// 分享海报
	const sharePoster = (poster) => {
		uni.share({
			provider: 'weixin',
			scene: 'WXSceneSession',
			type: 0,
			title: poster.title,
			summary: poster.description,
			imageUrl: poster.image,
			href: 'https://example.com/poster/' + poster.id,
			success: function(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail: function(err) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		})
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 打开生成海报抽屉
	const goGenerate = () => {
		showDrawer.value = true
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f7f7f7;
		min-height: 100vh;
	}

	.filter-section {
		background: #fff;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.search-box {
		display: flex;
		align-items: center;
		background: #f5f5f5;
		border-radius: 20rpx;
		padding: 16rpx 24rpx;
		margin-bottom: 20rpx;

		.search-input {
			flex: 1;
			margin: 0 20rpx;
			font-size: 28rpx;
		}
	}

	.filter-options {
		display: flex;
		gap: 20rpx;
		overflow-x: auto;

		.filter-item {
			padding: 12rpx 24rpx;
			background: #f5f5f5;
			border-radius: 20rpx;
			font-size: 24rpx;
			color: #666;
			white-space: nowrap;
			transition: all 0.3s;

			&.active {
				background: #5A78EA;
				color: #fff;
			}
		}
	}

	.poster-list {
		height: calc(100vh - 200rpx);
	}

	.list-content {
		padding: 20rpx;
	}

	.poster-item {
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	.poster-image {
		position: relative;
		height: 300rpx;

		.image {
			width: 100%;
			height: 100%;
		}

		.poster-style {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			background: rgba(90, 120, 234, 0.9);
			color: #fff;
			padding: 8rpx 16rpx;
			border-radius: 12rpx;
			font-size: 20rpx;
		}
	}

	.poster-info {
		padding: 24rpx;

		.poster-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 12rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.poster-desc {
			font-size: 26rpx;
			color: #666;
			line-height: 1.5;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			margin-bottom: 20rpx;
		}

		.poster-meta {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.meta-item {
				display: flex;
				align-items: center;
				gap: 8rpx;

				.meta-text {
					font-size: 22rpx;
					color: #999;
				}
			}
		}
	}

	.action-buttons {
		display: flex;
		padding: 0 24rpx 24rpx;
		gap: 20rpx;

		button {
			flex: 1;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 8rpx;
			font-size: 26rpx;
			border-radius: 12rpx;
			border: none;

			&.btn-download {
				background: #5A78EA;
				color: #fff;
			}

			&.btn-share {
				background: #f0f4ff;
				color: #5A78EA;
				border: 1rpx solid #5A78EA;
			}
		}
	}

	.empty-state {
		text-align: center;
		padding: 100rpx 0;

		.empty-image {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 30rpx;
		}

		.empty-text {
			display: block;
			font-size: 28rpx;
			color: #999;
			margin-bottom: 40rpx;
		}

		.empty-btn {
			background: #5A78EA;
			color: #fff;
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 35rpx;
			font-size: 26rpx;
		}
	}

	.load-more,
	.no-more {
		text-align: center;
		padding: 30rpx;

		.load-text,
		.no-more-text {
			font-size: 24rpx;
			color: #999;
		}
	}

	.floating-btn {
		position: fixed;
		bottom: 40rpx;
		right: 40rpx;
		background: #5A78EA;
		color: #fff;
		padding: 20rpx 30rpx;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		gap: 10rpx;
		font-size: 26rpx;
		box-shadow: 0 4rpx 20rpx rgba(90, 120, 234, 0.3);
		z-index: 1000;
	}
</style>