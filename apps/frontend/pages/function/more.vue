<script setup>
	import {
		ref,
		computed
	} from 'vue'
	const apps = ref([{
			id: 1,
			name: '智能叫卖',
			rating: '4.7',
			imageColor: '#6a89cc',
			icon: '📢',
			description: '智能语音叫卖系统，自动识别顾客并推荐商品'
		},
		{
			id: 2,
			name: '智能同行分析',
			rating: '4.8',
			imageColor: '#4bcffa',
			icon: '📊',
			description: '分析同行销售数据，提供竞争策略建议'
		},
		{
			id: 3,
			name: '近期热卖分析',
			rating: '4.8',
			imageColor: '#ff9f1c',
			icon: '🔥',
			description: '分析近期热销商品，预测销售趋势'
		},
		{
			id: 4,
			name: '智能库存管理',
			rating: '5.0',
			imageColor: '#a29bfe',
			icon: '✨',
			description: 'AI预测库存需求，自动补货提醒'
		},
		{
			id: 5,
			name: '客户行为分析',
			rating: '4.8',
			imageColor: '#fd79a8',
			icon: '⭐',
			description: '分析客户购买行为，提供个性化推荐'
		},
		{
			id: 6,
			name: 'AI助手',
			rating: '4.9',
			imageColor: '#00d2d3',
			icon: '🤖',
			description: '智能客服助手，24小时解答客户问题'
		}
	]);

	const searchQuery = ref('');
	const showSuggestionModal = ref(false);
	const suggestionText = ref('');

	// 计算属性：根据搜索查询过滤应用
	const filteredApps = computed(() => {
		if (!searchQuery.value) {
			return apps.value;
		}

		const query = searchQuery.value.toLowerCase();
		return apps.value.filter(app =>
			app.name.toLowerCase().includes(query)
		);
	});

	// 搜索应用
	const searchApps = () => {
		// 搜索逻辑已在计算属性中实现
		
	};

	// 打开应用
	const openApp = (app) => {
		
	};

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	};

	// 提交建议
	const submitSuggestion = () => {
		if (suggestionText.value.trim()) {
			
			suggestionText.value = '';
			showSuggestionModal.value = false;
		} else {
			
		}
	};
</script>


