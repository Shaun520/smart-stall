<template>
	<view class="container">
		<!-- 头部栏 -->
		<uni-nav-bar
			shadow
			status-bar
			left-icon="left"
			title="编辑海报"
			@clickLeft="goBack"
			:fixed="true"
		>
			<template #right>
				<view class="nav-right">
					<uni-icons 
						type="eye" 
						size="20" 
						@click="previewPoster"
					></uni-icons>
					<uni-icons 
						type="help" 
						size="20" 
						style="margin-left: 20rpx;"
						@click="showHelp"
					></uni-icons>
				</view>
			</template>
		</uni-nav-bar>
		
		<scroll-view class="content" scroll-y>
			<!-- 海报预览区域 -->
			<view class="preview-section">
				<view class="preview-container" :style="{height: canvasHeight + 'rpx'}">
					<view class="preview-image" :style="{backgroundColor: backgroundColor}">
						<!-- 可编辑元素 -->
						<view 
							v-for="element in elements" 
							:key="element.id"
							class="edit-element"
							:class="{active: activeElementId === element.id}"
							:style="getElementStyle(element)"
							@click="setActiveElement(element.id)"
							@touchstart="onTouchStart"
							@touchmove="onTouchMove"
							@touchend="onTouchEnd"
						>
							<text class="edit-text">{{ element.text }}</text>
						</view>
					</view>
				</view>
				
				<view class="preview-tips">
					<text>点击文字区域进行编辑，拖动调整位置</text>
				</view>
			</view>
			
			<!-- 编辑工具栏 -->
			<view class="tools-section">
				<view class="tools-tabs">
					<view 
						class="tool-tab"
						:class="{active: activeTab === 'text'}"
						@click="activeTab = 'text'"
					>
						<text>文字</text>
					</view>
					<view 
						class="tool-tab"
						:class="{active: activeTab === 'style'}"
						@click="activeTab = 'style'"
					>
						<text>样式</text>
					</view>
					<view 
						class="tool-tab"
						:class="{active: activeTab === 'element'}"
						@click="activeTab = 'element'"
					>
						<text>元素</text>
					</view>
					<view 
						class="tool-tab"
						:class="{active: activeTab === 'background'}"
						@click="activeTab = 'background'"
					>
						<text>背景</text>
					</view>
				</view>
				
				<view class="tools-content">
					<!-- 文字编辑 -->
					<view v-if="activeTab === 'text'" class="tool-group">
						<view class="tool-group-title">
							<text>文字样式</text>
						</view>
						<view class="tool-options">
							<view 
								class="tool-option"
								:class="{active: activeElement?.bold}"
								@click="toggleTextStyle('bold')"
							>
								<view class="tool-icon">
									<text style="font-weight: bold;">B</text>
								</view>
								<text class="tool-name">加粗</text>
							</view>
							<view 
								class="tool-option"
								:class="{active: activeElement?.italic}"
								@click="toggleTextStyle('italic')"
							>
								<view class="tool-icon">
									<text style="font-style: italic;">I</text>
								</view>
								<text class="tool-name">斜体</text>
							</view>
							<view 
								class="tool-option"
								:class="{active: activeElement?.underline}"
								@click="toggleTextStyle('underline')"
							>
								<view class="tool-icon">
									<text style="text-decoration: underline;">U</text>
								</view>
								<text class="tool-name">下划线</text>
							</view>
						</view>
					</view>
					
					<!-- 样式编辑 -->
					<view v-if="activeTab === 'style'" class="tool-group">
						<view class="tool-group-title">
							<text>字体</text>
						</view>
						<view class="font-options">
							<view 
								class="font-option"
								:class="{active: activeElement?.fontFamily === 'Arial'}"
								@click="setFontFamily('Arial')"
								style="font-family: Arial;"
							>
								<text>Arial</text>
							</view>
							<view 
								class="font-option"
								:class="{active: activeElement?.fontFamily === 'SimSun'}"
								@click="setFontFamily('SimSun')"
								style="font-family: SimSun;"
							>
								<text>宋体</text>
							</view>
							<view 
								class="font-option"
								:class="{active: activeElement?.fontFamily === 'Microsoft YaHei'}"
								@click="setFontFamily('Microsoft YaHei')"
								style="font-family: Microsoft YaHei;"
							>
								<text>微软雅黑</text>
							</view>
						</view>
						
						<view class="tool-group-title" style="margin-top: 30rpx;">
							<text>颜色</text>
						</view>
						<view class="color-palette">
							<view 
								v-for="color in colors" 
								:key="color"
								class="color-option"
								:class="{active: activeElement?.color === color}"
								:style="{backgroundColor: color}"
								@click="setTextColor(color)"
							></view>
						</view>
					</view>
					
					<!-- 元素编辑 -->
					<view v-if="activeTab === 'element'" class="tool-group">
						<view class="tool-group-title">
							<text>添加元素</text>
						</view>
						<view class="tool-options">
							<view class="tool-option" @click="addTextElement">
								<view class="tool-icon">
									<text>T</text>
								</view>
								<text class="tool-name">文字</text>
							</view>
							<view class="tool-option" @click="addImageElement">
								<view class="tool-icon">
									<uni-icons type="image" size="20" color="#666"></uni-icons>
								</view>
								<text class="tool-name">图片</text>
							</view>
							<view class="tool-option" @click="addShapeElement">
								<view class="tool-icon">
									<uni-icons type="square" size="20" color="#666"></uni-icons>
								</view>
								<text class="tool-name">形状</text>
							</view>
							<view class="tool-option" @click="addQrCodeElement">
								<view class="tool-icon">
									<uni-icons type="scan" size="20" color="#666"></uni-icons>
								</view>
								<text class="tool-name">二维码</text>
							</view>
						</view>
					</view>
					
					<!-- 背景编辑 -->
					<view v-if="activeTab === 'background'" class="tool-group">
						<view class="tool-group-title">
							<text>背景颜色</text>
						</view>
						<view class="color-palette">
							<view 
								v-for="color in bgColors" 
								:key="color"
								class="color-option"
								:class="{active: backgroundColor === color}"
								:style="{backgroundColor: color}"
								@click="setBackgroundColor(color)"
							></view>
						</view>
						
						<view class="tool-group-title" style="margin-top: 30rpx;">
							<text>背景图片</text>
						</view>
						<view class="tool-options">
							<view class="tool-option" @click="selectBackgroundImage">
								<view class="tool-icon">
									<uni-icons type="folder" size="20" color="#666"></uni-icons>
								</view>
								<text class="tool-name">从相册</text>
							</view>
							<view class="tool-option" @click="selectTemplateBackground">
								<view class="tool-icon">
									<uni-icons type="list" size="20" color="#666"></uni-icons>
								</view>
								<text class="tool-name">模板</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 属性面板 -->
			<view class="property-panel" v-if="activeElement">
				<view class="property-group">
					<view class="property-title">
						<text>文字内容</text>
					</view>
					<textarea 
						class="text-input" 
						v-model="activeElement.text" 
						placeholder="请输入文字内容"
						maxlength="100"
					></textarea>
				</view>
				
				<view class="property-group">
					<view class="property-title">
						<text>字体大小</text>
						<text class="slider-value">{{ activeElement.fontSize }}px</text>
					</view>
					<slider 
						:value="activeElement.fontSize" 
						min="12" 
						max="72" 
						@change="onFontSizeChange"
						activeColor="#5A78EA"
					/>
				</view>
				
				<view class="property-group">
					<view class="property-title">
						<text>对齐方式</text>
					</view>
					<view class="align-options">
						<view 
							class="align-option"
							:class="{active: activeElement.align === 'left'}"
							@click="setTextAlign('left')"
						>
							<uni-icons type="align-left" size="16" color="#666"></uni-icons>
							<text>左对齐</text>
						</view>
						<view 
							class="align-option"
							:class="{active: activeElement.align === 'center'}"
							@click="setTextAlign('center')"
						>
							<uni-icons type="align-center" size="16" color="#666"></uni-icons>
							<text>居中</text>
						</view>
						<view 
							class="align-option"
							:class="{active: activeElement.align === 'right'}"
							@click="setTextAlign('right')"
						>
							<uni-icons type="align-right" size="16" color="#666"></uni-icons>
							<text>右对齐</text>
						</view>
					</view>
				</view>
				
				<view class="property-group">
					<view class="property-title">
						<text>位置和大小</text>
					</view>
					<view class="position-controls">
						<view class="position-item">
							<text class="position-label">X: {{ activeElement.x }}px</text>
							<slider 
								:value="activeElement.x" 
								min="0" 
								max="300" 
								@change="onPositionXChange"
								activeColor="#5A78EA"
							/>
						</view>
						<view class="position-item">
							<text class="position-label">Y: {{ activeElement.y }}px</text>
							<slider 
								:value="activeElement.y" 
								min="0" 
								max="400" 
								@change="onPositionYChange"
								activeColor="#5A78EA"
							/>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<button class="btn btn-outline" @click="resetChanges">
				<uni-icons type="refresh" size="18" color="#5A78EA"></uni-icons>
				<text>重置</text>
			</button>
			<button class="btn btn-primary" @click="savePoster">
				<uni-icons type="checkmark" size="18" color="#fff"></uni-icons>
				<text>保存海报</text>
			</button>
		</view>
		
		<!-- 加载状态 -->
		<view class="loading-mask" v-if="loading">
			<view class="loading-content">
				<uni-icons type="spinner-cycle" size="32" color="#5A78EA" class="loading-icon"></uni-icons>
				<text>生成中...</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 响应式数据
