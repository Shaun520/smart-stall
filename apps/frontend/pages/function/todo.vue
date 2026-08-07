<template>
	<view class="todo-container">
		<!-- 导航栏 -->
		<uni-nav-bar status-bar left-icon="left" title="待办" @clickLeft="goBack" :fixed="true">
			<template #right>
				<view class="reload-custom">
					<uni-icons type="reload" size="22" @click="refreshPage" />
				</view>
			</template>
		</uni-nav-bar>

		<!-- 待办内容区域 -->
		<view class="todo-content">
			<scroll-view class="todo-scroll" scroll-y="true" :scroll-top="scrollTop" @scrolltolower="onScrollToLower">
				<!-- 空状态 -->
				<view class="empty-state" v-if="currentPageItems.length === 0">
					<uni-icons type="info" size="60" color="#ccc" />
					<text class="empty-text">暂无待办事项</text>
					<button class="empty-btn" @click="showAddTodoModal">添加待办</button>
				</view>
				
				<!-- 待办项 -->
				<view class="todo-item" v-for="(item, index) in currentPageItems" :key="item._id">
					<view class="todo-header">
						<text class="todo-date">{{ formatDateRange(item.startTime, item.endTime) }}</text>
						<view class="todo-status">
							<text class="todo-weekday">{{ getWeekday(item.startTime) }}</text>
							<!-- 只在同一天时显示具体时间 -->
							<text class="todo-time" v-if="isSameDay(item.startTime, item.endTime)">{{ formatTimeRange(item.startTime, item.endTime) }}</text>
							<view class="todo-actions">
								<view class="todo-edit" @click="editTodo(item._id)">
									<text class="edit-icon">✎</text>
								</view>
								<view class="todo-delete" @click="deleteTodo(item._id)">
									<text class="delete-icon">×</text>
								</view>
							</view>
						</view>
					</view>

					<view class="todo-list">
						<view class="todo-list-item" v-for="(task, taskIndex) in item.tasks" :key="taskIndex">
							<text class="task-bullet">•</text>
							<text class="task-text">{{ task }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 自定义分页器 -->
		<view class="custom-pagination" v-if="totalPages > 1">
			<view class="pagination-content">
				<view class="pagination-btn" :class="{ disabled: currentPage === 1 }" @click="previousPage">
					<text class="btn-text">上一页</text>
				</view>
				
				<view class="pagination-info">
					<text class="page-text">{{ currentPage }}</text>
					<text class="page-separator">/</text>
					<text class="page-text">{{ totalPages }}</text>
				</view>
				
				<view class="pagination-btn" :class="{ disabled: currentPage === totalPages }" @click="nextPage">
					<text class="btn-text">下一页</text>
				</view>
			</view>
			
			<view class="jump-section">
				<input 
					v-model="jumpPage" 
					class="jump-input" 
					type="number" 
					placeholder="页码" 
					:max="totalPages"
					:min="1"
				/>
				<view class="jump-btn" @click="jumpToPage">
					<text class="jump-text">跳转</text>
				</view>
			</view>
		</view>

		<!-- 右下角添加按钮 -->
		<view class="add-button" @click="showAddTodoModal">
			<text class="add-icon">+</text>
		</view>

		<!-- 添加/编辑待办弹窗 -->
		<view class="add-todo-modal" v-if="showAddTodoModalFlag">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{ isEditing ? '修改待办事项' : '添加待办事项' }}</text>
					<view class="close-btn" @click="closeAddTodoModal">
						<text class="close-icon">×</text>
					</view>
				</view>

				<view class="modal-body">
					<view class="input-group">
						<text class="input-label">起止时间</text>
						<uni-datetime-picker 
							v-model="timeRange" 
							type="datetimerange" 
							rangeSeparator="至" 
							:start="startDate"
							:end="endDate"
						/>
					</view>
					<view class="input-group">
						<text class="input-label">待办事项</text>
						<textarea v-model="newTodo.tasksText" class="textarea-field" placeholder="每行输入一个待办事项"
							auto-height></textarea>
					</view>
				</view>

				<view class="modal-footer">
					<button class="cancel-btn" @click="closeAddTodoModal">取消</button>
					<button class="confirm-btn" type="primary"
						@click="addTodo">{{ isEditing ? '保存修改' : '确认添加' }}</button>
				</view>
			</view>
			<view class="modal-mask" @click="closeAddTodoModal"></view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		watch
	} from 'vue'
	import { addTodoApi,getTodoListApi,delTodoApi,editTodoApi } from '../../apis/todo'
	
	// 获取当前年份
	const currentYear = new Date().getFullYear()
	
	// 待办数据 - 包含不同年份的示例
	const todos = ref([])

	// 分页相关
	const currentPage = ref(1)
	const itemsPerPage = 5
	const jumpPage = ref('')
	const scrollTop = ref(0)
	const showAddTodoModalFlag = ref(false)
	const isEditing = ref(false)
	const timeRange = ref([])

	// 新待办事项
	const newTodo = ref({
		tasksText: '',
		editId: null
	})

	// 日期范围限制
	const startDate = ref('2020-01-01 00:00:00')
	const endDate = ref('2030-12-31 23:59:59')

	// 计算属性
	const totalItems = computed(() => todos.value.length)
	const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
	const currentPageItems = computed(() => {
		const startIndex = (currentPage.value - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return todos.value.slice(startIndex, endIndex)
	})
	
	//获取数据
	const getData = async()=>{
		try{
			const res = await getTodoListApi()
			if(res.errno == 0){
				todos.value = res.data
			}
		}catch(e){
			uni.showToast({
				title:"获取数据失败"
			})
		}
	}

	onMounted(() => {
		getData()
	})

	// 监听当前页变化，确保在有效范围内
	watch(currentPage, (newPage) => {
		if (newPage < 1) {
			currentPage.value = 1
		} else if (newPage > totalPages.value) {
			currentPage.value = totalPages.value
		}
	})

	// 监听总页数变化，调整当前页
	watch(totalPages, (newTotalPages) => {
		if (currentPage.value > newTotalPages && newTotalPages > 0) {
			currentPage.value = newTotalPages
		} else if (newTotalPages === 0) {
			currentPage.value = 1
		}
	})

	// 判断是否为同一天
	const isSameDay = (startTime, endTime) => {
		if (!startTime || !endTime) return false
		
		const startDate = new Date(startTime)
		const endDate = new Date(endTime)
		
		return startDate.toDateString() === endDate.toDateString()
	}

	// 判断是否为当前年份
	const isCurrentYear = (dateTime) => {
		if (!dateTime) return false
		const date = new Date(dateTime)
		return date.getFullYear() === currentYear
	}

	// 格式化单个日期（根据是否为当前年份决定是否显示年份）
	const formatSingleDate = (dateTime) => {
		if (!dateTime) return ''
		
		const date = new Date(dateTime)
		const year = date.getFullYear()
		const month = padZero(date.getMonth() + 1)
		const day = padZero(date.getDate())
		
		// 如果是当前年份，不显示年份
		if (isCurrentYear(dateTime)) {
			return `${month}.${day}`
		} else {
			return `${year}.${month}.${day}`
		}
	}

	// 格式化日期范围
	const formatDateRange = (startTime, endTime) => {
		if (!startTime || !endTime) return ''
		
		const startDate = new Date(startTime)
		const endDate = new Date(endTime)
		
		// 如果是同一天
		if (isSameDay(startTime, endTime)) {
			return formatSingleDate(startTime)
		} else {
			// 不同日期显示日期范围
			const startFormatted = formatSingleDate(startTime)
			const endFormatted = formatSingleDate(endTime)
			
			// 如果开始和结束年份相同且不是当前年份，结束日期可以省略年份
			const startYear = startDate.getFullYear()
			const endYear = endDate.getFullYear()
			
			if (startYear === endYear && startYear !== currentYear) {
				// 相同年份且不是当前年份，结束日期只显示月日
				const endMonth = padZero(endDate.getMonth() + 1)
				const endDay = padZero(endDate.getDate())
				return `${startFormatted} - ${endMonth}.${endDay}`
			} else {
				// 不同年份或当前年份，都显示完整格式
				return `${startFormatted} - ${endFormatted}`
			}
		}
	}

	// 格式化时间范围（只在同一天时使用）
	const formatTimeRange = (startTime, endTime) => {
		if (!startTime || !endTime) return ''
		
		const startDate = new Date(startTime)
		const endDate = new Date(endTime)
		
		return `${padZero(startDate.getHours())}:${padZero(startDate.getMinutes())} - ${padZero(endDate.getHours())}:${padZero(endDate.getMinutes())}`
	}

	// 获取星期几（以开始时间为准）
	const getWeekday = (dateTime) => {
		if (!dateTime) return ''
		
		const date = new Date(dateTime)
		const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
		return weekdays[date.getDay()]
	}

	// 补零函数
	const padZero = (num) => {
		return num.toString().padStart(2, '0')
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 刷新页面
	const refreshPage = () => {
		uni.showToast({
			title: '刷新成功',
			icon: 'success'
		})
		jumpPage.value = ''
	}

	// 编辑待办事项
	const editTodo = (id) => {
		const item = todos.value.find(item => item._id === id)
		if (item) {
			timeRange.value = [item.startTime, item.endTime]
			newTodo.value.tasksText = item.tasks.join('\n')
			newTodo.value.editId = id
			isEditing.value = true
			showAddTodoModalFlag.value = true
		}
	}

	// 删除待办事项
	const deleteTodo = (id) => {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这个待办事项吗？',
			success:async (res) => {
				if (res.confirm) {
					const index = todos.value.findIndex(item => item._id === id)
					try{
						const res = await delTodoApi(todos.value[index]._id)
						 if(res.errno == 0){
							 if (index !== -1) {
							 	todos.value.splice(index, 1)
							 	
							 	if (currentPageItems.value.length === 0 && currentPage.value > 1) {
							 		currentPage.value--
							 	}
							 	
							 	uni.showToast({
							 		title: '删除成功',
							 		icon: 'success'
							 	})
							 }
						 }
					}catch(e){
						uni.showToast({
							title:'删除异常'
						})
					}
				}
			}
		})
	}

	// 上一页
	const previousPage = () => {
		if (currentPage.value > 1) {
			currentPage.value--
			scrollToTop()
			jumpPage.value = ''
		}
	}

	// 下一页
	const nextPage = () => {
		if (currentPage.value < totalPages.value) {
			currentPage.value++
			scrollToTop()
			jumpPage.value = ''
		}
	}

	// 跳转到指定页
	const jumpToPage = () => {
		const page = parseInt(jumpPage.value)
		if (isNaN(page) || page < 1 || page > totalPages.value) {
			uni.showToast({
				title: `请输入1-${totalPages.value}之间的页码`,
				icon: 'none'
			})
			jumpPage.value = ''
			return
		}

		currentPage.value = page
		jumpPage.value = ''
		scrollToTop()
	}

	// 滚动到顶部
	const scrollToTop = () => {
		scrollTop.value = Math.random()
	}

	// 滚动到底部事件
	const onScrollToLower = () => {
		console.log('滚动到底部')
	}

	// 显示添加待办弹窗
	const showAddTodoModal = () => {
		timeRange.value = []
		newTodo.value = {
			tasksText: '',
			editId: null
		}
		isEditing.value = false
		showAddTodoModalFlag.value = true
	}

	// 关闭添加待办弹窗
	const closeAddTodoModal = () => {
		showAddTodoModalFlag.value = false
	}

	// 添加/更新待办事项
	const addTodo =async () => {
		if (timeRange.value.length !== 2 || !newTodo.value.tasksText) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}
		

		const [startTime, endTime] = timeRange.value
		
		// 验证时间范围合理性
		if (new Date(startTime) >= new Date(endTime)) {
			uni.showToast({
				title: '开始时间必须早于结束时间',
				icon: 'none'
			})
			return
		}

		const tasks = newTodo.value.tasksText.split('\n').filter(task => task.trim() !== '')

		if (tasks.length === 0) {
			uni.showToast({
				title: '请至少输入一个待办事项',
				icon: 'none'
			})
			return
		}

		if (newTodo.value.editId) {
			// 编辑模式
			const index = todos.value.findIndex(item => item._id === newTodo.value.editId)
			try{
				const res = await editTodoApi(todos.value[index]._id,{
					startTime,
					endTime,
					tasks
				})
				if(res.errno == 0){
					if (index !== -1) {
						todos.value[index] = {
							_id: newTodo.value.editId,
							startTime: startTime,
							endTime: endTime,
							tasks: tasks
						}
					
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						})
					}
				}
			}catch(e){
				uni.showToast({
					title:'编辑异常'
				})
			}

		} else {
			try{
				const res = await addTodoApi({
					startTime,
					endTime,
					tasks
				})
				if(res.errno == 0){
					const newItem = {
						_id: res.data._id,
						startTime,
						endTime,
						tasks
					}
					
					todos.value.unshift(newItem)
					currentPage.value = 1
					
					uni.showToast({
						title: '添加成功',
						icon: 'success'
					})
				}
			}catch(e){
				uni.showToast({
					title:'添加异常'
				})
			}
		}

		closeAddTodoModal()
	}
