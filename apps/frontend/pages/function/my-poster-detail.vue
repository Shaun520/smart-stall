<template>
	<view class="container">
		<!-- 头部栏 -->
		<uni-nav-bar
			shadow
			status-bar
			left-icon="left"
			:title="posterDetail.title || '标题'"
			@clickLeft="goBack"
			:fixed="true"
		>
			<template #right>
				<view class="nav-right">
					<uni-icons 
						type="more-filled" 
						size="20" 
						@click="showActionSheet"
					></uni-icons>
				</view>
			</template>
		</uni-nav-bar>
		
		<scroll-view class="content" scroll-y>
			<!-- 海报预览区域 -->
			<view class="preview-section">
				<view class="poster-image">
					<image 
						:src="posterDetail.image || 'https://ts1.cn.mm.bing.net/th/id/R-C.4e4c9d7c5c7c9d7c5c7c9d7c5c7c9d7c?rik=6Q6Q6Q6Q6Q6Q6Q&pid=ImgRaw'" 
						mode="widthFix"
						class="image"
						@load="onImageLoad"
						@error="onImageError"
					></image>
					<view class="image-actions">
						<view class="action-btn" @click="previewImage">
							<uni-icons type="eye" size="18" color="#fff"></uni-icons>
							<text>预览</text>
						</view>
						<view class="action-btn" @click="saveToAlbum">
							<uni-icons type="download" size="18" color="#fff"></uni-icons>
							<text>保存</text>
						</view>
					</view>
				</view>
				
				<!-- 海报信息 -->
				<view class="poster-info">
					<view class="info-header">
						<text class="title">{{ posterDetail.title }}</text>
						<view class="style-tag">{{ getStyleText(posterDetail.style) }}</view>
					</view>
					
					<view class="description">
						{{ posterDetail.description }}
					</view>
					
					<view class="meta-info">
						<view class="meta-item">
							<uni-icons type="calendar" size="16" color="#999"></uni-icons>
							<text class="meta-text">生成时间：{{ formatTime(posterDetail.createdAt) }}</text>
						</view>
						<view class="meta-item">
							<uni-icons type="eye" size="16" color="#999"></uni-icons>
							<text class="meta-text">查看次数：{{ posterDetail.viewCount || 0 }}</text>
						</view>
						<view class="meta-item">
							<uni-icons type="download" size="16" color="#999"></uni-icons>
							<text class="meta-text">下载次数：{{ posterDetail.downloadCount || 0 }}</text>
						</view>
						<view class="meta-item">
							<uni-icons type="star" size="16" color="#999"></uni-icons>
							<text class="meta-text">尺寸：{{ posterDetail.size || '1080X1980' }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 操作按钮区域 -->
			<view class="action-section">
				<view class="action-buttons">
					<button class="btn-primary" @click="downloadPoster">
						<uni-icons type="download" size="18" color="#fff"></uni-icons>
						<text>下载海报</text>
					</button>
					<button class="btn-secondary" @click="sharePoster">
						<uni-icons type="redo" size="18" color="#5A78EA"></uni-icons>
						<text>分享海报</text>
					</button>
					<button class="btn-outline" @click="editPoster">
						<uni-icons type="compose" size="18" color="#5A78EA"></uni-icons>
						<text>重新编辑</text>
					</button>
				</view>
			</view>
			
			<!-- 相关推荐 -->
			<view class="recommend-section" v-if="recommendList.length > 0">
				<view class="section-title">
					<text>相关推荐</text>
				</view>
				<scroll-view class="recommend-list" scroll-x>
					<view 
						class="recommend-item" 
						v-for="item in recommendList" 
						:key="item.id"
						@click="goToDetail(item.id)"
					>
						<image :src="item.image" mode="aspectFill" class="recommend-image"></image>
						<text class="recommend-title">{{ item.title }}</text>
					</view>
				</scroll-view>
			</view>
			
			<!-- 生成记录 -->
			<view class="history-section">
				<view class="section-title">
					<text>生成记录</text>
				</view>
				<view class="history-list">
					<view class="history-item" v-for="record in generateHistory" :key="record.id">
						<view class="history-left">
							<uni-icons type="checkmark" size="16" color="#52c41a"></uni-icons>
							<text class="history-text">{{ record.action }}</text>
						</view>
						<text class="history-time">{{ formatTime(record.time) }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<button class="btn-generate" @click="generateSimilar">
				<uni-icons type="plus" size="18" color="#fff"></uni-icons>
				<text>生成类似海报</text>
			</button>
		</view>
		
		<!-- 底部操作菜单 -->
		<view v-if="showMenu" class="action-menu-mask" @click="closeActionSheet">
			<view class="action-menu-content" @click.stop>
				<view class="menu-item" @click="setAsCover">
					<uni-icons type="star" size="20" color="#666"></uni-icons>
					<text>设为封面</text>
				</view>
				<view class="menu-item" @click="reportPoster">
					<uni-icons type="flag" size="20" color="#666"></uni-icons>
					<text>举报问题</text>
				</view>
				<view class="menu-item delete" @click="deletePoster">
					<uni-icons type="trash" size="20" color="#ff4d4f"></uni-icons>
					<text>删除海报</text>
				</view>
				<view class="menu-cancel" @click="closeActionSheet">
					<text>取消</text>
				</view>
			</view>
		</view>
		
		<!-- 加载状态 -->
		<view class="loading-mask" v-if="loading">
			<view class="loading-content">
				<uni-icons type="spinner-cycle" size="32" color="#5A78EA" class="loading-icon"></uni-icons>
				<text>加载中...</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getPosterDetailsApi,deletePosterApi } from '../../apis/poster'

const posterId = ref('')
const loading = ref(false)
const showMenu = ref(false)

// 海报详情数据
const posterDetail = ref({})

// 相关推荐列表
const recommendList = ref([
	{
		id: 2,
		title: '春季水果促销',
		image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.OmDCf7gELtE66K_JJudpqQHaHO?w=183&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1'
	},
	{
		id: 3,
		title: '水果礼盒定制',
		image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.aB3O5r26rtypjG9BcC6IFwHaHO?w=166&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1'
	},
	{
		id: 4,
		title: '有机水果专卖',
		image: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.V5RPv5tIcEFtWY0jv3NY8gHaLG?w=115&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=2&pid=1.7&rm=3&ucfimg=1'
	}
])

// 生成记录
const generateHistory = ref([
	{ id: 1, action: '海报生成成功', time: '2024-01-15 14:30:25' },
	{ id: 2, action: '海报下载', time: '2024-01-15 15:20:10' },
	{ id: 3, action: '海报分享', time: '2024-01-16 09:15:30' }
])

onLoad((options) => {
	posterId.value = options.id || '1'
	loadPosterDetail()
})

// 加载海报详情
const loadPosterDetail = async () => {
	loading.value = true
	try {
		// API调用
		const res = await getPosterDetailsApi(posterId.value)
		posterDetail.value = res.data		
	} catch (error) {
		uni.showToast({
			title: '加载失败',
			icon: 'none'
		})
	} finally {
		loading.value = false
	}
}

// 图片加载完成
const onImageLoad = () => {
}

// 图片加载失败
const onImageError = () => {
	posterDetail.value.image = 'https://ts1.cn.mm.bing.net/th/id/R-C.4e4c9d7c5c7c9d7c5c7c9d7c5c7c9d7c?rik=6Q6Q6Q6Q6Q6Q6Q&pid=ImgRaw'
	uni.showToast({
		title: '图片加载失败',
		icon: 'none'
	})
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

// 格式化时间
const formatTime = (timeString) => {
	const date = new Date(timeString)
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	
	if (diff < 60000) { // 1分钟内
		return '刚刚'
	} else if (diff < 3600000) { // 1小时内
		return Math.floor(diff / 60000) + '分钟前'
	} else if (diff < 86400000) { // 1天内
		return Math.floor(diff / 3600000) + '小时前'
	} else {
		return date.toLocaleDateString().replace(/\//g, '-') + ' ' + 
			   date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
	}
}

// 预览图片
const previewImage = () => {
	uni.previewImage({
		urls: [posterDetail.value.image],
		current: 0
	})
}

const savePoster = ()=>{
	  const imageUrl = posterDetail.value.image;
	     // #ifdef H5
	     // H5环境：直接创建a标签下载
	     const link = document.createElement('a');
	     link.href = imageUrl;
	     link.download = 'poster.jpg';
	     document.body.appendChild(link);
	     link.click();
	     document.body.removeChild(link);
	     uni.showToast({ title: '下载已开始', icon: 'success' });
	     // #endif
	     
	     // #ifdef APP-PLUS
	     // APP环境：使用uni API下载
	     uni.downloadFile({
	         url: imageUrl,
	         success: (res) => {
	             if (res.statusCode === 200) {
	                 uni.saveImageToPhotosAlbum({
	                     filePath: res.tempFilePath,
	                     success: () => {
	                         uni.showToast({ title: '已保存到相册', icon: 'success' });
	                     },
	                     fail: () => {
	                         uni.showToast({ title: '下载失败', icon: 'none' });
	                     }
	                 });
	             }
	         },
	         fail: () => {
	             uni.showToast({ title: '下载失败', icon: 'none' });
	         }
	     });
	     // #endif
}

// 保存到相册
const saveToAlbum = () => {
	uni.showLoading({ title: '保存中...' })
	savePoster()
}

// 下载海报
const downloadPoster = () => {
	saveToAlbum() // 复用保存到相册的功能
}

// 分享海报
const sharePoster = () => {
	uni.share({
		provider: 'weixin',
		scene: 'WXSceneSession',
		type: 0,
		title: posterDetail.value.title,
		summary: posterDetail.value.description,
		imageUrl: posterDetail.value.image,
		href: `https://example.com/poster/${posterDetail.value.id}`,
		success: () => {
			uni.showToast({ title: '分享成功' })
		},
		fail: (err) => {
			uni.showToast({ title: '分享失败', icon: 'none' })
		}
	})
}

// 编辑海报
const editPoster = () => {
	uni.navigateTo({
		url: `/pages/function/poster-edit?id=${posterId.value}`
	})
}

// 生成类似海报
const generateSimilar = () => {
	uni.navigateTo({
		url: `/pages/function/poster-generate?id=${posterId.value}`
	})
}

// 显示操作菜单
const showActionSheet = () => {
	showMenu.value = true
}

// 关闭操作菜单
const closeActionSheet = () => {
	showMenu.value = false
}

// 设为封面
const setAsCover = () => {
	closeActionSheet()
	uni.showToast({
		title: '已设为封面',
		icon: 'success'
	})
}

// 举报问题
const reportPoster = () => {
	closeActionSheet()
	uni.navigateTo({
		url: '/pages/poster/report?id=' + posterDetail.value.id
	})
}

// 删除海报
const deletePoster = () => {
	closeActionSheet()
	
	uni.showModal({
		title: '确认删除',
		content: '确定要删除这张海报吗？删除后无法恢复',
		success:async (res) => {
			if (res.confirm) {
				try{
					// 调用删除API
					const res = await deletePosterApi(posterId.value)
					if(res.errno == 0){
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					}else{
						uni.showToast({
							title:'删除失败'
						})
					}
				}catch(err){
					uni.showToast({
						title:'删除异常'
					})
				}
			}
		}
	})
}

// 跳转到详情页
const goToDetail = (id) => {
	uni.redirectTo({
		url: `/pages/poster/detail?id=${id}`
	})
}

// 返回上一页
const goBack = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f7f7f7;
	min-height: 100vh;
	position: relative;
}

.nav-right {
	padding: 10rpx;
}

.content {
	height: calc(100vh - 100rpx);
}

.preview-section {
	background: #fff;
	margin-bottom: 20rpx;
}

.poster-image {
	position: relative;
	
	.image {
		width: 100%;
		display: block;
	}
	
	.image-actions {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		display: flex;
		gap: 20rpx;
		
		.action-btn {
			display: flex;
			align-items: center;
			gap: 8rpx;
			background: rgba(0, 0, 0, 0.6);
			color: #fff;
			padding: 12rpx 20rpx;
			border-radius: 20rpx;
			font-size: 24rpx;
			
			&:active {
				background: rgba(0, 0, 0, 0.8);
			}
		}
	}
}

.poster-info {
	padding: 30rpx;
	
	.info-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20rpx;
		
		.title {
			font-size: 36rpx;
			font-weight: 600;
			color: #333;
			flex: 1;
			margin-right: 20rpx;
		}
		
		.style-tag {
			background: #5A78EA;
			color: #fff;
			padding: 8rpx 16rpx;
			border-radius: 12rpx;
			font-size: 22rpx;
		}
	}
	
	.description {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 30rpx;
	}
	
	.meta-info {
		.meta-item {
			display: flex;
			align-items: center;
			gap: 12rpx;
			margin-bottom: 12rpx;
			
			.meta-text {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}

.action-section {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
	
	.action-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20rpx;
		
		button {
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10rpx;
			font-size: 28rpx;
			border-radius: 12rpx;
			border: none;
			
			&.btn-primary {
				background: #5A78EA;
				color: #fff;
				grid-column: 1 / 3;
			}
			
			&.btn-secondary {
				background: #f0f4ff;
				color: #5A78EA;
			}
			
			&.btn-outline {
				background: #fff;
				color: #5A78EA;
				border: 1rpx solid #5A78EA;
			}
		}
	}
}

.recommend-section,
.history-section {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
	
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 20rpx;
	}
}

.recommend-list {
	white-space: nowrap;
	
	.recommend-item {
		display: inline-block;
		width: 200rpx;
		margin-right: 20rpx;
		
		.recommend-image {
			width: 200rpx;
			height: 150rpx;
			border-radius: 12rpx;
		}
		
		.recommend-title {
			display: block;
			font-size: 24rpx;
			color: #333;
			margin-top: 10rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}

.history-list {
	.history-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		
		&:last-child {
			border-bottom: none;
		}
		
		.history-left {
			display: flex;
			align-items: center;
			gap: 12rpx;
		}
		
		.history-text {
			font-size: 28rpx;
			color: #333;
		}
		
		.history-time {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #f0f0f0;
	
	.btn-generate {
		width: 100%;
		height: 80rpx;
		background: #5A78EA;
		color: #fff;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		font-size: 28rpx;
	}
}

/* 底部操作菜单样式 */
.action-menu-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 10000;
	display: flex;
	align-items: flex-end;
	animation: fadeIn 0.3s ease;
}

.action-menu-content {
	width: 100%;
	background: #fff;
	border-radius: 20rpx 20rpx 0 0;
	padding: 0 30rpx 30rpx;
	animation: slideUp 0.3s ease;
	
	.menu-item {
		display: flex;
		align-items: center;
		gap: 20rpx;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		font-size: 32rpx;
		color: #333;
		
		&:last-of-type {
			border-bottom: none;
		}
		
		&.delete {
			color: #ff4d4f;
		}
		
		&:active {
			background: #f5f5f5;
			border-radius: 10rpx;
		}
	}
	
	.menu-cancel {
		text-align: center;
		padding: 30rpx;
		font-size: 32rpx;
		color: #666;
		margin-top: 20rpx;
		background: #f8f8f8;
		border-radius: 10rpx;
		
		&:active {
			background: #f0f0f0;
		}
	}
}

.loading-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	
	.loading-content {
		background: #fff;
		padding: 40rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		gap: 20rpx;
		font-size: 28rpx;
		color: #333;
	}
}

.loading-icon {
	animation: rotate 1s linear infinite;
}

/* 动画效果 */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>