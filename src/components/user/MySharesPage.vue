<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="my-shares" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">我的分享</h1>
            <p class="text-gray-600 mt-2">管理您分享的策略和机器人</p>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-slate-600">加载中...</p>
          </div>

          <!-- 内容 -->
          <div v-else>
            <!-- 总览统计 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600 mb-1">分享策略</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.total_shares }}</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600 mb-1">总浏览</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.total_views }}</p>
                  </div>
                  <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600 mb-1">总复制</p>
                    <p class="text-2xl font-bold text-gray-900">{{ stats.total_copies }}</p>
                  </div>
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600 mb-1">平均复制率</p>
                    <p class="text-2xl font-bold text-gray-900">{{ copyRate }}%</p>
                  </div>
                  <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- 策略列表 -->
            <div v-if="bots.length > 0" class="space-y-4">
              <div
                v-for="bot in bots"
                :key="bot.id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ bot.name }}</h3>
                      <span
                        v-if="bot.visibility === 'public'"
                        class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded flex items-center gap-1"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        公开
                      </span>
                      <span
                        v-else-if="bot.visibility === 'followers_only'"
                        class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded flex items-center gap-1"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        仅关注者
                      </span>
                      <span
                        v-if="bot.bot_type === 'signal'"
                        class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                      >
                        信号机器人
                      </span>
                      <span
                        v-else
                        class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded"
                      >
                        交易机器人
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-4">{{ bot.description || '暂无描述' }}</p>

                    <!-- 数据统计 -->
                    <div class="flex items-center gap-6 text-sm text-gray-600">
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>浏览 {{ bot.view_count }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>复制 {{ bot.copy_count }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>分享于 {{ formatDate(bot.created_at) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex gap-2">
                    <button
                      @click="viewStats(bot)"
                      class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      查看详情
                    </button>
                    <button
                      @click="editBot(bot)"
                      class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      @click="unshareBot(bot)"
                      class="px-4 py-2 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                    >
                      取消分享
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div class="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无分享的策略</h3>
              <p class="text-gray-600 mb-6">分享您的策略，让更多人受益</p>
              <router-link
                to="/signal-bots"
                class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                去分享策略
              </router-link>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 分享详情弹窗 -->
    <ShareStatsModal
      :is-open="showStatsModal"
      :bot-id="selectedBotId"
      @close="showStatsModal = false"
      @unshared="handleUnshared"
      @edit="handleEdit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import ShareStatsModal from '../common/ShareStatsModal.vue'
import { botAPI } from '../../utils/api'
import { showSuccess, showError } from '../../utils/notification'

const router = useRouter()

const loading = ref(false)
const bots = ref([])
const stats = ref({
  total_shares: 0,
  total_views: 0,
  total_copies: 0
})

const showStatsModal = ref(false)
const selectedBotId = ref(null)

// 计算平均复制率
const copyRate = computed(() => {
  if (stats.value.total_views === 0) return 0
  return ((stats.value.total_copies / stats.value.total_views) * 100).toFixed(1)
})

// 加载分享列表
const loadShares = async () => {
  try {
    loading.value = true
    const response = await botAPI.getMyShares()
    bots.value = response.data.bots
    stats.value = response.data.stats
  } catch (error) {
    console.error('加载分享列表失败:', error)
    showError('加载分享列表失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const viewStats = (bot) => {
  selectedBotId.value = bot.id
  showStatsModal.value = true
}

// 编辑机器人
const editBot = (bot) => {
  if (bot.bot_type === 'signal') {
    router.push(`/bots/edit-signal/${bot.id}`)
  } else {
    router.push(`/bots/edit/${bot.id}`)
  }
}

// 取消分享
const unshareBot = async (bot) => {
  if (!confirm(`确定要取消分享"${bot.name}"吗？取消后其他用户将无法查看和复制该策略。`)) {
    return
  }

  try {
    await botAPI.unshareBot(bot.id)
    showSuccess('已取消分享')
    await loadShares()
  } catch (error) {
    console.error('取消分享失败:', error)
    showError(error.response?.data?.error || '取消分享失败')
  }
}

// 处理取消分享
const handleUnshared = async () => {
  await loadShares()
}

// 处理编辑
const handleEdit = () => {
  showStatsModal.value = false
  const bot = bots.value.find(b => b.id === selectedBotId.value)
  if (bot) {
    editBot(bot)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(() => {
  loadShares()
})
</script>

