<template>
  <!-- 抽屉组件 -->
  <view class="drawer-mask" v-if="showDrawer" @tap="closeDrawer"></view>
  <view class="drawer" :class="{show: showDrawer}">
    <view class="drawer-header">
      <text class="drawer-title">生成海报</text>
      <uni-icons type="close" size="24" @tap="closeDrawer"></uni-icons>
    </view>
    <view class="drawer-content">
      <!-- 上传商品图片 -->
      <view class="drawer-item">
        <text class="drawer-item-title">上传商品图片</text>
        <text class="sub-title">最多可上传5张图片</text>
        <view class="upload-area" @tap="handleImageUpload" :class="{disabled: formData.images.length >= 5}">
          <uni-icons type="image-filled" size="36" 
            :color="formData.images.length >= 5 ? '#ddd' : '#ccc'"></uni-icons>
          <text class="upload-tip" :class="{disabled: formData.images.length >= 5}">
            {{formData.images.length >= 5 ? '已上传5张图片' : '点击上传图片,支持JPG、PNG格式，最多5张照片'}}
          </text>
        </view>
        <text class="error-text" v-if="formErrors.images">{{formErrors.images}}</text>

        <!-- 图片预览 -->
        <view class="image-preview" v-if="formData.images.length > 0">
          <view class="preview-item" v-for="(image, index) in formData.images" :key="index">
            <image :src="image" mode="aspectFill" class="preview-image"></image>
            <view class="remove-btn" @tap.stop="removeImage(index)">×</view>
          </view>
        </view>
      </view>

      <!-- 海报标题 -->
      <view class="drawer-item">
        <text class="drawer-item-title">海报标题</text>
        <input class="title-input" :class="{'error': formErrors.title}"
          placeholder="请输入海报标题（2-20个字符）" maxlength="20" :value="formData.title"
          @input="handleTitleInput" />
        <view class="input-info">
          <text class="error-text" v-if="formErrors.title">{{formErrors.title}}</text>
          <text class="char-count">{{formData.title.length}}/20</text>
        </view>
      </view>

      <!-- 海报描述 -->
      <view class="drawer-item">
        <view class="description-header">
          <text class="drawer-item-title">海报描述</text>
          <view class="ai-generate-btn" @tap="generateDescriptionWithAI"
            :class="{loading: isGeneratingDescription, disabled: isGeneratingDescription}">
            <uni-icons v-if="!isGeneratingDescription" type="sparkles" size="18"
              color="#5A78EA"></uni-icons>
            <uni-icons v-else type="spinner-cycle" size="18" color="#5A78EA"
              class="loading-icon"></uni-icons>
            <text>{{isGeneratingDescription ? '生成中...' : 'AI生成'}}</text>
          </view>
        </view>
        <textarea class="description-input" :class="{'error': formErrors.description}"
          placeholder="请输入海报描述..." maxlength="100" :value="formData.description"
          @input="handleDescriptionInput" :disabled="isGeneratingDescription"></textarea>
        <view class="input-info">
          <text class="error-text" v-if="formErrors.description">{{formErrors.description}}</text>
          <text class="char-count">{{formData.description.length}}/100</text>
        </view>
      </view>

      <!-- 选择海报风格 -->
      <view class="drawer-item">
        <text class="drawer-item-title">选择海报风格</text>
        <text class="error-text" v-if="formErrors.style">{{formErrors.style}}</text>
        <view class="style-options">
          <view class="com" :class="{'com-active':posterStyle == 'simple'}" @tap="selectStyle('simple')">
            <view class="icon"><uni-icons size="24" type="map"></uni-icons></view>
            <view class="text">简约风</view>
          </view>
          <view class="com" :class="{'com-active':posterStyle == 'color'}" @tap="selectStyle('color')">
            <view class="icon"><uni-icons size="24" type="color"></uni-icons></view>
            <view class="text">鲜艳风</view>
          </view>
          <view class="com" :class="{'com-active':posterStyle == 'minimalist'}"
            @tap="selectStyle('minimalist')">
            <view class="icon"><uni-icons size="24" type="paperplane"></uni-icons></view>
            <view class="text">极简风</view>
          </view>
          <view class="com" :class="{'com-active':posterStyle == 'retro'}" @tap="selectStyle('retro')">
            <view class="icon"><uni-icons size="24" type="pyq"></uni-icons></view>
            <view class="text">复古风</view>
          </view>
        </view>
      </view>

      <!-- 选择海报尺寸 -->
      <view class="drawer-item">
        <text class="drawer-item-title">选择海报尺寸</text>
        <text class="error-text" v-if="formErrors.size">{{formErrors.size}}</text>
        <view class="size-options">
          <uni-data-select placement="top" v-model="size" :localdata="range" @change="handleChangeSize"
            :class="{'error': formErrors.size}"></uni-data-select>
        </view>
      </view>
    </view>

    <!-- 表单状态提示 -->
    <view class="form-status" v-if="hasErrors()">
      <uni-icons type="info" size="16" color="#ff6b6b"></uni-icons>
      <text>请完善表单信息</text>
    </view>

    <view class="drawer-footer">
      <button class="generate-btn" @tap="generatePoster" :disabled="isGeneratingPoster">
        {{isGeneratingPoster ? '生成中...' : '立即生成'}}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { imageUnderstandApi, imageGenerateApi } from '../../apis/ai'
