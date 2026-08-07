<template>
	<view class="chat-container">
		<!-- 顶部导航栏 -->
		<uni-nav-bar status-bar left-icon="left" title="隔壁老王" @clickLeft="goBack" :fixed="true">

			<template #right>
				<view class="phone-custom">
					<uni-icons type="phone" size="24" color="#DC362E" @click="makePhoneCall" />
				</view>
			</template>
		</uni-nav-bar>


		<!-- 聊天内容区域 -->
		<view class="chat-content">
			<scroll-view class="message-scroll" scroll-y="true" :scroll-top="scrollTop">
				<!-- 对方消息 -->
				<view class="message-item other-message">
					<view class="avatar-container">
						<view class="avatar-circle">
							<text class="avatar-icon">👤</text>
						</view>
						<text class="avatar-name">顾客老王</text>
					</view>
					<view class="message-bubble other-bubble">
						<view class="bubble-arrow left-arrow"></view>
						<text class="message-text">你好。。。</text>
					</view>
				</view>

				<!-- 我的消息 -->
				<view class="message-item my-message">
					<view class="message-bubble my-bubble">
						<view class="bubble-arrow right-arrow"></view>
						<text class="message-text">你好。。。。</text>
					</view>
					<view class="avatar-container">
						<view class="avatar-circle">
							<text class="avatar-icon">👤</text>
						</view>
						<text class="avatar-name">小白的咖啡</text>
					</view>
				</view>

				<!-- 对方消息 -->
				<view class="message-item other-message">
					<view class="avatar-container">
						<view class="avatar-circle">
							<text class="avatar-icon">👤</text>
						</view>
						<text class="avatar-name">顾客老王</text>
					</view>
					<view class="message-bubble other-bubble">
						<view class="bubble-arrow left-arrow"></view>
						<text class="message-text">我想咨询一下明天的营业时间</text>
					</view>
				</view>

				<!-- 我的消息 -->
				<view class="message-item my-message">
					<view class="message-bubble my-bubble">
						<view class="bubble-arrow right-arrow"></view>
						<text class="message-text">我们明天上午9点开始营业</text>
					</view>
					<view class="avatar-container">
						<view class="avatar-circle">
							<text class="avatar-icon">👤</text>
						</view>
						<text class="avatar-name">小白的咖啡</text>
					</view>
				</view>

				<!-- 时间分割线 -->
				<view class="time-divider">
					<text class="time-text">12:00</text>
				</view>

				<!-- 对方消息 -->
				<view class="message-item other-message">
					<view class="avatar-container">
						<view class="avatar-circle">
							<text class="avatar-icon">👤</text>
						</view>
						<text class="avatar-name">顾客老王</text>
					</view>
					<view class="message-bubble other-bubble">
						<view class="bubble-arrow left-arrow"></view>
						<text class="message-text">好的，谢谢！</text>
					</view>
				</view>

				<!-- 新发送的消息会显示在这里 -->
				<view class="message-item" v-for="(msg, index) in messageHistory" :key="index"
					:class="msg.type === 'user' ? 'my-message' : 'other-message'">
					<view class="avatar-container" v-if="msg.type === 'other'">
						<view class="avatar-circle">
							<text class="avatar-icon">👤</text>
						</view>
						<text class="avatar-name">顾客老王</text>
					</view>
					<view class="message-bubble" :class="msg.type === 'user' ? 'my-bubble' : 'other-bubble'">
						<view class="bubble-arrow" :class="msg.type === 'user' ? 'right-arrow' : 'left-arrow'"></view>
						<text class="message-text">{{ msg.content }}</text>
					</view>
					<view class="avatar-container" v-if="msg.type === 'user'">
						<view class="avatar-circle">
							<text class="avatar-icon">👤</text>
						</view>
						<text class="avatar-name">小白的咖啡</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 底部输入区域 -->
		<view class="input-section">
			<view class="input-container">
				<!-- 语音/键盘切换按钮 -->
				<view class="voice-toggle-btn" @click="toggleInputMode">
					<text class="toggle-icon">{{ isVoiceMode ? '⌨️' : '🔊' }}</text>
				</view>

				<!-- 文本输入模式 -->
				<view class="input-box" v-if="!isVoiceMode">
					<textarea v-model="inputMessage" class="message-input" placeholder="发信息或按住说话..."
						placeholder-style="color: #999;" :focus="isTextInput && !showEmojiPanel" @input="onInput"
						@focus="hideEmojiPanel" :maxlength="500" :show-confirm-bar="false" auto-height
						:style="{ height: inputHeight + 'rpx', maxHeight: '210rpx' }" />
				</view>

				<!-- 语音输入模式 -->
				<view class="voice-input-box" v-else @touchstart="startVoiceInput" @touchend="stopVoiceInput">
					<text class="voice-input-text">{{ isRecording ? '松开 结束' : '按住 说话' }}</text>
				</view>

				<!-- 表情按钮 -->
				<view class="emoji-btn" @click="toggleEmojiPanel">
					<text class="emoji-icon">{{ showEmojiPanel ? '⌨️' : '😊' }}</text>
				</view>

				<!-- 发送/文件上传按钮 -->
				<view class="send-file-btn" @click="handleSendOrFile">
					<view class="file-upload-icon" v-if="inputMessage.length === 0">
						<text class="file-icon-inner">{{ showExtraPanel ? '×' : '+' }}</text>
					</view>
					<view class="send-btn" v-else>
						<text class="send-icon">➤</text>
					</view>
				</view>
			</view>

			<!-- 表情面板 -->
			<view class="emoji-panel" v-if="showEmojiPanel">
				<scroll-view class="emoji-scroll" scroll-y="true">
					<view class="emoji-row" v-for="(row, rowIndex) in emojiRows" :key="rowIndex">
						<view class="emoji-item" v-for="emoji in row" :key="emoji" @click="selectEmoji(emoji)">
							<text class="emoji-char">{{ emoji }}</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 扩展功能面板 -->
			<view class="extra-panel" v-if="showExtraPanel">
				<view class="panel-row">
					<view class="panel-item" @click="choosePhoto">
						<view class="panel-icon photo-icon">📷</view>
						<text class="panel-text">照片</text>
					</view>
					<view class="panel-item" @click="chooseImage">
						<view class="panel-icon image-icon">🖼️</view>
						<text class="panel-text">相册</text>
					</view>
					<view class="panel-item" @click="takeVideo">
						<view class="panel-icon video-icon">🎥</view>
						<text class="panel-text">拍摄</text>
					</view>
					<view class="panel-item" @click="sendLocation">
						<view class="panel-icon location-icon">📍</view>
						<text class="panel-text">位置</text>
					</view>
				</view>
				<view class="panel-row">
					<view class="panel-item" @click="sendFile">
						<view class="panel-icon file-icon">📄</view>
						<text class="panel-text">文件</text>
					</view>
					<view class="panel-item" @click="makeCall">
						<view class="panel-icon call-icon">📞</view>
						<text class="panel-text">语音通话</text>
					</view>
					<view class="panel-item" @click="makeVideoCall">
						<view class="panel-icon video-call-icon">📹</view>
						<text class="panel-text">视频通话</text>
					</view>
					<view class="panel-item" @click="sendRedPacket">
						<view class="panel-icon redpacket-icon">🧧</view>
						<text class="panel-text">红包</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		nextTick,
		computed,
		watch
	} from 'vue'

	const inputMessage = ref('')
	const isVoiceMode = ref(false)
	const isRecording = ref(false)
	const isTextInput = ref(true)
	const showExtraPanel = ref(false)
	const showEmojiPanel = ref(false)
	const scrollTop = ref(0)
	const inputHeight = ref(70) // 初始高度
	const messageHistory = ref([])

	// 表情列表
	const emojiList = ref([
		'😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
		'😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
		'😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
		'🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
		'😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
		'😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
		'😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
		'😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥'
	])

	// 计算表情行
	const emojiRows = computed(() => {
		const rows = []
		for (let i = 0; i < emojiList.value.length; i += 8) {
			rows.push(emojiList.value.slice(i, i + 8))
		}
		return rows
	})

	// 监听输入内容变化，调整输入框高度
	watch(inputMessage, (newVal) => {
		// 根据换行符数量调整高度
		const lineCount = (newVal.match(/\n/g) || []).length + 1
		if (lineCount === 1) {
			inputHeight.value = 70
		} else if (lineCount === 2) {
			inputHeight.value = 105
		} else if (lineCount >= 3) {
			inputHeight.value = 140
		}
	})

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 切换输入模式（文本/语音）
	const toggleInputMode = () => {
		isVoiceMode.value = !isVoiceMode.value
		hideEmojiPanel()
		hideExtraPanel()
	}

	// 开始语音输入
	const startVoiceInput = () => {
		isRecording.value = true
		// 这里可以添加开始录音的逻辑
		console.log('开始录音')
	}

	// 结束语音输入
	const stopVoiceInput = () => {
		isRecording.value = false
		// 这里可以添加结束录音并发送的逻辑
		console.log('结束录音')
	}

	// 切换表情面板
	const toggleEmojiPanel = () => {
		showEmojiPanel.value = !showEmojiPanel.value
		if (showEmojiPanel.value) {
			hideExtraPanel()
			isTextInput.value = false
		} else {
			isTextInput.value = true
		}
	}

	// 隐藏表情面板
	const hideEmojiPanel = () => {
		showEmojiPanel.value = false
		isTextInput.value = true
	}

	// 选择表情
	const selectEmoji = (emoji) => {
		inputMessage.value += emoji
	}

	// 处理发送或文件上传
	const handleSendOrFile = () => {
		if (inputMessage.value.length > 0) {
			sendMessage()
		} else {
			toggleExtraPanel()
		}
	}

	// 切换扩展功能面板
	const toggleExtraPanel = () => {
		showExtraPanel.value = !showExtraPanel.value
		if (showExtraPanel.value) {
			hideEmojiPanel()
		}
	}

	// 隐藏扩展面板
	const hideExtraPanel = () => {
		showExtraPanel.value = false
	}

	// 发送消息
	const sendMessage = () => {
		if (!inputMessage.value.trim()) return

		// 添加用户消息
		messageHistory.value.push({
			type: 'user',
			content: inputMessage.value
		})

		// 清空输入框
		inputMessage.value = ''

		// 重置输入框高度
		inputHeight.value = 70

		// 隐藏表情面板
		hideEmojiPanel()

		// 滚动到底部
		scrollToBottom()

		// 模拟对方回复
		setTimeout(() => {
			messageHistory.value.push({
				type: 'other',
				content: '收到您的消息，我们会尽快回复'
			})
			scrollToBottom()
		}, 1000)
	}

	// 输入处理
	const onInput = () => {
		// 这里可以添加输入时的处理逻辑
	}

	// 各种功能方法
	const choosePhoto = () => {
		uni.showToast({
			title: '选择照片',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	const chooseImage = () => {
		uni.showToast({
			title: '选择图片',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	const takeVideo = () => {
		uni.showToast({
			title: '拍摄视频',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	const sendLocation = () => {
		uni.showToast({
			title: '发送位置',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	const sendFile = () => {
		uni.showToast({
			title: '发送文件',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	const makeCall = () => {
		uni.showToast({
			title: '语音通话',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	const makeVideoCall = () => {
		uni.showToast({
			title: '视频通话',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	const sendRedPacket = () => {
		uni.showToast({
			title: '发送红包',
			icon: 'none'
		})
		showExtraPanel.value = false
	}

	onMounted(() => {
		// 组件挂载后滚动到底部
		scrollToBottom()
	})

	// 滚动到底部
	const scrollToBottom = () => {
		nextTick(() => {
			setTimeout(() => {
				scrollTop.value = 99999 // 设置一个足够大的值确保滚动到底部
			}, 100)
		})
	}
</script>

<style lang="scss" scoped>
	
	.phone-custom{
		width: 60rpx;height: 60rpx;border-radius: 8rpx;background-color: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.chat-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
	}



	/* 聊天内容区域 */
	.chat-content {
		flex: 1;
		overflow: hidden;
		padding: 0 30rpx;
		background-color: #f5f5f5;
	}

	.message-scroll {
		height: 100%;
		padding: 30rpx 0;
	}

	.message-item {
		display: flex;
		margin-bottom: 60rpx;
		/* 增加消息间距 */
		align-items: flex-start;
	}

	.other-message {
		justify-content: flex-start;
	}

	.my-message {
		justify-content: flex-end;
	}

	/* 头像容器 */
	.avatar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80rpx;
		margin: 0 20rpx;
	}

	/* 圆形头像 */
	.avatar-circle {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #e0e0e0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 10rpx;
	}

	.avatar-icon {
		font-size: 40rpx;
	}

	.avatar-name {
		font-size: 22rpx;
		color: #999;
		text-align: center;
	}

	/* 消息气泡 */
	.message-bubble {
		max-width: 500rpx;
		padding: 20rpx 30rpx;
		border-radius: 10rpx;
		position: relative;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-top: 10rpx;
		/* 气泡与头像齐平 */
	}

	.other-bubble {
		background-color: #fff;
		margin-left: 10rpx;
	}

	.my-bubble {
		background-color: #95ec69;
		margin-right: 10rpx;
	}

	/* 气泡箭头 */
	.bubble-arrow {
		position: absolute;
		top: 20rpx;
		width: 0;
		height: 0;
		border-top: 10rpx solid transparent;
		border-bottom: 10rpx solid transparent;
	}

	.left-arrow {
		left: -16rpx;
		border-right: 16rpx solid #fff;
	}

	.right-arrow {
		right: -16rpx;
		border-left: 16rpx solid #95ec69;
	}

	.message-text {
		font-size: 32rpx;
		line-height: 1.5;
		color: #333;
		white-space: pre-wrap;
		word-break: break-word;
	}

	/* 时间分割线 */
	.time-divider {
		display: flex;
		justify-content: center;
		margin: 40rpx 0;
	}

	.time-text {
		font-size: 24rpx;
		color: #999;
		background-color: rgba(255, 255, 255, 0.7);
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
	}

	/* 底部输入区域 */
	.input-section {
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #eee;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.input-container {
		display: flex;
		align-items: flex-end;
		gap: 15rpx;
	}

	.voice-toggle-btn,
	.emoji-btn,
	.send-file-btn {
		width: 70rpx;
		height: 70rpx;
		border-radius: 20rpx;
		background-color: #f8f8f8;
		/* 极浅灰色 */
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		flex-shrink: 0;
		margin-bottom: 0;
	}

	.voice-toggle-btn:active,
	.emoji-btn:active,
	.send-file-btn:active {
		background-color: #e8e8e8;
		transform: scale(0.95);
	}

	.toggle-icon,
	.emoji-icon {
		font-size: 32rpx;
		color: #333;
	}

	.input-box {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: #fff;
		/* 白色背景 */
		border-radius: 20rpx;
		padding: 15rpx 20rpx;
		min-height: 70rpx;
		max-height: 210rpx;
		/* 最多三行高度 */
		overflow-y: auto;
		border: 1rpx solid #e0e0e0;
	}

	.message-input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		background: transparent;
		border: none;
		outline: none;
		min-height: 40rpx;
		line-height: 1.5;
		width: 100%;
	}

	.voice-input-box {
		flex: 1;
		height: 70rpx;
		background-color: #f8f8f8;
		/* 极浅灰色 */
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #333;
		transition: all 0.2s ease;
	}

	.voice-input-box:active {
		background-color: #e8e8e8;
	}

	.file-upload-icon {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background-color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.file-icon-inner {
		font-size: 24rpx;
		color: #fff;
		font-weight: bold;
	}

	.send-btn {
		width: 70rpx;
		height: 70rpx;
		border-radius: 20rpx;
		background-color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.send-btn:active {
		background-color: #555;
		transform: scale(0.95);
	}

	.send-icon {
		font-size: 28rpx;
		color: #fff;
	}

	/* 表情面板 */
	.emoji-panel {
		height: 400rpx;
		background-color: #f5f5f5;
		border-top: 1rpx solid #eee;
		margin-top: 20rpx;
	}

	.emoji-scroll {
		height: 100%;
		padding: 20rpx;
	}

	.emoji-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.emoji-item {
		width: 70rpx;
		height: 70rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.emoji-item:active {
		background-color: #e0e0e0;
		transform: scale(0.95);
	}

	.emoji-char {
		font-size: 36rpx;
	}

	/* 扩展功能面板 */
	.extra-panel {
		background-color: #fff;
		padding: 30rpx;
		border-top: 1rpx solid #eee;
		margin-top: 20rpx;
	}

	.panel-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.panel-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
	}

	.panel-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 15rpx;
		font-size: 40rpx;
		transition: all 0.2s ease;
	}

	.panel-item:active .panel-icon {
		background-color: #e0e0e0;
		transform: scale(0.95);
	}

	.panel-text {
		font-size: 24rpx;
		color: #666;
	}
</style>