const activeTab = ref('text')
const activeElementId = ref(null)
const loading = ref(false)
const canvasHeight = ref(600)
const backgroundColor = ref('#ffffff')

// 颜色选项
const colors = ref([
	'#333333', '#666666', '#999999', '#cccccc',
	'#ff4d4f', '#fa541c', '#fa8c16', '#faad14',
	'#a0d911', '#52c41a', '#13c2c2', '#1890ff',
	'#2f54eb', '#722ed1', '#eb2f96'
])

const bgColors = ref([
	'#ffffff', '#f5f5f5', '#e6f7ff', '#f6ffed',
	'#fff7e6', '#fff2e8', '#f9f0ff', '#f0f5ff'
])

// 海报元素数据
const elements = ref([
	{
		id: 1,
		type: 'text',
		text: '点击编辑标题',
		x: 50,
		y: 50,
		width: 200,
		height: 40,
		color: '#333333',
		fontSize: 24,
		fontFamily: 'Microsoft YaHei',
		align: 'center',
		bold: true,
		italic: false,
		underline: false
	},
	{
		id: 2,
		type: 'text',
		text: '点击编辑副标题',
		x: 50,
		y: 100,
		width: 200,
		height: 30,
		color: '#666666',
		fontSize: 16,
		fontFamily: 'Microsoft YaHei',
		align: 'center',
		bold: false,
		italic: false,
		underline: false
	}
])

