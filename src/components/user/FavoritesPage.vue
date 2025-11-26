<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="favorites" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">我的收藏</h1>
          <p class="text-gray-600 mt-2">管理您收藏的代币、策略和交易员</p>
        </div>

      <!-- 标签页 -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'tokens'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'tokens'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              代币收藏 ({{ tokens.length }})
            </button>
            <button
              @click="activeTab = 'strategies'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'strategies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              策略收藏 (8)
            </button>
            <button
              @click="activeTab = 'traders'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'traders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              交易员收藏 (4)
            </button>
          </nav>
        </div>
      </div>

      <!-- 代币收藏内容 -->
      <div v-if="activeTab === 'tokens'">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {{ error }}
        </div>

        <!-- Tokens Table -->
        <div v-else-if="tokens.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 w-12">#</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 min-w-[200px]">名称</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">价格</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">24h %</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">市值</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">交易量(24h)</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="(token, index) in tokens" :key="token.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3 text-sm text-gray-500">
                    {{ token.market_cap_rank || index + 1 }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <img v-if="token.logo" :src="token.logo" :alt="token.name" class="w-8 h-8 rounded-full" />
                      <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-xs font-bold text-gray-500">{{ token.symbol.substring(0, 1) }}</span>
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-semibold text-gray-900">{{ token.name }}</span>
                          <span class="text-xs text-gray-500 uppercase">{{ token.symbol }}</span>
                        </div>
                        <div v-if="token.category" class="mt-1">
                          <span class="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                            {{ getCategoryLabel(token.category) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    ${{ formatPrice(parseFloat(token.current_price)) }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-medium">
                    <span :class="getChangeColor(parseFloat(token.price_change_percentage_24h))">
                      {{ token.price_change_24h_formatted }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right text-sm text-gray-900">
                    {{ token.market_cap_formatted }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm text-gray-900">
                    {{ token.volume_formatted }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      @click="removeFavorite(token)"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isFavoriteProcessing(token.symbol)"
                      title="取消收藏"
                    >
                      <!-- Loading状态 -->
                      <svg
                        v-if="isFavoriteProcessing(token.symbol)"
                        class="w-5 h-5 text-gray-400 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <!-- 取消收藏图标 -->
                      <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="text-6xl mb-4">💝</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无收藏的代币</h3>
          <p class="text-gray-600 mb-6">去市场页面收藏您感兴趣的代币</p>
          <router-link
            to="/market"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            去市场
          </router-link>
        </div>
      </div>

      <!-- 策略和交易员收藏内容 -->
      <div v-else class="grid md:grid-cols-2 gap-6">
        <!-- 占位卡片 -->
        <div
          v-for="i in 6"
          :key="i"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ activeTab === 'strategies' ? '策略名称' : '交易员名称' }} {{ i }}
              </h3>
              <p class="text-sm text-gray-600">这是一个示例描述...</p>
            </div>
            <button class="text-red-500 hover:text-red-700">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
              </svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>收藏于 2024-01-15</span>
            <button class="text-blue-600 hover:text-blue-700 font-medium">查看详情</button>
          </div>
        </div>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import { apiRequest, API_ENDPOINTS } from '../../utils/api.js'
import { showUnfavoriteSuccess, showError } from '../../utils/notification.js'

const activeTab = ref('tokens')
const tokens = ref([])
const loading = ref(false)
const error = ref(null)
const favoriteProcessing = ref(new Set()) // 正在处理收藏的代币集合
const recentlyProcessed = ref(new Map()) // 最近操作的代币和时间

// 检查是否正在处理
const isFavoriteProcessing = (symbol) => {
  return favoriteProcessing.value.has(symbol)
}

// 检查是否在冷却期内
const isInCooldown = (symbol) => {
  const lastTime = recentlyProcessed.value.get(symbol)
  if (!lastTime) return false

  const cooldownPeriod = 1000 // 1秒冷却期
  return Date.now() - lastTime < cooldownPeriod
}

// 格式化价格
const formatPrice = (price) => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 0.01) {
    return price.toFixed(4)
  } else {
    return price.toFixed(6)
  }
}

// 获取涨跌颜色
const getChangeColor = (value) => {
  const numValue = parseFloat(value)
  if (numValue > 0) return 'text-green-600'
  if (numValue < 0) return 'text-red-600'
  return 'text-gray-600'
}

// 获取分类标签
const getCategoryLabel = (category) => {
  const labels = {
    'layer1': 'L1',
    'layer2': 'L2',
    'defi': 'DeFi',
    'nft': 'NFT',
    'meme': 'Meme',
    'ai': 'AI',
    'gaming': 'Gaming'
  }
  return labels[category] || category
}

// 加载收藏的代币
const loadFavoriteTokens = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKENS_FAVORITES)

    if (response.status === 'success') {
      tokens.value = response.data || []
    } else {
      tokens.value = []
    }
  } catch (err) {
    console.error('加载收藏代币失败:', err)
    error.value = '加载数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 取消收藏
const removeFavorite = async (token) => {
  // 防止重复点击
  if (favoriteProcessing.value.has(token.symbol)) {
    return
  }

  // 检查冷却期
  if (isInCooldown(token.symbol)) {
    return
  }

  try {
    // 标记为处理中
    favoriteProcessing.value.add(token.symbol)

    const response = await apiRequest(
      API_ENDPOINTS.MARKET_TOKEN_TOGGLE_FAVORITE(token.symbol),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.status === 'success') {
      // 从列表中移除
      tokens.value = tokens.value.filter(t => t.id !== token.id)

      // 显示通知
      showUnfavoriteSuccess(token.name || token.symbol)
    }
  } catch (err) {
    console.error('取消收藏失败:', err)
    showError('操作失败，请稍后重试')
  } finally {
    // 移除处理中标记
    favoriteProcessing.value.delete(token.symbol)

    // 记录最后操作时间
    recentlyProcessed.value.set(token.symbol, Date.now())
  }
}

// 监听TAB切换
watch(activeTab, (newTab) => {
  if (newTab === 'tokens') {
    loadFavoriteTokens()
  }
})

// 组件挂载时加载数据
onMounted(() => {
  loadFavoriteTokens()
})
</script>

