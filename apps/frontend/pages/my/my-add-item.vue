<template>
	<view class="page">
		<!-- 自定义导航栏（含右上角保存按钮） -->
		<uni-nav-bar status-bar left-icon="left" title="新增品项" @clickRight="handleSave" @clickLeft="uni.navigateBack()"
			:fixed="true">
			<template #right>
				<view class="save-btn">
					保存
				</view>
			</template>
		</uni-nav-bar>

		<!-- 表单内容 -->
		<scroll-view class="form-container" scroll-y>
			<!-- 图片上传 -->
			<view class="form-item">
				<text class="label">品项图片</text>
				<view class="upload-area" @click="chooseImage" v-if="!imageUrl">
					<uni-icons size="30" type="camera"></uni-icons>
					<text class="upload-text">点击上传图片</text>
				</view>
				<view class="image-preview" v-else>
					<image :src="imageUrl" class="preview-img" mode="aspectFill"></image>
					<text class="remove-btn" @click.stop="removeImage">移除图片</text>
				</view>
			</view>

			<!-- 基本信息 -->
			<view class="section-title">基本信息</view>

			<!-- 品项名称 -->
			<view class="form-item">
				<text class="label">品项名称 <text class="required">*</text></text>
				<input v-model="formData.name" class="input" placeholder="请输入品项名称" placeholder-style="color: #ccc" />
			</view>

			<!-- 品项分类（带下拉按钮） -->
			<view class="form-item">
				<text class="label">品项分类 <text class="required">*</text></text>
				<picker mode="selector" :range="categories" :value="categoryIndex" @change="onCategoryChange">
					<view class="picker-container">
						<text class="picker-text">
							{{ categoryIndex === -1 ? '请选择品项分类' : categories[categoryIndex] }}
						</text>
						<text class="dropdown-icon">▼</text>
					</view>
				</picker>
			</view>

			<!-- 规格 -->
			<view class="form-item">
				<text class="label">规格</text>
				<input v-model="formData.sku" class="input" placeholder="请输入规格信息" placeholder-style="color: #ccc" />
			</view>

			<!-- 售价 -->
			<view class="form-item">
				<text class="label">售价 <text class="required">*</text></text>
				<view class="price-input">
					<text class="yen">¥</text>
					<input v-model="formData.price" class="input price" type="number" placeholder="0.00"
						placeholder-style="color: #ccc" />
				</view>
			</view>
			<!-- 库存数量 -->
			<view class="form-item">
				<text class="label">库存数量 <text class="required">*</text></text>
				<input v-model="formData.total" class="input" type="number" placeholder="0"
					placeholder-style="color: #ccc" />
			</view>

			<!-- 品项描述 -->
			<view class="form-item">
				<text class="label">品项描述</text>
				<textarea v-model="formData.description" class="textarea" placeholder="请输入品项描述"
					placeholder-style="color: #ccc" />
			</view>

			<!-- 是否上架 -->
			<view class="form-item switch-item">
				<text class="label">是否上架</text>
				<switch style="transform: scale(0.7); transform-origin: left center" :checked="Boolean(formData.status)"
					@change="onSwitchChange" color="#07c160" />
			</view>

			<!-- 附加信息 -->
			<view class="section-title">附加信息</view>

			<!-- 标签 -->
			<view class="form-item">
				<text class="label">标签</text>
				<view class="tags-container">
					<!-- 预设标签 -->
					<view v-for="tag in presetTags" :key="tag" class="tag"
						:class="{ active: selectedTags.includes(tag) }" @click="toggleTag(tag)">
						{{ tag }}
					</view>

					<!-- 自定义标签 -->
					<view class="custom-tag">
						<input v-model="customTag" class="tag-input" placeholder="自定义标签" @confirm="addCustomTag"
							placeholder-style="color: #ccc; font-size: 28rpx;" />
						<text class="add-tag-btn" @click="addCustomTag">添加</text>
					</view>
				</view>

				<!-- 已选标签展示 -->
				<view class="selected-tags" v-if="selectedTags.length > 0">
					<text v-for="tag in selectedTags" :key="tag" class="selected-tag" @click="removeSelectedTag(tag)">
						{{ tag }} ×
					</text>
				</view>
			</view>

			<!-- 备注 -->
			<view class="form-item">
				<text class="label">备注</text>
				<textarea v-model="formData.remark" class="textarea" placeholder="请输入备注"
					placeholder-style="color: #ccc" />
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app'
	import {
		addInventoryApi,
		editInventoryApi,
		getInventoryApi
	} from '../../apis/inventory.js'
	import {
		getStatusBarHeight
	} from '../../utils/system';
	// 数据定义
	const imageUrl = ref('')
	const categoryIndex = ref(-1)
	const inVentoryId = ref('')

	// 更新：五个分类选项
	const categories = ['食品', '饮料', '零食', '日用品', '其他']

	const customTag = ref('')
	const selectedTags = ref([])

	const presetTags = ['热销', '新品', '优惠', '推荐', '爆款', '限时']

	const formData = reactive({
		name: '',
		category: '',
		sku: '',
		price: '',
		total: '',
		description: '',
		status: false, // 0:下架  1：上架   
		sign: [],
		remark: ''
	})

	//获取库存信息
	const getInfo = async (id) => {
		try {
			const res = await getInventoryApi(id)
			if (res.errno == 0) {
				Object.keys(res.data).forEach(key => {
					if (key in formData) {
						formData[key] = res.data[key]
					}
				})
				if (formData.category) {
					const index = categories.indexOf(formData.category)
					categoryIndex.value = index !== -1 ? index : -1
				}
				imageUrl.value = res.data.image
				selectedTags.value = formData.sign
			}
		} catch (e) {
			uni.showToast({
				title: '获取数据失败'
			})
		}
	}

	//数据初始化
	onLoad((e) => {
		if (e.id) {
			inVentoryId.value = e.id
			getInfo(e.id)
		}
	})

	// 选择图片
	const chooseImage = () => {
		uni.chooseImage({
			count: 1,
			success: (res) => {
				imageUrl.value = res.tempFilePaths[0]
			},
			fail: (err) => {
				console.error('选择图片失败', err)
			}
		})
	}

	// 移除图片
	const removeImage = () => {
		imageUrl.value = ''
	}

	// 分类选择
	const onCategoryChange = (e) => {
		const index = e.detail.value
		categoryIndex.value = index
		formData.category = categories[index]
	}

	// 开关变化
	const onSwitchChange = (e) => {
		formData.isShelf = e.detail.value
	}

	// 切换预设标签
	const toggleTag = (tag) => {
		const index = selectedTags.value.indexOf(tag)
		if (index === -1) {
			selectedTags.value.push(tag)
		} else {
			selectedTags.value.splice(index, 1)
		}
	}

	// 添加自定义标签
	const addCustomTag = () => {
		const val = customTag.value.trim()
		if (val && !selectedTags.value.includes(val)) {
			selectedTags.value.push(val)
			customTag.value = ''
		}
	}

	// 移除已选标签
	const removeSelectedTag = (tag) => {
		selectedTags.value = selectedTags.value.filter(t => t !== tag)
	}

	const addInventory = async () => {
		uni.showLoading({
			title: '加载中...',
			mask: true
		})
		//上传图片
		uni.uploadFile({
			url: 'https://api.imgbb.com/1/upload?key=46cc62d65f788f89c3d9d652fcc3d6df',
			name: 'image',
			filePath: imageUrl.value,
			timeout: 20000,
			success: async (res) => {
				if (res.statusCode >= 200 && res.statusCode < 400) {
					const data = JSON.parse(res.data)
					if (data.status === 200) {
						const res = await addInventoryApi({
							...formData,
							image: data.data.display_url
						})
						if (res.errno == 0) {
							setTimeout(() => {
								uni.showToast({
									title: '新增成功'
								})
								uni.navigateBack()
							}, 800)
						}
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
			fail: () => {
				uni.showToast({
					title: '上传图片失败',
					icon: 'none'
				})
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	}

	const editInventory = async () => {
		try {
			const res = await editInventoryApi(inVentoryId.value, {
				...formData,
				image: imageUrl.value
			})
			if (res.errno == 0) {
				setTimeout(() => {
					uni.showToast({
						title: '保存成功'
					})
					uni.navigateBack()
				}, 1000)

			} else
				uni.showToast({
					title: '操作异常'
				})
		} catch (e) {
			uni.showToast({
				title: '操作异常'
			})
		}
	}
	// 保存
	const handleSave = async () => {
		// 表单验证
		if (!formData.name.trim()) {
			uni.showToast({
				title: '请输入品项名称',
				icon: 'none'
			})
			return
		}
		if (categoryIndex.value === -1) {
			uni.showToast({
				title: '请选择品项分类',
				icon: 'none'
			})
			return
		}
		if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
			uni.showToast({
				title: '请输入有效的售价',
				icon: 'none'
			})
			return
		}
		if (!formData.total) {
			uni.showToast({
				title: '请输入库存数量',
				icon: 'none'
			})
			return
		}

		// 合并标签
		formData.sign = selectedTags.value

		//可在此处调用 API 提交数据
		try {
			if (!inVentoryId.value)
				addInventory()
			else
				editInventory()

		} catch (e) {
			uni.showToast({
				title: '新增失败'
			})
		}

	}
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
	}

	.save-btn {
		width: 100rpx;
		height: 60rpx;
		border-radius: 8rpx;
		border: 1rpx solid #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.form-container {
		flex: 1;
		padding: 20rpx;
	}

	.form-item {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding: 24rpx 30rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		/* 确保label和input-container垂直排列 */
	}

	.label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 16rpx;
		display: block;
	}

	.required {
		color: #f43f5e;
	}

	.input,
	.textarea,
	.tag-input {
		width: 90%;
		font-size: 28rpx;
		color: #333;
	}

	.input,
	.tag-input {
		border: 1rpx solid #ddd;
		padding: 16rpx 20rpx;
		border-radius: 8rpx;
		background-color: #fdfdfd;
	}

	.textarea {
		border: 1rpx solid #ddd;
		padding: 16rpx 20rpx;
		border-radius: 8rpx;
		height: 120rpx;
		background-color: #fdfdfd;
	}

	/* 品项分类下拉框（带下拉按钮） */
	.picker-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16rpx 20rpx;
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		background-color: #fdfdfd;
		color: #333;
	}

	.picker-text {
		flex: 1;
		color: #666;
		font-size: 28rpx;
	}

	.dropdown-icon {
		font-size: 24rpx;
		color: #999;
		margin-left: 10rpx;
	}

	.price-input {
		display: flex;
		align-items: center;
		border: 1rpx solid #ddd;
		border-radius: 8rpx;
		background-color: #fdfdfd;
		overflow: hidden;
	}

	.yen {
		padding: 16rpx 20rpx;
		background-color: #f5f5f5;
		border-right: 1rpx solid #ddd;
		font-size: 32rpx;
		color: #333;
	}

	.price-input .input {
		flex: 1;
		border: none;
		padding: 16rpx 20rpx;
	}

	.upload-area {
		border: 2rpx dashed #ccc;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 12rpx;
		background-color: #fafafa;
	}

	.upload-text {
		color: #666;
		font-size: 28rpx;
	}

	.image-preview {
		position: relative;
	}

	.preview-img {
		width: 200rpx;
		height: 200rpx;
		border-radius: 12rpx;
		object-fit: cover;
	}

	.remove-btn {
		position: absolute;
		top: 16rpx;
		right: 16rpx;
		background-color: rgba(0, 0, 0, 0.6);
		color: #fff;
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		border-radius: 6rpx;
	}

	.switch-item {
		display: flex;

	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin: 30rpx 0 20rpx 0;
		padding-left: 10rpx;
	}

	/* 标签样式 */
	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-bottom: 20rpx;
	}

	.tag {
		padding: 12rpx 20rpx;
		border: 1rpx solid #ddd;
		border-radius: 6rpx;
		font-size: 26rpx;
		color: #555;
		background-color: #f5f5f5;
	}

	.tag.active {
		background-color: #07c160;
		color: #fff;
		border-color: #07c160;
	}

	.custom-tag {
		display: flex;
		align-items: center;
		border-radius: 6rpx;
		overflow: hidden;
		background-color: #f5f5f5;
	}

	.tag-input {
		flex: 1;
		max-width: 180rpx;
		padding: 12rpx 16rpx;
		font-size: 26rpx;
	}

	.add-tag-btn {
		padding: 12rpx 20rpx;
		background-color: #07c160;
		color: #fff;
		font-size: 26rpx;
	}

	.selected-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-top: 16rpx;
	}

	.selected-tag {
		padding: 8rpx 16rpx;
		background-color: #07c160;
		color: #fff;
		border-radius: 6rpx;
		font-size: 26rpx;
	}
</style>