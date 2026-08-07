<template>
	<view class="chat-container">
		<!-- 导航栏 -->
		<uni-nav-bar status-bar left-width="200rpx" right-width="250rpx" left-icon="left" :fixed="true">
			<template #left>
				<view class="left-section">
					<view class="back-btn" @click="goBack">
						<text class="back-icon">‹</text>
					</view>
					<text class="ai-name">小智</text>
				</view>
			</template>
			<template #right>
				<view class="right-section">
					<view class="nav-btn" @click="toggleFavorite">
						<text class="nav-icon">+</text>
					</view>
					<view class="nav-btn" @click="toggleVoicePlayback">
						<text class="nav-icon" :class="{ 'playing': isVoicePlaying }">🔊</text>
					</view>
					<view class="nav-btn" @click="toggleChatHistory">
						<text class="nav-icon">☰</text>
					</view>
				</view>
			</template>
		</uni-nav-bar>

		<!-- 聊天内容区域 -->
		<view class="chat-content">
			<scroll-view class="message-scroll" scroll-y="true" :scroll-top="scrollTop" :scroll-with-animation="true" @scrolltolower="scrollToBottom">
				<!-- AI欢迎消息 -->
				<view class="message-item ai-message" v-if="flag">
					<view class="robot-container">
						<image src="/static/images/ai-robot.png" class="robot-icon" mode="aspectFit"></image>
						<view class="robot-glow"></view>
					</view>
					<view class="message-bubble ai-bubble">
						<view class="bubble-arrow"></view>
						<text class="message-text">请输入时间、地址，获取AI个性化建议吧！！</text>
					</view>
				</view>

				<!-- 消息历史 -->
				<view class="message-item" v-for="(msg, index) in messageHistory" :key="index"
					:class="msg.type === 'user' ? 'user-message' : 'ai-message'">
					<view class="robot-container" v-if="msg.type === 'ai'">
						<image src="/static/images/ai-robot.png" class="robot-icon" mode="aspectFit"></image>
						<view class="robot-glow"></view>
					</view>
					<view class="message-bubble" :class="msg.type === 'user' ? 'user-bubble' : 'ai-bubble'">
						<view class="bubble-arrow" v-if="msg.type === 'ai'"></view>

						<!-- 用户消息显示文字和图片 -->
						<view v-if="msg.type === 'user'" class="user-message-content">
							<!-- 图片预览 -->
							<view class="image-preview-container" v-if="msg.images && msg.images.length > 0">
								<view class="image-preview" v-for="(img, imgIndex) in msg.images" :key="imgIndex">
									<image :src="img" class="preview-image" mode="aspectFill"
										@click="previewImage(msg.images, imgIndex)"></image>
								</view>
							</view>

							<!-- 文字内容 -->
							<text v-if="msg.content" class="message-text">{{ msg.content }}</text>
						</view>

						<!-- AI消息 - 修复显示问题 -->
						<view v-else class="ai-message-content">
							<text class="message-text" v-if="msg.content">{{ msg.content }}</text>
							<!-- 如果没有内容且正在回复中，显示加载动画 -->
							<view v-else-if="msg.isThinking" class="typing-indicator">
								<view class="typing-dot"></view>
								<view class="typing-dot"></view>
								<view class="typing-dot"></view>
							</view>
							<!-- 如果没有任何内容，显示空状态 -->
							<text v-else class="empty-message">...</text>
						</view>
					</view>
				</view>

				<!-- AI回复中状态（全局） -->
				<view class="message-item ai-message" v-if="isAiReplying && !currentAiMessageId">
					<view class="robot-container">
						<image src="/static/images/ai-robot.png" class="robot-icon" mode="aspectFit"></image>
						<view class="robot-glow"></view>
					</view>
					<view class="message-bubble">
						<view class="bubble-arrow"></view>
						<view class="typing-indicator">
							<view class="typing-dot"></view>
							<view class="typing-dot"></view>
							<view class="typing-dot"></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 底部输入区域 -->
		<view class="input-section">
			<!-- 图片预览区域 -->
			<view class="image-preview-area" v-if="selectedImages.length > 0">
				<scroll-view class="image-preview-scroll" scroll-x="true">
					<view class="preview-item" v-for="(img, index) in selectedImages" :key="index">
						<image :src="img" class="preview-thumb" mode="aspectFill"></image>
						<view class="remove-btn" @click="removeImage(index)">×</view>
					</view>
				</scroll-view>
			</view>

			<view class="input-container">
				<view class="input-box">
					<!-- 语音输入模式下的输入框 -->
					<view v-if="isVoiceInput" class="voice-input-container" :class="{ 'voice-active': isVoiceRecording }"
						@touchstart="startVoiceRecording" @touchend="stopVoiceRecording" @touchcancel="cancelVoiceRecording">
						<view class="voice-input-inner">
							<view class="voice-wave" v-if="isVoiceRecording">
								<view class="wave-bar" v-for="n in 5" :key="n" :style="getWaveStyle(n)"></view>
							</view>
							<text class="voice-input-text">{{ voiceInputText }}</text>
						</view>
					</view>

					<!-- 文本输入模式下的输入框 -->
					<input v-else v-model="inputMessage" class="message-input" :placeholder="inputPlaceholder"
						placeholder-style="color: #999;" :disabled="isVoiceInput || isAiReplying" :focus="isTextInput"
						@confirm="isAiReplying ? stopAiReply() : sendMessage()" />

					<view class="input-buttons" v-if="inputMessage.length > 0 || selectedImages.length > 0">
						<view class="input-action-btn voice-btn" @click="toggleVoiceInput"
							:class="{ 'active': isVoiceInput }">
							<text class="action-icon">{{ isVoiceInput ? '⌨️' : '🔊' }}</text>
						</view>
						<view class="input-action-btn" @click="toggleFileUpload">
							<view class="file-upload-icon">
								<text class="file-icon-inner">{{ showFileOptions ? '×' : '+' }}</text>
							</view>
						</view>
						<view class="input-action-btn send-btn" @click="isAiReplying ? stopAiReply() : sendMessage()"
							:class="{ 'active': inputMessage.length > 0 || selectedImages.length > 0, 'stop-btn': isAiReplying }">
							<text class="action-icon send-icon">{{ isAiReplying ? '■' : '➤' }}</text>
						</view>
					</view>
				</view>
				<view class="action-buttons" v-if="inputMessage.length === 0 && selectedImages.length === 0">
					<view class="action-btn voice-btn" @click="toggleVoiceInput" :class="{ 'active': isVoiceInput }">
						<text class="btn-icon">{{ isVoiceInput ? '⌨️' : '🔊' }}</text>
					</view>
					<view class="action-btn" @click="toggleFileUpload">
						<view class="file-upload-icon">
							<text class="file-icon-inner">{{ showFileOptions ? '×' : '+' }}</text>
						</view>
					</view>
					<view class="action-btn send-btn" @click="sendMessage"
						:class="{ 'active': inputMessage.length > 0 || selectedImages.length > 0, 'stop-btn': isAiReplying }">
						<text class="btn-icon send-icon">{{ isAiReplying ? '■' : '➤' }}</text>
					</view>
				</view>
			</view>

			<!-- 文件上传选项 -->
			<view class="file-options" v-if="showFileOptions">
				<view class="file-option" @click="takePhoto">
					<view class="file-icon-container">
						<text class="file-icon">📷</text>
					</view>
					<text class="file-text">拍照</text>
				</view>
				<view class="file-option" @click="chooseFromAlbum">
					<view class="file-icon-container">
						<text class="file-icon">🖼️</text>
					</view>
					<text class="file-text">相册</text>
				</view>
				<view class="file-option" @click="chooseLocalFile">
					<view class="file-icon-container">
						<text class="file-icon">📁</text>
					</view>
					<text class="file-text">本地文件</text>
				</view>
				<view class="file-option" @click="chooseWechatFile">
					<view class="file-icon-container wechat-container">
						<text class="file-icon wechat-icon">💬</text>
					</view>
					<text class="file-text">微信文件</text>
				</view>
			</view>
		</view>

		<!-- 对话历史侧边栏 -->
		<view class="history-sidebar" :class="{ 'active': showChatHistory }">
			<view class="sidebar-header">
				<text class="sidebar-title">对话历史</text>
				<view class="close-btn" @click="toggleChatHistory">
					<text class="close-icon">×</text>
				</view>
			</view>
			<scroll-view class="history-list" scroll-y="true" :scroll-top="historyScrollTop">
				<view class="history-item" v-for="history in chatHistories" :key="history._id"
					@click="loadChatHistory(history._id)">
					<text class="history-preview">{{ history.title }}</text>
					<text class="history-time">{{formatDate(history.createdAt)}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 侧边栏遮罩 -->
		<view class="sidebar-mask" v-if="showChatHistory" @click="toggleChatHistory"></view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onUnmounted,
		nextTick,
		computed
	} from 'vue'
	import {
		textToSpeech,
		playAudio
	} from '../../utils/audioHelper'
	import {
		getConversationsApi,
		getMessagesApi,
		addMessageApi,
		addConversationApi
	} from '../../apis/chat'
	import {
		formatDate
	} from '../../utils/timeFormatted'

	const conversationId = ref('') //当前会话id
	const flag = ref(true) //用来提示显示
	const inputMessage = ref('')
	const isVoiceInput = ref(false)
	const isTextInput = ref(true)
	const showFileOptions = ref(false)
	const showChatHistory = ref(false)
	const isFavorited = ref(false)
	const isVoicePlaying = ref(false)
	const isAiReplying = ref(false)
	const scrollTop = ref(0)
	const historyScrollTop = ref(0)
	const selectedImages = ref([]) // 存储选中的图片
	const imageList = ref([])
	const currentAiMessageId = ref('') // 当前AI消息ID，用于标识正在生成的消息
	let aiReplyTimer = null
	const previous_response_id = ref('') //上一条对话id - 用于ai记忆
	const lastRequestTask = ref(null); // 来存储上一次请求的 requestTask 对象

	// 语音输入相关状态
	const isVoiceRecording = ref(false)
	const voiceInputText = ref('长按输入框进行语音输入')
	let voiceRecordingTimer = null
	let waveAnimationInterval = null

	// 计算属性：输入框占位符
	const inputPlaceholder = computed(() => {
		return isVoiceInput.value ? "长按输入框进行语音输入" : "请输入时间、地址，获取AI个性化建议吧！！"
	})

	// 消息历史
	const messageHistory = ref([])

	// 对话历史记录
	const chatHistories = ref([])

	const getConvesations = async () => {
		try {
			const res = await getConversationsApi("1")
			if (res.errno == 0) {
				chatHistories.value = res.data
			} else
				uni.showToast({
					title: "获取会话列表错误"
				})
		} catch (e) {
			uni.showToast({
				title: "会话列表异常错误"
			})
		}
	}

	onMounted(() => {
		// 组件挂载后的初始化代码
		getConvesations()
	})
	onUnmounted(() => {
		// 组件卸载时中断所有请求
		if (lastRequestTask.value) {
			lastRequestTask.value.abort();
			lastRequestTask.value = null;
		}
		if (aiReplyTimer) {
			clearTimeout(aiReplyTimer);
			aiReplyTimer = null;
		}
		// 清除语音相关定时器
		if (voiceRecordingTimer) {
			clearTimeout(voiceRecordingTimer);
			voiceRecordingTimer = null;
		}
		if (waveAnimationInterval) {
			clearInterval(waveAnimationInterval);
			waveAnimationInterval = null;
		}
	})

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 切换收藏状态
	const toggleFavorite = () => {
		flag.value = false
		conversationId.value = ''
		messageHistory.value = []
		isFavorited.value = !isFavorited.value
	}
	
	// 停止AI回复
	const stopAiReply = () => {
		if (lastRequestTask.value) {
			lastRequestTask.value.abort();
			lastRequestTask.value = null;
			isAiReplying.value = false;
			currentAiMessageId.value = '';

			uni.showToast({
				title: '已停止回复',
				icon: 'success'
			});
		}

		if (aiReplyTimer) {
			clearTimeout(aiReplyTimer);
			aiReplyTimer = null;
		}
	}

	// 切换语音播放
	const toggleVoicePlayback = async () => {

		try {
			// const res = await textToSpeech('晚上好',
			// 	'24.24aba5860c9725420f0034f034e55f33.2592000.1765554013.282335-120557823')
			// const base64 = uni.arrayBufferToBase64(res)

			uni.showToast({
				title: '功能暂未开发',
				icon: "none"
			})
		} catch (e) {
			uni.showToast({
				title: '播放异常'
			})
		}


		isVoicePlaying.value = !isVoicePlaying.value
	}

	// 切换对话历史侧边栏
	const toggleChatHistory = () => {
		showChatHistory.value = !showChatHistory.value
		if (showChatHistory.value) {
			// 侧边栏打开时，重置滚动位置到顶部
			nextTick(() => {
				historyScrollTop.value = 0
			})
		}
	}

	// 切换语音输入
	const toggleVoiceInput = () => {
		isVoiceInput.value = !isVoiceInput.value
		isTextInput.value = !isVoiceInput.value

		if (isVoiceInput.value) {
			// 切换到语音输入模式
			inputMessage.value = ''
			voiceInputText.value = '长按输入框进行语音输入'
		}
	}

	// 切换文件上传选项
	const toggleFileUpload = () => {
		showFileOptions.value = !showFileOptions.value
	}

	// 发送消息 - 流式响应版本（修复版）
	const sendMessage = async () => {
		// 没发信息
		if (!inputMessage.value.trim() && selectedImages.value.length === 0 && !lastRequestTask.value) return
		
		// 打断回复
		if (lastRequestTask.value) {
			lastRequestTask.value.abort();
			lastRequestTask.value = null;
			isAiReplying.value = false;
			currentAiMessageId.value = '';
			// 短暂延迟确保状态重置
			await new Promise(resolve => setTimeout(resolve, 50));
			return
		}
		
		// 新建会话
		if (!conversationId.value) {
			try {
				const res = await addConversationApi({
					type: 1, // 会话类型：ai会话
					title: inputMessage.value.substring(0, 20) // 截取前20字符作为标题
				})
				if (res.errno == 0) conversationId.value = res.data._id
			} catch (e) {
				uni.showToast({
					title: "新增会话错误"
				})
				return
			}
		}

		// 保存用户消息内容
		const userMessageContent = inputMessage.value
		const userImages = [...selectedImages.value]

		// 添加用户消息到历史记录
		messageHistory.value.push({
			type: 'user',
			content: userMessageContent,
			images: userImages,
			timestamp: Date.now()
		})

		// 调用新增用户信息 api
		try {
			const res = await addMessageApi({
				receiverId: '-1',
				content: userMessageContent,
				type: 1, // ai对话
				image: userImages,
				conversationId: conversationId.value,
			})
		} catch (e) {
			console.error('保存用户消息失败:', e)
		}

		// 清空输入框和图片
		inputMessage.value = ''
		selectedImages.value = []

		// 设置AI回复状态
		isAiReplying.value = true
		
		// 生成唯一ID用于标识当前AI消息
		const aiMessageId = 'ai_' + Date.now()
		currentAiMessageId.value = aiMessageId

		// 添加AI消息项（用于流式更新）
		const aiMessage = {
			id: aiMessageId,
			type: 'ai',
			content: '',
			isThinking: true, // 标记为正在思考中
			timestamp: Date.now()
		}
		messageHistory.value.push(aiMessage)
		
		// 立即滚动到底部
		scrollToBottom()

		// 调用AI对话API（流式版本）
		try {
			const data = {
				model: 'doubao-seed-1-6-251015',
				max_output_tokens: 500,
				stream: true,
				input: [{
					role: 'user',
					content: [{
						type: 'input_text',
						text: userMessageContent,
					}],
				}],
				thinking: {
					type: 'disabled',
				},
			}

			// 使用 fetch API 处理流式响应
			const controller = new AbortController();
			const signal = controller.signal;
			
			// 保存 abort controller 用于中断
			lastRequestTask.value = controller
			
			console.log('开始发送AI请求...');
			
			const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/responses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer 465681b3-efb8-417a-af6f-2853a244dca6', // 注意：这里应该用你的token
				},
				body: JSON.stringify(data),
				signal: signal
			})

			if (!response.ok || !response.body) {
				throw new Error(`请求失败: ${response.status} ${response.statusText}`)
			}

			const reader = response.body.getReader()
			const decoder = new TextDecoder('utf-8')
			let buffer = ''
			let aiResponseContent = ''

			try {
				while (true) {
					const {
						done,
						value
					} = await reader.read()
					if (done) {
						console.log('流式请求完成');
						break;
					}

					// 将二进制数据解码为字符串
					const chunk = decoder.decode(value, { stream: true })
					buffer += chunk
					
					// 调试：打印原始数据
					// console.log('收到原始数据:', chunk);

					// 按行分割处理SSE格式
					const lines = buffer.split('\n')
					buffer = lines.pop() || '' // 最后一行可能不完整，留到下次处理

					for (const line of lines) {
						if (line.trim() === '') continue // 跳过空行
						
						if (line.startsWith('data: ')) {
							const dataStr = line.substring(6) // 去掉 "data: "
							if (dataStr.trim()) {
								try {
									const eventData = JSON.parse(dataStr)
									console.log('解析到事件:', eventData.type);
									
									// 处理文本增量
									if (eventData.type === 'response.output_text.delta' && eventData.delta) {
										aiResponseContent += eventData.delta
										console.log('收到文本增量:', eventData.delta);
										
										// 更新AI消息内容
										const aiMessageIndex = messageHistory.value.findIndex(msg => msg.id === aiMessageId)
										if (aiMessageIndex !== -1) {
											messageHistory.value[aiMessageIndex].content = aiResponseContent
											messageHistory.value[aiMessageIndex].isThinking = false
											// 实时滚动
											scrollToBottom()
										}
									}
									// 处理响应完成
									if (eventData.type === 'response.completed') {
										console.log('AI回复完成:', eventData);
										// 保存AI回复的完整id
										if (eventData.response && eventData.response.id) {
											previous_response_id.value = eventData.response.id
										}
										// 调用新增信息api保存完整回复
										try {
											await addMessageApi({
												receiverId: uni.getStorageSync('user')._id || '',
												content: aiResponseContent,
												type: 1, // ai对话
												conversationId: conversationId.value,
												senderId: '-1'
											})
											console.log('AI消息保存成功');
										} catch (e) {
											console.error('保存AI消息失败:', e)
										}
										imageList.value = []
									}
								} catch (e) {
									console.warn('解析JSON失败:', e, '原始数据:', dataStr)
								}
							}
						}
					}
				}
			} finally {
				reader.releaseLock()
			}

		} catch (err) {
			// 处理中断错误
			if (err.name === 'AbortError') {
				console.log('请求已被用户中断')
				// 如果AI消息是空的，移除它
				const aiMessageIndex = messageHistory.value.findIndex(msg => msg.id === aiMessageId)
				if (aiMessageIndex !== -1 && (!messageHistory.value[aiMessageIndex].content || messageHistory.value[aiMessageIndex].content === '')) {
					messageHistory.value.splice(aiMessageIndex, 1)
				}
				return
			}
			
			// 移除正在生成的AI消息
			const aiMessageIndex = messageHistory.value.findIndex(msg => msg.id === aiMessageId)
			if (aiMessageIndex !== -1 && (!messageHistory.value[aiMessageIndex].content || messageHistory.value[aiMessageIndex].content === '')) {
				messageHistory.value.splice(aiMessageIndex, 1)
				uni.showToast({
					title: 'AI回复失败，请重试',
					icon: 'none'
				})
			}
			
			console.error('AI对话错误:', err)
		} finally {
			isAiReplying.value = false
			currentAiMessageId.value = ''
			lastRequestTask.value = null
			scrollToBottom()
		}
	}

	// 滚动到底部
	const scrollToBottom = () => {
		nextTick(() => {
			setTimeout(() => {
				scrollTop.value = Math.random() * 10000 // 随机值强制刷新滚动
			}, 50)
		})
	}

	// 移除图片
	const removeImage = (index) => {
		selectedImages.value.splice(index, 1)
	}

	// 预览图片
	const previewImage = (images, currentIndex) => {
		uni.previewImage({
			urls: images,
			current: currentIndex
		})
	}

	// 文件操作函数
	const takePhoto = () => {
		uni.chooseImage({
			count: 3 - selectedImages.value.length, // 最多9张图片
			sizeType: ['compressed'],
			sourceType: ['camera'],
			success: (res) => {

				selectedImages.value = selectedImages.value.concat(res.tempFilePaths)
				showFileOptions.value = false
				scrollToBottom()
			},
			fail: (err) => {
				if (err.errMsg.includes('cancel')) return
				uni.showToast({
					title: '拍照失败',
					icon: 'none'
				})
			}
		})
	}

	const chooseFromAlbum = () => {
		uni.chooseImage({
			count: 1 - selectedImages.value.length, // 最多1张图片
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: async (res) => {
				//调用 文件上传 API
				try {
					uni.showLoading({
						mask: true
					})
					uni.uploadFile({
						url: 'http://hkone.mnt.mhnode.cn:54750/stall/upload/image',
						name: 'file',
						filePath: res.tempFiles[0].path,
						header: {
							'Authorization': 'Bearer ' + uni.getStorageSync('token') || ''
						},
						success: (res) => {
							if (res.statusCode >= 200 && res.statusCode < 400) {
								const data = JSON.parse(res.data)
								if (data.errno === 0) {
									imageList.value.push(data.data.url)
									uni.showToast({
										title: '上传成功',
										icon: 'success'
									})
								} else {
									uni.showToast({
										title: '上传失败',
										icon: 'none'
									})
								}
							} else {
								uni.showToast({
									title: '上传失败',
									icon: 'none'
								})
							}
						},
						complete: () => {
							uni.hideLoading()
						}
					})
				} catch (err) {
					uni.showToast({
						title: '图片上传失败'
					})
				}
				selectedImages.value = selectedImages.value.concat(res.tempFilePaths)
				showFileOptions.value = false
				scrollToBottom()
			},
			fail: (err) => {
				if (err.errMsg.includes('cancel')) return
				uni.showToast({
					title: '选择图片失败',
					icon: 'none'
				})
			}
		})
	}

	const chooseLocalFile = () => {
		uni.showToast({
			title: '选择本地文件',
			icon: 'none'
		})
		showFileOptions.value = false
	}

	const chooseWechatFile = () => {
		uni.showToast({
			title: '选择微信文件',
			icon: 'none'
		})
		showFileOptions.value = false
	}

	// 加载对话历史
	const loadChatHistory = async (id) => {
		conversationId.value = id
		messageHistory.value = []
		flag.value = false
		try {
			const res = await getMessagesApi(id)
			if (res.errno == 0) {
				res.data.forEach((item) => {
					//判断是不是ai
					messageHistory.value.push({
						type: item.senderId == '-1' ? 'ai' : 'user',
						content: item.content,
						images: item.image ? [...item.image] : [], // 复制图片数组
						timestamp: item.createdAt || Date.now()
					})
				})
				// 滚动到底部
				setTimeout(() => {
					scrollToBottom()
				}, 100)
			}
		} catch (e) {
			uni.showToast({
				title: '获取历史记录列表失败'
			})
		}

		showChatHistory.value = false
	}

	// 语音输入相关方法
	const startVoiceRecording = () => {
		isVoiceRecording.value = true
		voiceInputText.value = '正在录音...'

		// 开始波形动画
		startWaveAnimation()

		// 模拟语音识别过程
		voiceRecordingTimer = setTimeout(() => {
			// 模拟识别结果
			const simulatedText = '这是一条模拟的语音识别结果'
			inputMessage.value = simulatedText
			voiceInputText.value = '识别完成，点击发送'

			// 停止录音
			stopVoiceRecording()
		}, 3000) // 3秒后模拟识别完成
	}

	const stopVoiceRecording = () => {
		isVoiceRecording.value = false
		voiceInputText.value = '长按输入框进行语音输入'

		// 清除定时器
		if (voiceRecordingTimer) {
			clearTimeout(voiceRecordingTimer)
			voiceRecordingTimer = null
		}

		// 停止波形动画
		stopWaveAnimation()
	}

	const cancelVoiceRecording = () => {
		isVoiceRecording.value = false
		voiceInputText.value = '长按输入框进行语音输入'

		// 清除定时器
		if (voiceRecordingTimer) {
			clearTimeout(voiceRecordingTimer)
			voiceRecordingTimer = null
		}

		// 停止波形动画
		stopWaveAnimation()
	}

	// 波形动画
	const startWaveAnimation = () => {
		// 这里可以添加更复杂的波形动画逻辑
		waveAnimationInterval = setInterval(() => {
			// 波形动画逻辑
		}, 200)
	}

	const stopWaveAnimation = () => {
		if (waveAnimationInterval) {
			clearInterval(waveAnimationInterval)
			waveAnimationInterval = null
		}
	}

	// 获取波形样式
	const getWaveStyle = (index) => {
		const height = 20 + Math.random() * 30
		return {
			height: `${height}%`,
			animationDelay: `${index * 0.1}s`
		}
	}