// 计算当前激活的元素
const activeElement = computed(() => {
	return elements.value.find(el => el.id === activeElementId.value)
})

// 触摸相关变量
const touchStart = ref({ x: 0, y: 0 })
const isDragging = ref(false)

onLoad((options) => {
	// 如果有传递的海报ID，加载对应数据
	if (options.id) {
		loadPosterData(options.id)
	}
})

// 加载海报数据
const loadPosterData = (id) => {
	// 这里调用API加载海报数据
	console.log('加载海报数据:', id)
}

// 获取元素样式
const getElementStyle = (element) => {
	return {
		top: element.y + 'px',
		left: element.x + 'px',
		width: element.width + 'px',
		height: element.height + 'px',
		color: element.color,
		'font-size': element.fontSize + 'px',
		'font-family': element.fontFamily,
		'text-align': element.align,
		'font-weight': element.bold ? 'bold' : 'normal',
		'font-style': element.italic ? 'italic' : 'normal',
		'text-decoration': element.underline ? 'underline' : 'none',
		'line-height': element.fontSize + 'px'
	}
}

// 设置激活元素
const setActiveElement = (id) => {
	activeElementId.value = id
}

// 文字样式切换
const toggleTextStyle = (style) => {
	if (!activeElement.value) return
	
	switch (style) {
		case 'bold':
			activeElement.value.bold = !activeElement.value.bold
			break
		case 'italic':
			activeElement.value.italic = !activeElement.value.italic
			break
		case 'underline':
			activeElement.value.underline = !activeElement.value.underline
			break
	}
}

