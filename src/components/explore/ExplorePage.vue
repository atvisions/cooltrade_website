<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">探索</h1>
        <p class="text-gray-600">发现优秀的交易员和策略</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[300px]">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索用户、策略..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <select v-model="sortBy" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="popular">最受欢迎</option>
            <option value="return">收益率</option>
            <option value="followers">关注者</option>
            <option value="recent">最新</option>
          </select>

          <select v-model="filterType" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">全部</option>
            <option value="traders">交易员</option>
            <option value="strategies">策略</option>
          </select>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'traders'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'traders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              优秀交易员
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
              热门策略
            </button>
          </nav>
        </div>
      </div>

      <!-- Traders Tab -->
      <div v-if="activeTab === 'traders'" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="trader in filteredTraders"
          :key="trader.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
          @click="goToProfile(trader.id)"
        >
          <div class="flex items-start space-x-4 mb-4">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center flex-shrink-0">
              <img v-if="trader.avatar" :src="trader.avatar" :alt="trader.username" class="w-full h-full object-cover" />
              <span v-else class="text-white font-bold text-xl">{{ trader.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ trader.username }}</h3>
              <p class="text-sm text-gray-500 truncate">{{ trader.bio || '暂无简介' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="text-center">
              <div class="text-xl font-bold text-gray-900">{{ trader.strategies }}</div>
              <div class="text-xs text-gray-500">策略</div>
            </div>
            <div class="text-center">
              <div class="text-xl font-bold text-gray-900">{{ trader.followers }}</div>
              <div class="text-xs text-gray-500">关注者</div>
            </div>
            <div class="text-center">
              <div :class="['text-xl font-bold', trader.return >= 0 ? 'text-green-600' : 'text-red-600']">
                {{ trader.return >= 0 ? '+' : '' }}{{ trader.return }}%
              </div>
              <div class="text-xs text-gray-500">收益率</div>
            </div>
          </div>

          <button class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            查看主页
          </button>
        </div>
      </div>

      <!-- Strategies Tab -->
      <div v-if="activeTab === 'strategies'" class="grid md:grid-cols-2 gap-6">
        <div
          v-for="strategy in filteredStrategies"
          :key="strategy.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ strategy.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ strategy.description }}</p>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                  {{ strategy.author }}
                </span>
              </div>
            </div>
            <span :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              strategy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ strategy.status === 'active' ? '运行中' : '已停止' }}
            </span>
          </div>

          <div class="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div class="text-xs text-gray-500 mb-1">收益率</div>
              <div :class="['text-lg font-bold', strategy.return >= 0 ? 'text-green-600' : 'text-red-600']">
                {{ strategy.return >= 0 ? '+' : '' }}{{ strategy.return }}%
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">交易次数</div>
              <div class="text-lg font-bold text-gray-900">{{ strategy.trades }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">胜率</div>
              <div class="text-lg font-bold text-gray-900">{{ strategy.winRate }}%</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1">关注</div>
              <div class="text-lg font-bold text-gray-900">{{ strategy.followers }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              查看详情
            </button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="(activeTab === 'traders' && filteredTraders.length === 0) || (activeTab === 'strategies' && filteredStrategies.length === 0)" class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无结果</h3>
        <p class="text-gray-600">尝试调整搜索条件或筛选器</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('traders')
const searchQuery = ref('')
const sortBy = ref('popular')
const filterType = ref('all')

// 模拟数据 - 交易员
const traders = ref([
  { id: 1, username: 'CryptoMaster', avatar: null, bio: '专注DeFi和NFT交易', strategies: 15, followers: 1234, return: 45.6 },
  { id: 2, username: 'QuantTrader', avatar: null, bio: '量化交易专家', strategies: 23, followers: 2341, return: 67.8 },
  { id: 3, username: 'BlockchainPro', avatar: null, bio: '区块链技术爱好者', strategies: 8, followers: 567, return: 23.4 },
  { id: 4, username: 'DeFiKing', avatar: null, bio: 'DeFi协议研究员', strategies: 12, followers: 890, return: 34.5 },
  { id: 5, username: 'NFTCollector', avatar: null, bio: 'NFT收藏家和交易者', strategies: 6, followers: 456, return: 12.3 },
  { id: 6, username: 'SmartContract', avatar: null, bio: '智能合约开发者', strategies: 19, followers: 1567, return: 56.7 }
])

// 模拟数据 - 策略
const strategies = ref([
  { id: 1, name: '网格交易策略', description: '适合震荡市场的网格交易策略，自动低买高卖', author: 'CryptoMaster', status: 'active', return: 23.5, trades: 156, winRate: 68, followers: 234 },
  { id: 2, name: '趋势跟踪策略', description: '基于移动平均线的趋势跟踪策略', author: 'QuantTrader', status: 'active', return: 45.2, trades: 89, winRate: 72, followers: 567 },
  { id: 3, name: 'DCA定投策略', description: '定期定额投资策略，降低市场波动风险', author: 'BlockchainPro', status: 'active', return: 15.8, trades: 234, winRate: 65, followers: 123 },
  { id: 4, name: '套利策略', description: '跨交易所套利，捕捉价格差异', author: 'DeFiKing', status: 'active', return: 12.3, trades: 456, winRate: 78, followers: 345 },
  { id: 5, name: '波段交易策略', description: '捕捉中短期价格波动', author: 'NFTCollector', status: 'stopped', return: 8.9, trades: 67, winRate: 62, followers: 89 },
  { id: 6, name: '马丁格尔策略', description: '倍投策略，适合有经验的交易者', author: 'SmartContract', status: 'active', return: 34.6, trades: 123, winRate: 58, followers: 456 }
])

// 计算属性 - 过滤后的交易员
const filteredTraders = computed(() => {
  let result = traders.value

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(t =>
      t.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (t.bio && t.bio.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // 排序
  if (sortBy.value === 'return') {
    result = [...result].sort((a, b) => b.return - a.return)
  } else if (sortBy.value === 'followers') {
    result = [...result].sort((a, b) => b.followers - a.followers)
  }

  return result
})

// 计算属性 - 过滤后的策略
const filteredStrategies = computed(() => {
  let result = strategies.value

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(s =>
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 排序
  if (sortBy.value === 'return') {
    result = [...result].sort((a, b) => b.return - a.return)
  } else if (sortBy.value === 'followers') {
    result = [...result].sort((a, b) => b.followers - a.followers)
  }

  return result
})

// 方法
const goToProfile = (userId) => {
  router.push(`/profile/${userId}`)
}
</script>