import { addPosterApi } from '../../apis/poster'

// 定义props
const props = defineProps({
  showDrawer: {
    type: Boolean,
    default: false
  }
})

// 定义emits
const emit = defineEmits(['update:showDrawer', 'close', 'generate'])

// 存储图片(https格式的url)
const urlList = ref([])
const size = ref(1)
const posterStyle = ref('')
const isGeneratingDescription = ref(false)
const isGeneratingPoster = ref(false)

// 表单数据
const formData = reactive({
  images: [],
  title: '', 
  description: '',
  style: '',
  size: 1
})

// 表单验证错误信息
const formErrors = reactive({
  images: '',
  title: '',
  description: '',
  style: '',
  size: ''
})

const range = ref([{
  "value": 0,
  "text": "摊位广告牌(80x120cm)",
  "disable": false
}, {
  "value": 1,
  "text": "手机分享(1:1正方形)",
}, {
  "value": 2,
  "text": "长图尺寸(9:16)"
}, {
  "value": 3,
  "text": "A4打印尺寸",
}])

// 修改尺寸变化
const handleChangeSize = (value) => {
  size.value = value
  formData.size = value
  validateField('size')
}

// 关闭抽屉
const closeDrawer = () => {
  if (isGeneratingDescription.value || isGeneratingPoster.value) {
    uni.showModal({
      title: '提示',
      content: '当前有任务正在进行中，确定要关闭吗？',
      success: (res) => {
        if (res.confirm) {
          emit('update:showDrawer', false)
          emit('close')
        }
      }
    })
    return
  }
  emit('update:showDrawer', false)
  emit('close')
}

// 重置表单
const resetForm = () => {
  formData.images = []
  formData.title = ''
  formData.description = ''
  formData.style = ''
  formData.size = 1
  posterStyle.value = ''
  isGeneratingDescription.value = false
  isGeneratingPoster.value = false

  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
}

// 选择海报样式
const selectStyle = (style) => {
  formData.style = style
  posterStyle.value = style
  validateField('style')
}

