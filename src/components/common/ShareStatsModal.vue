<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <!-- 标题 -->
              <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-slate-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                分享详情
              </DialogTitle>

              <!-- 加载状态 -->
              <div v-if="loading" class="py-12 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-4 text-slate-600">加载中...</p>
              </div>

              <!-- 内容 -->
              <div v-else-if="stats" class="space-y-6">
                <!-- 基本信息 -->
                <div class="bg-slate-50 rounded-lg p-4">
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-600">策略名称</span>
                      <span class="text-sm font-medium text-slate-900">{{ stats.bot_name }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-600">分享状态</span>
                      <span class="text-sm font-medium">
                        <span v-if="stats.visibility === 'public'" class="flex items-center gap-1 text-green-600">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          公开
                        </span>
                        <span v-else-if="stats.visibility === 'followers_only'" class="flex items-center gap-1 text-orange-600">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          仅关注者
                        </span>
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-600">分享时间</span>
                      <span class="text-sm font-medium text-slate-900">{{ formatDate(stats.created_at) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 数据统计 -->
                <div>
                  <h4 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    数据统计
                  </h4>
                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-blue-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-blue-600">{{ stats.view_count }}</div>
                      <div class="text-xs text-slate-600 mt-1">浏览次数</div>
                    </div>
                    <div class="bg-green-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-green-600">{{ stats.copy_count }}</div>
                      <div class="text-xs text-slate-600 mt-1">复制次数</div>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-4 text-center">
                      <div class="text-2xl font-bold text-purple-600">{{ stats.total_copiers }}</div>
                      <div class="text-xs text-slate-600 mt-1">复制用户</div>
                    </div>
                  </div>
                </div>

                <!-- 分享链接 -->
                <div>
                  <h4 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    分享链接
                  </h4>
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      :value="stats.share_url"
                      readonly
                      class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600"
                    />
                    <button
                      @click="copyShareLink"
                      class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      复制链接
                    </button>
                  </div>
                </div>

                <!-- 最近复制的用户 -->
                <div v-if="stats.copiers && stats.copiers.length > 0">
                  <h4 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    最近复制的用户
                  </h4>
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    <div
                      v-for="copier in stats.copiers"
                      :key="copier.id"
                      class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span class="text-sm font-medium text-blue-600">{{ copier.username.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-900">{{ copier.username }}</div>
                          <div class="text-xs text-slate-500">{{ copier.email }}</div>
                        </div>
                      </div>
                      <div class="text-xs text-slate-500">{{ formatRelativeTime(copier.copied_at) }}</div>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                  <button
                    @click="editShareSettings"
                    class="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    修改分享设置
                  </button>
                  <div class="flex gap-2">
                    <button
                      @click="unshare"
                      :disabled="unsharing"
                      class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {{ unsharing ? '取消中...' : '取消分享' }}
                    </button>
                    <button
                      @click="closeModal"
                      class="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      关闭
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { botAPI } from '../../utils/api'
import { showSuccess, showError } from '../../utils/notification'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  botId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'unshared', 'edit'])

const loading = ref(false)
const unsharing = ref(false)
const stats = ref(null)

// 监听弹窗打开，加载数据
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.botId) {
    loadStats()
  }
})

// 加载分享统计
const loadStats = async () => {
  try {
    loading.value = true
    const response = await botAPI.getShareStats(props.botId)
    stats.value = response.data
  } catch (error) {
    console.error('加载分享统计失败:', error)
    showError('加载分享统计失败，请稍后重试', '加载失败')
  } finally {
    loading.value = false
  }
}

// 复制分享链接
const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(stats.value.share_url)
    showSuccess('分享链接已复制到剪贴板，可以分享给好友了', '复制成功')
  } catch (error) {
    console.error('复制失败:', error)
    showError('复制失败，请手动复制链接', '复制失败')
  }
}

// 取消分享
const unshare = async () => {
  if (!confirm('确定要取消分享吗？取消后其他用户将无法查看和复制该策略。')) {
    return
  }

  try {
    unsharing.value = true
    await botAPI.unshareBot(props.botId)
    showSuccess('策略已取消分享，其他用户将无法再查看', '取消成功')
    emit('unshared')
    closeModal()
  } catch (error) {
    console.error('取消分享失败:', error)
    showError(error.response?.data?.error || '取消分享失败，请稍后重试', '取消失败')
  } finally {
    unsharing.value = false
  }
}

// 修改分享设置
const editShareSettings = () => {
  emit('edit')
  closeModal()
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化相对时间
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}
</script>