</script>

<style lang="scss" scoped>
	.chat-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		position: relative;
	}

	/* 导航栏 */
	.uni-nav-bar {
		/* 确保导航栏正常显示 */
	}
	
	.left-section {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.back-btn {
		width: 60rpx;
		height: 60rpx;
		border-radius: 12rpx;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		font-size: 40rpx;
		color: #333;
		font-weight: bold;
	}

	.ai-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.right-section {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}

	.nav-btn {
		width: 60rpx;
		height: 60rpx;
		border-radius: 12rpx;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.nav-btn:active {
		background-color: #e0e0e0;
		transform: scale(0.95);
	}

	.nav-icon {
		font-size: 28rpx;
		color: #333;
	}

	.playing {
		color: #007aff;
	}

	/* 聊天内容区域 */
	.chat-content {
		flex: 1;
		overflow: hidden;
		padding: 0 30rpx;
	}

	.message-scroll {
		height: 100%;
		padding: 30rpx 0;
	}

	.message-item {
		display: flex;
		margin-bottom: 40rpx;
		align-items: flex-start;
	}

	.ai-message {
		justify-content: flex-start;
	}

	.user-message {
		justify-content: flex-end;
	}

	/* 机器人容器 */
	.robot-container {
		position: relative;
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.robot-icon {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	/* 机器人光晕效果 */
	.robot-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, rgba(0, 122, 255, 0.2) 0%, rgba(0, 122, 255, 0) 70%);
		border-radius: 50%;
		z-index: 1;
		animation: pulse 2s infinite;
	}

	/* 机器人悬停效果 */
	.robot-container:hover .robot-icon {
		transform: scale(1.05) rotate(5deg);
		filter: drop-shadow(0 6rpx 12rpx rgba(0, 122, 255, 0.5));
	}

	@keyframes pulse {
		0% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(0.95);
		}

		50% {
			opacity: 0.8;
			transform: translate(-50%, -50%) scale(1.05);
		}

		100% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(0.95);
		}
	}

	/* 消息气泡 */
	.message-bubble {
		max-width: 70%;
		padding: 24rpx 32rpx;
		border-radius: 24rpx;
		position: relative;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
		min-height: 60rpx;
		display: flex;
		align-items: center;
	}

	.ai-bubble {
		background-color: #fff;
		border-top-left-radius: 8rpx;
		margin-left: 10rpx;
		border: 1rpx solid #eee;
	}

	.user-bubble {
		background-color: #f0f0f0;
		border-top-right-radius: 8rpx;
		margin-right: 10rpx;
	}

	/* 气泡箭头 */
	.bubble-arrow {
		position: absolute;
		left: -16rpx;
		top: 24rpx;
		width: 0;
		height: 0;
		border-top: 12rpx solid transparent;
		border-bottom: 12rpx solid transparent;
		border-right: 16rpx solid #fff;
	}

	.message-text {
		font-size: 30rpx;
		line-height: 1.5;
		color: #333;
		word-break: break-word;
	}

	/* AI消息内容容器 */
	.ai-message-content {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.empty-message {
		font-size: 30rpx;
		color: #999;
		font-style: italic;
	}

	/* 用户消息内容样式 */
	.user-message-content {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		width: 100%;
	}

	/* 图片预览容器 */
	.image-preview-container {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
		margin-bottom: 10rpx;
	}

	.image-preview {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		overflow: hidden;
		position: relative;
	}

	.preview-image {
		width: 100%;
		height: 100%;
	}

	/* AI输入中指示器 */
	.typing-indicator {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 16rpx 0;
	}

	.typing-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background-color: #999;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-dot:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-dot:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes typing {
		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}

		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* 输入区域 */
	.input-section {
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #eee;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	/* 图片预览区域 */
	.image-preview-area {
		margin-bottom: 20rpx;
		padding: 15rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.image-preview-scroll {
		white-space: nowrap;
		height: 120rpx;
	}

	.preview-item {
		display: inline-block;
		width: 100rpx;
		height: 100rpx;
		margin-right: 15rpx;
		position: relative;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.preview-thumb {
		width: 100%;
		height: 100%;
	}

	.remove-btn {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: #ff3b30;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: bold;
	}

	.input-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.input-box {
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		border-radius: 40rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.message-input {
		width: 100%;
		height: 80rpx;
		font-size: 30rpx;
		color: #333;
		background: transparent;
		border: none;
		outline: none;
		padding: 0 28rpx;
		box-sizing: border-box;
	}

	/* 语音输入样式 */
	.voice-input-container {
		width: 100%;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: black;
		transition: all 0.3s ease;
	}

	.voice-input-container.voice-active {
		background-color: #f0f0f0;
	}

	.voice-input-inner {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.voice-wave {
		display: flex;
		align-items: center;
		gap: 6rpx;
		height: 40rpx;
	}

	.wave-bar {
		width: 4rpx;
		background-color: #717171;
		border-radius: 2rpx;
		animation: wave 1s infinite ease-in-out;
	}

	@keyframes wave {
		0%,
		100% {
			transform: scaleY(0.5);
			opacity: 0.7;
		}

		50% {
			transform: scaleY(1);
			opacity: 1;
		}
	}

	.voice-input-text {
		font-size: 30rpx;
		color: #666;
		transition: color 0.3s ease;
	}

	.voice-input-container.voice-active .voice-input-text {
		color: #717171;
	}

	.input-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 15rpx;
		margin-top: 20rpx;
		padding: 0 20rpx 20rpx;
	}

	.action-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		padding: 20rpx 0 0;
	}

	.action-btn,
	.input-action-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.action-btn:active,
	.input-action-btn:active {
		background-color: #e0e0e0;
		transform: scale(0.95);
	}

	.btn-icon,
	.action-icon {
		font-size: 32rpx;
		color: #333;
	}

	/* 语音输入按钮样式 */
	.voice-btn {
		background-color: #f0f0f0;
	}

	.voice-btn .btn-icon,
	.voice-btn .action-icon {
		color: #333;
	}

	.voice-btn.active {
		background-color: #f0f0f0;
	}

	.voice-btn.active .btn-icon,
	.voice-btn.active .action-icon {
		color: #333;
	}

	/* 文件上传图标样式 */
	.file-upload-icon {
		width: 40rpx;
		height: 40rpx;
		border-radius: 12rpx;
		border: 2rpx solid #333;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.file-icon-inner {
		font-size: 24rpx;
		color: #333;
		font-weight: bold;
	}

	/* 发送按钮样式 */
	.send-btn {
		background-color: #f0f0f0;
	}

	.send-btn .send-icon {
		color: #ccc;
	}

	.send-btn.active {
		background-color: #333;
	}

	.send-btn.active .send-icon {
		color: #fff;
	}

	.send-btn.stop-btn {
		background-color: #333;
		border-radius: 12rpx;
	}

	.send-btn.stop-btn .send-icon {
		color: #fff;
		font-size: 28rpx;
	}

	/* 文件上传选项 */
	.file-options {
		display: flex;
		justify-content: space-around;
		padding: 30rpx 0;
		border-top: 1rpx solid #eee;
		margin-top: 20rpx;
	}

	.file-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	.file-icon-container {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.file-icon-container:active {
		background-color: #e0e0e0;
		transform: scale(0.95);
	}

	.wechat-container {
		background-color: rgba(7, 193, 96, 0.1);
	}

	.file-icon {
		font-size: 36rpx;
	}

	.wechat-icon {
		color: #07c160;
	}

	.file-text {
		font-size: 24rpx;
		color: #666;
	}

	/* 对话历史侧边栏 */
	.history-sidebar {
		position: fixed;
		top: 0;
		right: -450rpx;
		width: 450rpx;
		height: 100%;
		background-color: #fff;
		box-shadow: -4rpx 0 20rpx rgba(0, 0, 0, 0.1);
		z-index: 100;
		transition: right 0.3s ease;
		display: flex;
		flex-direction: column;
		padding-top: var(--status-bar-height, 0);
	}

	.history-sidebar.active {
		right: 0;
	}

	.sidebar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 100rpx 25rpx 30rpx;
		border-bottom: 1rpx solid #eee;
		min-height: 80rpx;
		flex-shrink: 0;
		position: relative;
	}

	.sidebar-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.close-btn {
		width: 56rpx;
		height: 56rpx;
		border-radius: 12rpx;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		position: relative;
		z-index: 101;
		position: absolute;
		bottom: 5rpx;
		right: 25rpx;
	}

	.close-btn:active {
		background-color: #e0e0e0;
		transform: scale(0.95);
	}

	.close-icon {
		font-size: 34rpx;
		color: #333;
		font-weight: bold;
	}

	.history-list {
		flex: 1;
		padding: 20rpx 0;
		height: 100%;
		overflow-y: auto;
	}

	.history-item {
		padding: 25rpx;
		border-bottom: 1rpx solid #f0f0f0;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 12rpx;
		margin: 0 15rpx 10rpx;
	}

	.history-item:active {
		background-color: #f9f9f9;
		transform: scale(0.98);
	}

	.history-preview {
		display: block;
		font-size: 26rpx;
		color: #333;
		margin-bottom: 8rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.history-time {
		font-size: 22rpx;
		color: #999;
	}

	/* 侧边栏遮罩 */
	.sidebar-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}
</style>