// 单字段验证
const validateField = (fieldName) => {
  switch (fieldName) {
    case 'images':
      formErrors.images = formData.images.length === 0 ? '请至少上传一张图片' : ''
      break
    case 'title':
      if (!formData.title.trim()) {
        formErrors.title = '请输入海报标题'
      } else if (formData.title.length < 2) {
        formErrors.title = '标题至少需要2个字符'
      } else if (formData.title.length > 20) {
        formErrors.title = '标题不能超过20个字符'
      } else {
        formErrors.title = ''
      }
      break
    case 'description':
      if (!formData.description.trim()) {
        formErrors.description = '请输入海报描述'
      } else if (formData.description.length < 5) {
        formErrors.description = '描述至少需要5个字符'
      } else if (formData.description.length > 100) {
        formErrors.description = '描述不能超过100个字符'
      } else {
        formErrors.description = ''
      }
      break
    case 'style':
      formErrors.style = !formData.style ? '请选择海报风格' : ''
      break
    case 'size':
      formErrors.size = !formData.size ? '请选择海报尺寸' : ''
      break
  }
}

// 实时验证标题
const handleTitleInput = (event) => {
  formData.title = event.detail.value
  validateField('title')
}

// 实时验证描述
const handleDescriptionInput = (event) => {
  formData.description = event.detail.value
  validateField('description')
}