// 设置字体
const setFontFamily = (fontFamily) => {
	if (activeElement.value) {
		activeElement.value.fontFamily = fontFamily
	}
}

// 设置文字颜色
const setTextColor = (color) => {
	if (activeElement.value) {
		activeElement.value.color = color
	}
}

// 设置背景颜色
const setBackgroundColor = (color) => {
	backgroundColor.value = color
}

// 添加文字元素
const addTextElement = () => {
	const newElement = {
		id: Date.now(),
		type: 'text',
		text: '新文字',
		x: 50,
		y: 200 + elements.value.length * 60,
		width: 200,
		height: 40,
		color: '#333333',
		fontSize: 20,
		fontFamily: 'Microsoft YaHei',
		align: 'center',
		bold: false,
		italic: false,
		underline: false
	}
	elements.value.push(newElement)
	activeElementId.value = newElement.id
}

// 添加图片元素
const addImageElement = () => {
	uni.chooseImage({
		count: 1,
		success: (res) => {
			const newElement = {
				id: Date.now(),
				type: 'image',
				src: res.tempFilePaths[0],
				x: 50,
				y: 200 + elements.value.length * 60,
				width: 100,
				height: 100
			}
			elements.value.push(newElement)
			activeElementId.value = newElement.id
		}
	})
}

// 添加形状元素
const addShapeElement = () => {
	const newElement = {
		id: Date.now(),
		type: 'shape',
		shape: 'rect',
		color: '#5A78EA',
		x: 50,
		y: 200 + elements.value.length * 60,
		width: 100,
		height: 100
	}
	elements.value.push(newElement)
	activeElementId.value = newElement.id
}

// 添加二维码元素
const addQrCodeElement = () => {
	const newElement = {
		id: Date.now(),
		type: 'qrcode',
		content: 'https://example.com',
		x: 50,
		y: 200 + elements.value.length * 60,
		width: 100,
		height: 100
	}
	elements.value.push(newElement)
	activeElementId.value = newElement.id
}

// 字体大小改变
const onFontSizeChange = (e) => {
	if (activeElement.value) {
		activeElement.value.fontSize = e.detail.value
		activeElement.value.height = activeElement.value.fontSize + 20
	}
}

// X位置改变
const onPositionXChange = (e) => {
	if (activeElement.value) {
		activeElement.value.x = e.detail.value
	}
}

// Y位置改变
const onPositionYChange = (e) => {
	if (activeElement.value) {
		activeElement.value.y = e.detail.value
	}
}

// 设置文字对齐
const setTextAlign = (align) => {
	if (activeElement.value) {
		activeElement.value.align = align
	}
}

// 触摸开始
const onTouchStart = (e) => {
	if (!activeElement.value) return
	
	touchStart.value = {
		x: e.touches[0].clientX,
		y: e.touches[0].clientY,
		elementX: activeElement.value.x,
		elementY: activeElement.value.y
	}
	isDragging.value = true
}

// 触摸移动
const onTouchMove = (e) => {
	if (!isDragging.value || !activeElement.value) return
	
	const deltaX = e.touches[0].clientX - touchStart.value.x
	const deltaY = e.touches[0].clientY - touchStart.value.y
	
	activeElement.value.x = Math.max(0, Math.min(300, touchStart.value.elementX + deltaX))
	activeElement.value.y = Math.max(0, Math.min(400, touchStart.value.elementY + deltaY))
}

// 触摸结束
const onTouchEnd = () => {
	isDragging.value = false
}

// 选择背景图片
const selectBackgroundImage = () => {
	uni.chooseImage({
		count: 1,
		success: (res) => {
			// 这里处理背景图片设置
			uni.showToast({
				title: '背景图片已选择',
				icon: 'success'
			})
		}
	})
}

// 选择模板背景
const selectTemplateBackground = () => {
	uni.navigateTo({
		url: '/pages/poster/templates'
	})
}

