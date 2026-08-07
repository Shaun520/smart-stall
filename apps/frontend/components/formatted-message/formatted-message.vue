<!-- components/FormattedMessage.vue -->
<template>
  <view class="formatted-message">
    <view 
      v-for="(item, index) in parsedContent" 
      :key="index" 
      :class="['message-block', item.type]"
    >
      <!-- 渲染标题 -->
      <text v-if="item.type === 'title'" class="message-title">{{ item.content }}</text>
      
      <!-- 渲染列表项 -->
      <view v-else-if="item.type === 'list-item'" class="list-item">
        <text class="list-bullet">•</text>
        <view class="list-content">
          <template v-for="(segment, segIndex) in item.content" :key="segIndex">
            <text v-if="segment.type === 'bold'" class="bold-text">{{ segment.content }}</text>
            <text v-else>{{ segment.content }}</text>
          </template>
        </view>
      </view>
      
      <!-- 渲染普通段落 -->
      <view v-else-if="item.type === 'paragraph'" class="paragraph">
        <template v-for="(segment, segIndex) in item.content" :key="segIndex">
          <text v-if="segment.type === 'bold'" class="bold-text">{{ segment.content }}</text>
          <text v-else>{{ segment.content }}</text>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { parseFormattedText } from '@/utils/textParser.js';

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
});

const parsedContent = computed(() => {
  return parseFormattedText(props.content);
});
</script>

<style scoped>
.formatted-message {
  line-height: 1.6;
  color: #333;
}

/* 标题样式 */
.message-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
  margin: 20rpx 0 10rpx 0;
  padding-bottom: 10rpx;
  border-bottom: 2rpx solid #3498db;
}

/* 段落样式 */
.paragraph {
  margin: 15rpx 0;
  font-size: 28rpx;
  line-height: 1.6;
}

/* 列表项样式 */
.list-item {
  display: flex;
  align-items: flex-start;
  margin: 12rpx 0;
  font-size: 28rpx;
}

.list-bullet {
  color: #3498db;
  margin-right: 15rpx;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 2rpx;
}

.list-content {
  flex: 1;
}

/* 加粗文本样式 */
.bold-text {
  font-weight: bold;
  color: #e74c3c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-title {
    font-size: 30rpx;
  }
  
  .paragraph, .list-item {
    font-size: 26rpx;
  }
}
</style>