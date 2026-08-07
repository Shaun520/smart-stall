<template>
<view>
	<uni-nav-bar status-bar background-color="#F1F9FF" left-icon="left" @clickLeft="uni.navigateBack()" />
</view>
<view class="poster-container">
	<!-- 页面标题 -->
	<view class="header">
		<view class="main-title">智能海报生成</view>
		<view class="sub-title">快速创建营销海报</view>
	</view>
	
	<!-- 图片上传区域 -->
	<view class="upload-section">
		<view class="section-title">上传商品图片</view>
		<view class="upload-tips">最多可上传5张图片</view>
		
		<view class="upload-area" @click="chooseImage">
			<view class="upload-placeholder" v-if="imageList.length === 0">
				<uni-icons type="plusempty" size="48" color="#d9d9d9"></uni-icons>
				<view class="upload-text">点击上传图片</view>
				<view class="upload-format">支持JPG、PNG格式</view>
				<view class="upload-limit">最多5张照片</view>
			</view>
			
			<view class="image-preview" v-else>
				<scroll-view class="image-list" scroll-x>
					<view class="image-scroll-content">
						<view 
							class="image-item" 
							v-for="(image, index) in imageList" 
							:key="index"
							@click="previewImage(image)"
						>
							<image :src="image" mode="aspectFill" class="preview-image"></image>
							<view class="image-remove" @click.stop="removeImage(index)">
								<uni-icons type="closeempty" size="16" color="#fff"></uni-icons>
							</view>
						</view>
						
						<view 
							class="image-add" 
							v-if="imageList.length < 5" 
							@click="chooseImage"
						>
							<uni-icons type="plusempty" size="32" color="#d9d9d9"></uni-icons>
							<view class="add-text">添加</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view class="upload-count" v-if="imageList.length > 0">
			已上传 {{ imageList.length }}/5 张图片
		</view>
	</view>
	
	<!-- 海报标题 -->
	<view class="input-section">
		<view class="section-title">海报标题</view>
		<view class="input-card">
			<input 
				class="title-input" 
				placeholder="请输入海报标题（2-20个字符）" 
				v-model="posterTitle"
				maxlength="20"
				@input="updateTitleCount"
			/>
			<view class="input-count">{{ titleCount }}/20</view>
		</view>
	</view>
	
	<!-- 海报描述 -->
	<view class="input-section">
		<view class="section-title">海报描述</view>
		<view class="input-card">
			<textarea 
				class="desc-input" 
				placeholder="请输入海报描述..." 
				v-model="posterDesc"
				maxlength="100"
				@input="updateDescCount"
			></textarea>
			<view class="input-bottom">
				<view class="input-count">{{ descCount }}/100</view>
				<button class="ai-generate-btn" @click="generateDesc">AI生成</button>
			</view>
		</view>
	</view>
	
	<!-- 海报风格选择 -->
	<view class="style-section">
		<view class="section-title">选择海报风格</view>
		<view class="style-grid">
			<view 
				class="style-card" 
				v-for="(style, index) in styleList" 
				:key="index"
				:class="{ 'active': selectedStyle === index }"
				@click="selectStyle(index)"
			>
				<image :src="style.preview" mode="aspectFill" class="style-preview"></image>
				<view class="style-overlay" v-if="selectedStyle === index">
					<uni-icons type="checkmarkempty" size="24" color="#fff"></uni-icons>
				</view>
				<view class="style-name">{{ style.name }}</view>
			</view>
		</view>
	</view>
	
	<!-- 生成按钮 -->
	<view class="action-section">
		<button 
			class="generate-btn" 
			:class="{ 'disabled': !canGenerate }" 
			@click="generatePoster" 
			:disabled="!canGenerate"
		>
			<uni-icons type="color" size="20" color="#fff"></uni-icons>
			立即生成
		</button>
	</view>
</view>
</template>

<style lang="scss" scoped>
.poster-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
	padding: 20rpx 30rpx 120rpx;
	box-sizing: border-box;
}