// 图片上传
const handleImageUpload = () => {
  if (formData.images.length >= 5) {
    uni.showToast({
      title: '最多只能上传5张图片',
      icon: 'none'
    })
    return
  }

  uni.chooseImage({
    count: 5 - formData.images.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePaths = res.tempFilePaths
      formData.images = [...formData.images, ...tempFilePaths.slice(0, 5 - formData.images.length)]
      validateField('images')
      
      try {
        uni.showLoading({
          title: '上传中...',
          mask: true
        })
        
        uni.uploadFile({
          url: 'http://hkone.mnt.mhnode.cn:54750/stall/upload/image',
          name: 'file',
          filePath: res.tempFiles[0].path,
		  timeout:20000,
          header: {
            'Authorization': 'Bearer ' + uni.getStorageSync('token') || ''
          },
          success: (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400 ) {
              const data = JSON.parse(res.data)
              if (data.errno === 0) {
                urlList.value.push(data.data.url)
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
      } catch (err) {
        uni.showToast({
          title: "上传图片异常",
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      if (err.errMsg.includes('cancel')) {
        return
      }
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

// 删除图片
const removeImage = (index) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        formData.images.splice(index, 1)
        urlList.value.splice(index, 1)
        validateField('images')
      }
    }
  })
}

// AI生成描述
const generateDescriptionWithAI = async () => {
  if (formData.images.length === 0) {
    uni.showToast({
      title: '请先上传图片',
      icon: 'none'
    })
    return
  }

  if (isGeneratingDescription.value) {
    return
  }

  isGeneratingDescription.value = true

  try {
    const res = await imageUnderstandApi({
      image: urlList.value,
      text: "生成一段海报专业的地摊描述，根据这些图片，字数限制在20个字左右"
    })
    if (res.errno == 0) {
      formData.description = res.data.choices[0].message.content
      uni.showToast({
        title: 'AI描述生成成功',
        icon: 'success'
      })
      validateField('description')
    } else {
      uni.showToast({
        title: '生成异常，请重试',
        icon: 'none'
      })
    }
  } catch (error) {
	  console.log(error)
    uni.showToast({
      title: '生成失败，请重试',
      icon: 'none'
    })
  } finally {
    isGeneratingDescription.value = false
  }
}

// 表单提交验证
const validateForm = () => {
  validateField('images')
  validateField('title')
  validateField('description')
  validateField('style')
  validateField('size')

  return !Object.values(formErrors).some(error => error !== '')
}

// 生成海报
const generatePoster = async () => {
  if (isGeneratingPoster.value) {
    return
  }
  
  if (!validateForm()) {
    uni.showToast({
      title: '请完善表单信息',
      icon: 'none'
    })
    
    await nextTick()
    const firstErrorField = document.querySelector('.error, .error-text')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isGeneratingPoster.value = true

  try {
    const res = await imageGenerateApi({
      prompt: formData.title + ' - ' + formData.description + '海报风格：' + transformStyle(),
      image: urlList.value,
      size: transformSize()
    })
    
    if (res.errno == 0) {
      uni.showToast({
        title: '海报生成成功！',
        icon: 'success',
        duration: 2000
      })
      
      setTimeout(() => {
        uni.previewImage({
          urls: [res.data[0].url],
        })
      }, 1500)
	  
	  //执行海报上传操作
	  await addPosterApi({
		  ...formData,
		  size:transformSize(formData.size),
		  image:urlList.value[0]
	  })
	  
      emit('generate', res.data[0].url)
    } else {
      uni.showToast({
        title: '生成海报异常，请重试',
        icon: 'none'
      })
    }
  } catch (err) {
    uni.showToast({
      title: '生成海报失败，请检查网络后重试',
      icon: 'none'
    })
  } finally {
    isGeneratingPoster.value = false
  }
}

// 获取表单验证状态
const hasErrors = () => {
  return Object.values(formErrors).some(error => error !== '')
}

// 尺寸转化
const transformSize = () => {
  if (size.value == 0) return '1664x2496'
  else if (size.value == 1) return '2048x2048'
  else if (size.value == 2) return '1440x2560'
  return '2496x1664'
}

// 风格表示
const transformStyle = () => {
  if (posterStyle.value == 'simple') return '简约风'
  else if (posterStyle.value == 'minimalist') return '极简风'
  else if (posterStyle.value == 'retro') return '复古风'
  return '鲜艳风'
}

// 暴露方法给父组件
defineExpose({
  resetForm,
  open: () => {
    resetForm()
    emit('update:showDrawer', true)
  }
})
</script>

<style lang="scss" scoped>
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

.drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -100%;
  background-color: #fff;
  border-radius: 30rpx 30rpx 0 0;
  z-index: 999;
  transition: bottom 0.3s ease;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  max-height: 95vh;
  display: flex;
  flex-direction: column;

  &.show {
    bottom: 0;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      bottom: -100%;
    }
    to {
      bottom: 0;
    }
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .drawer-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .drawer-content {
    flex: 1;
    padding: 30rpx;
    overflow-y: auto;

    .drawer-item {
      margin-bottom: 40rpx;

      .drawer-item-title {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        margin-bottom: 10rpx;
        color: #333;
      }

      .sub-title {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 20rpx;
      }

      /* 标题输入框样式 */
      .title-input {
        width: 100%;
        height: 80rpx;
        padding: 0 20rpx;
        background-color: #f9f9f9;
        border-radius: 15rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        border: 2rpx solid transparent;
        transition: all 0.3s ease;

        &:focus {
          border-color: #5A78EA;
          background-color: #fff;
        }

        &.error {
          border-color: #ff6b6b;
        }
      }

      .description-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .ai-generate-btn {
          display: flex;
          align-items: center;
          gap: 8rpx;
          padding: 10rpx 16rpx;
          background-color: #f0f4ff;
          border-radius: 20rpx;
          font-size: 24rpx;
          color: #5A78EA;
          font-weight: 500;
          transition: all 0.2s ease;

          &:active:not(.disabled) {
            background-color: #e0e8ff;
            transform: scale(0.95);
          }

          &.loading, &.disabled {
            opacity: 0.7;
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
        }
      }

      .error-text {
        color: #ff6b6b;
        font-size: 24rpx;
        margin-top: 8rpx;
        display: block;
      }

      .upload-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200rpx;
        background-color: #f9f9f9;
        border: 2rpx dashed #ddd;
        border-radius: 15rpx;
        padding: 20rpx;
        text-align: center;
        transition: all 0.3s ease;

        &:active:not(.disabled) {
          background-color: #f0f0f0;
          border-color: #5A78EA;
        }

        &.disabled {
          opacity: 0.5;
        }

        .upload-tip {
          margin-top: 10rpx;
          font-size: 24rpx;
          color: #999;

          &.disabled {
            color: #ccc;
          }
        }
      }

      .image-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;
        margin-top: 20rpx;

        .preview-item {
          position: relative;
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
          overflow: hidden;
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;

          &:active {
            transform: scale(0.95);
          }

          .preview-image {
            width: 100%;
            height: 100%;
          }

          .remove-btn {
            position: absolute;
            top: -8rpx;
            right: -8rpx;
            width: 32rpx;
            height: 32rpx;
            background: #ff6b6b;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20rpx;
            font-weight: bold;
            box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.2);
          }
        }
      }

      .description-input {
        width: 100%;
        height: 150rpx;
        padding: 20rpx;
        background-color: #f9f9f9;
        border-radius: 15rpx;
        font-size: 28rpx;
        box-sizing: border-box;
        border: 2rpx solid transparent;
        transition: all 0.3s ease;

        &:focus {
          border-color: #5A78EA;
          background-color: #fff;
        }

        &.error {
          border-color: #ff6b6b;
        }

        &:disabled {
          opacity: 0.7;
          background-color: #f0f0f0;
        }
      }

      .input-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10rpx;

        .char-count {
          font-size: 24rpx;
          color: #999;
        }
      }

      .style-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 20rpx;

        .com {
          border-radius: 15rpx;
          color: #999;
          width: 40vw;
          height: 130rpx;
          border: 2rpx solid #aaa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

          &:active {
            transform: scale(0.98);
          }

          .text {
            font-size: 24rpx;
            font-weight: 500;
            margin-top: 10rpx;
          }
        }

        .com-active {
          background: linear-gradient(135deg, #f8faff 0%, #e8f0ff 100%);
          border-color: #5A78EA;
          color: #5A78EA;
          font-weight: 600;
          box-shadow: 0 4rpx 12rpx rgba(90, 120, 234, 0.15);
          position: relative;
          transform: translateY(-2rpx);
        }

        .com-active::before {
          content: '';
          position: absolute;
          top: -2rpx;
          right: -2rpx;
          width: 24rpx;
          height: 24rpx;
          background: #5A78EA;
          border-radius: 50%;
        }

        .com-active::after {
          content: '✓';
          position: absolute;
          top: -2rpx;
          right: -2rpx;
          width: 24rpx;
          height: 24rpx;
          color: white;
          font-size: 16rpx;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .size-options {
        :deep(.uni-data-select) {
          width: 100%;

          .selector {
            border: 2rpx solid #f0f0f0;
            border-radius: 10rpx;
            padding: 20rpx;
            transition: all 0.3s ease;

            &:focus, &.error {
              border-color: #5A78EA;
            }

            &.error {
              border-color: #ff6b6b;
            }
          }
        }
      }
    }
  }

  .form-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: 20rpx;
    background-color: #fff5f5;
    color: #ff6b6b;
    font-size: 26rpx;
    border-top: 1rpx solid #ffe0e0;
    animation: shake 0.5s ease;

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  }

  .drawer-footer {
    padding: 30rpx;
    border-top: 1rpx solid #f0f0f0;

    .generate-btn {
      width: 100%;
      height: 90rpx;
      background: linear-gradient(135deg, #5A78EA 0%, #8A2BE2 100%);
      color: #fff;
      border-radius: 15rpx;
      font-size: 32rpx;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      transition: all 0.3s ease;
      box-shadow: 0 4rpx 12rpx rgba(90, 120, 234, 0.3);

      &:active:not(:disabled) {
        transform: translateY(2rpx);
        box-shadow: 0 2rpx 6rpx rgba(90, 120, 234, 0.4);
      }

      &:disabled {
        opacity: 0.7;
        transform: none;
        box-shadow: 0 2rpx 6rpx rgba(90, 120, 234, 0.2);
      }
    }
  }
}
</style>