<template>
	<div id="app">
		<div class="container">
			<!-- 导航栏 -->
			<uni-nav-bar status-bar left-icon="left" title="全部ai应用" @clickLeft="goBack" :fixed="true">
				
			</uni-nav-bar>
			

			<!-- 搜索框 -->
			<div class="search-container">
				<div class="search-box">
					<input type="text" class="search-input" placeholder="搜索" v-model="searchQuery"
						@keyup.enter="searchApps">
					<button class="search-btn" @click="searchApps">搜索</button>
				</div>
			</div>

			<!-- 应用卡片网格 -->
			<div class="apps-grid">
				<div class="app-card" v-for="app in filteredApps" :key="app.id" @click="openApp(app)">
					<div class="app-image" :style="{ backgroundColor: app.imageColor }">
						{{ app.icon }}
					</div>
					<div class="app-info">
						<div class="app-name">{{ app.name }}</div>
						<div class="app-rating">
							<div class="rating-value">
								<span class="rating-star">★</span> {{ app.rating }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 悬浮提示气泡 -->
			<div class="floating-bubble" @click="showSuggestionModal = true">
				<div class="bubble-avatar">🤖</div>
				<div class="bubble-text">还想要什么功能，点击我提议吧!</div>
			</div>

			<!-- 功能建议模态框 -->
			<div class="modal" v-if="showSuggestionModal">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title">功能建议</div>
						<button class="close-btn" @click="showSuggestionModal = false">×</button>
					</div>
					<div class="modal-body">
						<textarea class="suggestion-input" placeholder="请描述您想要的功能..."
							v-model="suggestionText"></textarea>
					</div>
					<button class="submit-btn" @click="submitSuggestion">提交建议</button>
				</div>
			</div>
		</div>
	</div>
</template>


<style lang="scss" scoped>
	page {
		background-color: #F7F7F7;
		color: #333;
		padding-bottom: 20px;
	}

	.container {
		max-width: 480px;
		margin: 0 auto;
		background-color: #fff;
		min-height: 100vh;
		position: relative;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	}

	/* 顶部导航栏 */
	.navbar {
		background-color: #4a90e2;
		color: white;
		height:150rpx;
		display: flex;
		align-items: flex-end;
		padding-bottom: 20rpx;
		justify-content: space-between;
	}

	.navbar-left {
		display: flex;
		align-items: center;
	}

	.navbar-title {
		font-size: 18px;
		font-weight: 600;
		margin: 0 auto;
	}

	/* 搜索框 */
	.search-container {
		padding: 16px;
		background-color: #fff;
	}

	.search-box {
		display: flex;
		background-color: #f5f5f5;
		border-radius: 20px;
		padding: 0 15rpx;
		align-items: center;
		border: 1px solid #e0e0e0;
		height: 45px;
	}

	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		outline: none;
		padding: 4px 8px;
		font-size: 16px;
	}

	.search-btn {
		background-color: #4a90e2;
		color: white;
		border: none;
		border-radius: 16px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.search-btn:hover {
		background-color: #3a7bc8;
	}

	/* 应用卡片网格 */
	.apps-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		padding: 16px;
	}

	.app-card {
		background-color: #fff;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s, box-shadow 0.2s;
		cursor: pointer;
	}

	.app-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.app-image {
		width: 100%;
		height: 120px;
		object-fit: cover;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 40px;
		position: relative;
		overflow: hidden;
	}

	.app-image::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	}

	.app-info {
		padding: 12px;
	}

	.app-name {
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 4px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.app-rating {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.rating-value {
		color: #e53935;
		font-weight: 600;
		font-size: 14px;
	}

	.rating-star {
		color: #ffc107;
		font-size: 12px;
		margin-right: 2px;
	}

	/* 悬浮提示气泡 */
	.floating-bubble {
		position: fixed;
		right: 20px;
		bottom: 20px;
		background-color: white;
		border-radius: 20px;
		padding: 12px 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;
		max-width: 200px;
		z-index: 1000;
		animation: float 3s ease-in-out infinite;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.floating-bubble:hover {
		transform: scale(1.05);
	}

	@keyframes float {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-5px);
		}
	}

	.bubble-avatar {
		width: 32px;
		height: 32px;
		background-color: #4a90e2;
		border-radius: 50%;
		margin-right: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 18px;
		flex-shrink: 0;
	}

	.bubble-text {
		font-size: 14px;
		color: #333;
		line-height: 1.4;
	}

	/* 模态框 */
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
	}

	.modal-content {
		background-color: white;
		border-radius: 12px;
		padding: 20px;
		width: 90%;
		max-width: 400px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.modal-header {
		display: flex;
		
		align-items: center;
		margin-bottom: 15px;
	
		
	}

	.modal-title {
		font-size: 18px;
		font-weight: 600;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: #999;
		display: flex;
		align-items:center;
		justify-content: center;
		width: 80rpx;
		height: 80rpx;
		margin-right:0;
	}

	.modal-body {
		margin-bottom: 20px;
	}

	.suggestion-input {
		width: 100%;
		padding: 10px;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		font-size: 14px;
		resize: vertical;
		min-height: 100px;
	}

	.submit-btn {
		background-color: #4a90e2;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 10px 20px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		width: 100%;
		transition: background-color 0.2s;
	}

	.submit-btn:hover {
		background-color: #3a7bc8;
	}

	/* 响应式调整 */
	@media (max-width: 480px) {
		.container {
			max-width: 100%;
		}

		.apps-grid {
			gap: 12px;
			padding: 12px;
		}

		.floating-bubble {
			right: 10px;
			bottom: 10px;
			max-width: 180px;
		}
	}


</style>