// 头部样式
.header {
	text-align: center;
	margin-bottom: 40rpx;
	
	.main-title {
		font-size: 40rpx;
		font-weight: 700;
		color: #1a5b7e;
		margin-bottom: 8rpx;
		line-height: 1.4;
	}
	
	.sub-title {
		font-size: 28rpx;
		color: #666;
		line-height: 1.4;
	}
}

// 上传区域样式
.upload-section {
	margin-bottom: 40rpx;
	
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 8rpx;
	}
	
	.upload-tips {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 20rpx;
	}
	
	.upload-area {
		background: #fff;
		border: 2rpx dashed #d9d9d9;
		border-radius: 16rpx;
		padding: 40rpx 20rpx;
		text-align: center;
		min-height: 300rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		
		.upload-placeholder {
			.upload-text {
				font-size: 28rpx;
				color: #666;
				margin: 20rpx 0 8rpx;
			}
			
			.upload-format {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 4rpx;
			}
			
			.upload-limit {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.image-preview {
			width: 100%;
			
			.image-list {
				width: 100%;
				white-space: nowrap;
				
				.image-scroll-content {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
				}
				
				.image-item {
					position: relative;
					width: 200rpx;
					height: 200rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
					
					.preview-image {
						width: 100%;
						height: 100%;
						border-radius: 12rpx;
					}
					
					.image-remove {
						position: absolute;
						top: -8rpx;
						right: -8rpx;
						width: 40rpx;
						height: 40rpx;
						background: #ff4d4f;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
					}
				}
				
				.image-add {
					width: 200rpx;
					height: 200rpx;
					border: 2rpx dashed #d9d9d9;
					border-radius: 12rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					margin-right: 0;
					
					.add-text {
						font-size: 24rpx;
						color: #999;
						margin-top: 10rpx;
					}
				}
			}
		}
	}
	
	.upload-count {
		font-size: 24rpx;
		color: #666;
		margin-top: 20rpx;
		text-align: right;
	}
}

// 输入区域样式
.input-section {
	margin-bottom: 40rpx;
	
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.input-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		
		.title-input {
			width: 100%;
			height: 80rpx;
			font-size: 28rpx;
			color: #333;
			border-bottom: 1rpx solid #f0f0f0;
			padding-bottom: 20rpx;
			margin-bottom: 20rpx;
		}
		
		.desc-input {
			width: 100%;
			height: 200rpx;
			font-size: 28rpx;
			color: #333;
		}
		
		.input-bottom {
			
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 20rpx;
		}
		
		.input-count {
			font-size: 24rpx;
			color: #999;
		}
		
		.ai-generate-btn {
			height: 50rpx;
			line-height: 60rpx;
			background: #e6f7ff;
			color: #1890ff;
			font-size: 24rpx;
			align-items: center;
			display: flex;
			margin-right: 0;
		}
	}
}

// 风格选择样式
.style-section {
	margin-bottom: 40rpx;
	
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.style-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
		
		.style-card {
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
			position: relative;
			transition: all 0.3s ease;

			.style-preview {
				width: 100%;
				height: 200rpx;
			}
			
			.style-overlay {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				background-color: rgba(0, 0, 0, 0.1);
				justify-content: center;
			}
			
			.style-name {
				font-size: 24rpx;
				color: #333;
				text-align: center;
				padding: 20rpx 0;
				font-weight: 500;
			}
		}
	}
}