// 预览海报
const previewPoster = () => {
	uni.showModal({
		title: '预览功能',
		content: '这里将显示海报的预览效果',
		showCancel: false
	})
}

// 显示帮助
const showHelp = () => {
	uni.navigateTo({
		url: '/pages/poster/help'
	})
}

// 重置更改
const resetChanges = () => {
	uni.showModal({
		title: '确认重置',
		content: '确定要重置所有更改吗？',
		success: (res) => {
			if (res.confirm) {
				// 重置逻辑
				elements.value = elements.value.map(el => ({ ...el }))
				uni.showToast({
					title: '已重置',
					icon: 'success'
				})
			}
		}
	})
}

// 保存海报
const savePoster = () => {
	loading.value = true
	
	// 模拟保存过程
	setTimeout(() => {
		loading.value = false
		uni.showToast({
			title: '保存成功',
			icon: 'success'
		})
		
		// 返回上一页
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}, 2000)
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
	display: flex;
	align-items: center;
}

.content {
	height: calc(100vh - 100rpx);
}

.preview-section {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.preview-container {
	position: relative;
	background: #f8f8f8;
	border-radius: 12rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.preview-image {
	width: 100%;
	height: 100%;
	position: relative;
}

.edit-element {
	position: absolute;
	border: 1rpx dashed transparent;
	padding: 10rpx;
	min-width: 100rpx;
	min-height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&.active {
		border-color: #5A78EA;
		background: rgba(90, 120, 234, 0.1);
	}
}

.edit-text {
	word-break: break-word;
	text-align: center;
}

.preview-tips {
	font-size: 24rpx;
	color: #999;
	text-align: center;
}

.tools-section {
	background: #fff;
	padding: 20rpx 30rpx;
	margin-bottom: 20rpx;
}

.tools-tabs {
	display: flex;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx;
}

.tool-tab {
	flex: 1;
	text-align: center;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
	
	&.active {
		color: #5A78EA;
		font-weight: 500;
	}
	
	&.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		background: #5A78EA;
		border-radius: 2rpx;
	}
}

.tools-content {
	min-height: 200rpx;
}

.tool-group {
	margin-bottom: 30rpx;
}

.tool-group-title {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 20rpx;
}

.tool-options {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.tool-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 120rpx;
	
	.tool-icon {
		width: 80rpx;
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 10rpx;
	}
	
	&.active .tool-icon {
		background: #e6eeff;
		color: #5A78EA;
	}
	
	.tool-name {
		font-size: 22rpx;
		color: #666;
	}
	
	&.active .tool-name {
		color: #5A78EA;
	}
}

.color-palette {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.color-option {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	border: 2rpx solid #f0f0f0;
	
	&.active {
		border-color: #5A78EA;
		transform: scale(1.1);
	}
}

.font-options {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.font-option {
	width: 120rpx;
	height: 80rpx;
	background: #f5f5f5;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	
	&.active {
		background: #e6eeff;
		color: #5A78EA;
	}
}

.property-panel {
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.property-group {
	margin-bottom: 30rpx;
}

.property-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.slider-value {
	min-width: 60rpx;
	text-align: center;
	font-size: 24rpx;
	color: #999;
}

.text-input {
	width: 100%;
	padding: 20rpx;
	border: 1rpx solid #f0f0f0;
	border-radius: 8rpx;
	font-size: 28rpx;
	min-height: 120rpx;
}

.align-options {
	display: flex;
	gap: 20rpx;
}

.align-option {
	flex: 1;
	height: 60rpx;
	background: #f5f5f5;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	font-size: 24rpx;
	
	&.active {
		background: #e6eeff;
		color: #5A78EA;
	}
}

.position-controls {
	.position-item {
		margin-bottom: 20rpx;
		
		.position-label {
			font-size: 24rpx;
			color: #999;
			margin-bottom: 10rpx;
			display: block;
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
	display: flex;
	gap: 20rpx;
	
	.btn {
		flex: 1;
		height: 80rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		font-size: 28rpx;
		border: none;
		
		&.btn-primary {
			background: #5A78EA;
			color: #fff;
		}
		
		&.btn-outline {
			background: #fff;
			color: #5A78EA;
			border: 1rpx solid #5A78EA;
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

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>