</script>

<style lang="scss" scoped>
	/* 样式保持不变，与之前相同 */
	.reload-custom {
		width: 60rpx;
		height: 60rpx;
		border-radius: 8rpx;
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.todo-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		position: relative;
	}

	.todo-content {
		flex: 1;
		overflow: hidden;
		padding: 30rpx;
	}

	.todo-scroll {
		height: 100%;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
		color: #999;
	}

	.empty-text {
		font-size: 28rpx;
		margin: 20rpx 0;
		color: #999;
	}

	.empty-btn {
		background-color: #333;
		color: white;
		border: none;
		border-radius: 8rpx;
		padding: 15rpx 30rpx;
		font-size: 26rpx;
		margin-top: 20rpx;
	}

	.todo-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	}

	.todo-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 25rpx;
	}

	.todo-date {
		font-size: 28rpx;
		color: #666;
		font-weight: bold;
	}

	.todo-status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.todo-weekday {
		font-size: 26rpx;
		color: #333;
		margin-bottom: 8rpx;
	}

	.todo-time {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 12rpx;
	}

	.todo-actions {
		display: flex;
		gap: 15rpx;
	}

	.todo-edit,
	.todo-delete {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
		transition: all 0.2s ease;
	}

	.todo-edit {
		background-color: #f0f0f0;
	}

	.todo-delete {
		background-color: #ffebee;
	}

	.todo-edit:active {
		background-color: #e0e0e0;
	}

	.todo-delete:active {
		background-color: #ffcdd2;
	}

	.edit-icon,
	.delete-icon {
		font-size: 24rpx;
		font-weight: bold;
	}

	.edit-icon {
		color: #333;
	}

	.delete-icon {
		color: #f56c6c;
	}

	.todo-list {
		background-color: #f9f9f9;
		border-radius: 16rpx;
		padding: 25rpx;
	}

	.todo-list-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 15rpx;
	}

	.todo-list-item:last-child {
		margin-bottom: 0;
	}

	.task-bullet {
		font-size: 32rpx;
		color: #333;
		margin-right: 15rpx;
		line-height: 1.4;
	}

	.task-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.4;
		flex: 1;
	}

	.custom-pagination {
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #eee;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.pagination-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.pagination-btn {
		padding: 15rpx 30rpx;
		background-color: #333;
		color: white;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.pagination-btn.disabled {
		background-color: #ccc;
		color: #999;
	}

	.pagination-btn:not(.disabled):active {
		background-color: #555;
		transform: scale(0.95);
	}

	.btn-text {
		font-size: 26rpx;
	}

	.pagination-info {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.page-text {
		font-size: 28rpx;
		color: #333;
	}

	.page-separator {
		font-size: 24rpx;
		color: #999;
	}

	.jump-section {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 15rpx;
	}

	.jump-input {
		width: 120rpx;
		height: 60rpx;
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 26rpx;
		text-align: center;
	}

	.jump-btn {
		padding: 10rpx 25rpx;
		background-color: #333;
		color: white;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.jump-btn:active {
		background-color: #555;
		transform: scale(0.95);
	}

	.jump-text {
		font-size: 24rpx;
	}

	.add-button {
		position: fixed;
		bottom: 180rpx;
		right: 40rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: #333;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
		z-index: 10;
		transition: all 0.2s ease;
		/* 添加拖拽相关样式 */
		touch-action: none; /* 防止浏览器默认的触摸行为 */
		user-select: none; /* 防止文本选择 */
	}

	.add-button:active {
		background-color: #555;
		transform: scale(0.95);
	}

	.add-icon {
		font-size: 40rpx;
		color: #fff;
		font-weight: bold;
	}

	.add-icon {
		font-size: 40rpx;
		color: #fff;
		font-weight: bold;
	}

	.add-todo-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content {
		width: 90%;
		max-height: 80%;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		z-index: 101;
		box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.2);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.modal-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.close-btn {
		width: 50rpx;
		height: 50rpx;
		border-radius: 12rpx;
		background-color: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.close-btn:active {
		background-color: #e0e0e0;
		transform: scale(0.95);
	}

	.close-icon {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}

	.modal-body {
		padding: 30rpx;
		max-height: 600rpx;
		overflow-y: auto;
	}

	.input-group {
		margin-bottom: 30rpx;
	}

	.input-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 15rpx;
	}

	.textarea-field {
		width: 100%;
		min-height: 160rpx;
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		padding: 20rpx;
		font-size: 28rpx;
		background-color: #fff;
		box-sizing: border-box;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #eee;
		gap: 20rpx;
	}

	.cancel-btn,
	.confirm-btn {
		border: none;
		border-radius: 8rpx;
		font-size: 28rpx;
		transition: all 0.2s ease;
		padding: 15rpx 30rpx;
	}

	.cancel-btn {
		background-color: #f0f0f0;
		color: #333;
	}

	.confirm-btn {
		background-color: #333;
		color: white;
	}

	.cancel-btn:active,
	.confirm-btn:active {
		transform: scale(0.95);
	}

	.modal-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}
</style>