// 操作按钮样式
.action-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	padding: 20rpx 30rpx;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
	z-index: 100;
	
	.generate-btn {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 48rpx;
		border: none;
		box-shadow: 0 8rpx 24rpx rgba(114, 46, 209, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		
		&.disabled {
			background: #d9d9d9;
			box-shadow: none;
		}
		
		&:active:not(.disabled) {
			background: linear-gradient(135deg, #531dab 0%, #391085 100%);
		}
		
		&::after {
			border: none;
		}
	}
}
</style>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 图片列表
const imageList = ref([]);

// 海报标题
const posterTitle = ref('');
const titleCount = ref(0);

// 海报描述
const posterDesc = ref('');
const descCount = ref(0);

// 选中风格
const selectedStyle = ref(0);

// 风格列表
const styleList = ref([
	{ id: 0, name: '现代简约', preview: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.fEEq7IXH1nPRDZx8lEA30gHaHa?w=168&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3' },
	{ id: 1, name: '商务稳重', preview: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.rlDziLsGV9CX6YW5SjI_OgHaKk?w=189&h=269&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3' },
	{ id: 2, name: '活泼动感', preview: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.3P_BDnZF1fFPEzOhKcY9qgHaNK?w=187&h=333&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3' },
	{ id: 3, name: '温馨亲和', preview: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.Qt4Sv2LoLsFMtBmTgSeWRQHaFS?w=189&h=135&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3' },
	{ id: 4, name: '高端奢华', preview: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.cHC8NEk7XVWtcROqzOo3wAHaLJ?w=189&h=285&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3' },
	{ id: 5, name: '复古经典', preview: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.fvWRKH6eCaP0JsIblC9dcAHaKF?w=189&h=257&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3' }
]);

// 计算是否可以生成
const canGenerate = computed(() => {
	return imageList.value.length > 0 && 
		posterTitle.value.trim().length >= 2 && 
		posterTitle.value.trim().length <= 20;
});

// 页面加载
onLoad(() => {
	console.log('海报生成页面加载');
});

// 选择图片
const chooseImage = () => {
	const count = 5 - imageList.value.length;
	if (count <= 0) {
		uni.showToast({
			title: '最多上传5张图片',
			icon: 'none'
		});
		return;
	}
	
	uni.chooseImage({
		count: count,
		sizeType: ['original', 'compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			const tempFiles = res.tempFiles;
			const remainingSlots = 5 - imageList.value.length;
			const filesToAdd = tempFiles.slice(0, remainingSlots);
			
			filesToAdd.forEach(file => {
				imageList.value.push(file.path);
			});
			
			if (tempFiles.length > remainingSlots) {
				uni.showToast({
					title: `已选择前${remainingSlots}张图片`,
					icon: 'none'
				});
			}
		}
	});
};

// 删除图片
const removeImage = (index) => {
	uni.showModal({
		title: '删除图片',
		content: '确定要删除这张图片吗？',
		success: (res) => {
			if (res.confirm) {
				imageList.value.splice(index, 1);
			}
		}
	});
};

// 预览图片
const previewImage = (url) => {
	uni.previewImage({
		urls: imageList.value,
		current: url
	});
};

// 更新标题字数
const updateTitleCount = () => {
	titleCount.value = posterTitle.value.length;
};

// 更新描述字数
const updateDescCount = () => {
	descCount.value = posterDesc.value.length;
};

// AI生成描述
const generateDesc = () => {
	if (!posterTitle.value.trim()) {
		uni.showToast({
			title: '请先输入标题',
			icon: 'none'
		});
		return;
	}
	
	uni.showLoading({
		title: 'AI生成中...',
		mask: true
	});
	
	// 模拟AI生成描述
	setTimeout(() => {
		uni.hideLoading();
		posterDesc.value = '这款产品采用创新技术，为用户带来全新的使用体验。高品质的材料和精湛的工艺，确保卓越的性能表现。适合多种场景使用，满足您的不同需求。';
		descCount.value = posterDesc.value.length;
		uni.showToast({
			title: '描述生成成功',
			icon: 'success'
		});
	}, 1500);
};

// 选择风格
const selectStyle = (index) => {
	selectedStyle.value = index;
	console.log('选择风格:', styleList.value[index].name);
};

// 生成海报
const generatePoster = () => {
	if (!canGenerate.value) {
		if (imageList.value.length === 0) {
			uni.showToast({
				title: '请先上传图片',
				icon: 'none'
			});
		} else if (posterTitle.value.trim().length < 2) {
			uni.showToast({
				title: '标题至少2个字符',
				icon: 'none'
			});
		}
		return;
	}
	
	uni.showLoading({
		title: '海报生成中...',
		mask: true
	});
	
	// 模拟海报生成
	setTimeout(() => {
		uni.hideLoading();
		uni.showModal({
			title: '生成成功',
			content: '海报已生成，是否立即查看？',
			confirmText: '查看',
			cancelText: '稍后',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '打开预览',
						icon: 'success'
					});
					// 这里可以跳转到预览页面
				}
			}
		});
	}, 2000);
};
</script>