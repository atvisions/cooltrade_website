<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">策略市场</h1>
        <p class="text-gray-600">发现和订阅优质交易策略</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">筛选条件</h3>

            <!-- Category Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">策略类型</label>
              <div class="space-y-2">
                <label v-for="cat in categories" :key="cat.value" class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="selectedCategories"
                    :value="cat.value"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ cat.label }}</span>
                </label>
              </div>
            </div>

            <!-- Risk Level Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">风险等级</label>
              <div class="space-y-2">
                <label v-for="risk in riskLevels" :key="risk.value" class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="selectedRisks"
                    :value="risk.value"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ risk.label }}</span>
                </label>
              </div>
            </div>

            <!-- Return Range Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">收益率范围</label>
              <select v-model="returnRange" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">全部</option>
                <option value="0-10">0% - 10%</option>
                <option value="10-30">10% - 30%</option>
                <option value="30-50">30% - 50%</option>
                <option value="50+">50%+</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="statusFilter"
                    value="all"
                    class="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">全部</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="statusFilter"
                    value="active"
                    class="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">运行中</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="statusFilter"
                    value="stopped"
                    class="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">已停止</span>
                </label>
              </div>
            </div>

            <button
              @click="resetFilters"
              class="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              重置筛选
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Search and Sort -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex-1 min-w-[300px]">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索策略名称、描述..."
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
                <option value="winRate">胜率</option>
                <option value="trades">交易次数</option>
                <option value="recent">最新发布</option>
              </select>
            </div>
          </div>

          <!-- Strategy Cards -->
          <div class="space-y-6">
            <div
              v-for="strategy in filteredStrategies"
              :key="strategy.id"
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <!-- Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">{{ strategy.name }}</h3>
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      strategy.risk === 'low' ? 'bg-green-100 text-green-800' :
                      strategy.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ getRiskLabel(strategy.risk) }}
                    </span>
                    <span class="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {{ getCategoryLabel(strategy.category) }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mb-3">{{ strategy.description }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                      </svg>
                      {{ strategy.author }}
                    </span>
                    <span>{{ strategy.subscribers }} 订阅</span>
                  </div>
                </div>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  strategy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]">
                  {{ strategy.status === 'active' ? '运行中' : '已停止' }}
                </span>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
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
                  <div class="text-xs text-gray-500 mb-1">最大回撤</div>
                  <div class="text-lg font-bold text-red-600">-{{ strategy.maxDrawdown }}%</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">夏普比率</div>
                  <div class="text-lg font-bold text-gray-900">{{ strategy.sharpeRatio }}</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-3">
                <button class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  查看详情
                </button>
                <button class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  订阅策略
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
          <div v-if="filteredStrategies.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无策略</h3>
            <p class="text-gray-600">尝试调整搜索条件或筛选器</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredStrategies.length > 0" class="mt-8 flex items-center justify-center space-x-2">
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
              上一页
            </button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '../common/Header.vue'

// 响应式数据
const searchQuery = ref('')
const sortBy = ref('popular')
const selectedCategories = ref([])
const selectedRisks = ref([])
const returnRange = ref('all')
const statusFilter = ref('all')

// 筛选选项
const categories = [
  { value: 'grid', label: '网格交易' },
  { value: 'trend', label: '趋势跟踪' },
  { value: 'arbitrage', label: '套利' },
  { value: 'dca', label: '定投' },
  { value: 'swing', label: '波段交易' },
  { value: 'scalping', label: '剥头皮' }
]

const riskLevels = [
  { value: 'low', label: '低风险' },
  { value: 'medium', label: '中风险' },
  { value: 'high', label: '高风险' }
]

// 模拟策略数据
const strategies = ref([
  { id: 1, name: 'BTC网格交易策略', description: '适合震荡市场的BTC网格交易策略，自动低买高卖，稳定获利', author: 'CryptoMaster', category: 'grid', risk: 'low', status: 'active', return: 23.5, trades: 156, winRate: 68, maxDrawdown: 8.5, sharpeRatio: 1.8, subscribers: 234 },
  { id: 2, name: 'ETH趋势跟踪策略', description: '基于移动平均线的ETH趋势跟踪策略，捕捉大趋势', author: 'QuantTrader', category: 'trend', risk: 'medium', status: 'active', return: 45.2, trades: 89, winRate: 72, maxDrawdown: 15.2, sharpeRatio: 2.1, subscribers: 567 },
  { id: 3, name: 'DCA定投策略', description: '定期定额投资策略，降低市场波动风险，适合长期投资', author: 'BlockchainPro', category: 'dca', risk: 'low', status: 'active', return: 15.8, trades: 234, winRate: 65, maxDrawdown: 5.3, sharpeRatio: 1.5, subscribers: 123 },
  { id: 4, name: '跨交易所套利策略', description: '捕捉不同交易所之间的价格差异，低风险套利', author: 'DeFiKing', category: 'arbitrage', risk: 'low', status: 'active', return: 12.3, trades: 456, winRate: 78, maxDrawdown: 3.2, sharpeRatio: 2.5, subscribers: 345 },
  { id: 5, name: 'BTC波段交易策略', description: '捕捉BTC中短期价格波动，适合有经验的交易者', author: 'NFTCollector', category: 'swing', risk: 'high', status: 'stopped', return: 8.9, trades: 67, winRate: 62, maxDrawdown: 18.7, sharpeRatio: 1.2, subscribers: 89 },
  { id: 6, name: '多币种网格策略', description: '同时运行多个币种的网格策略，分散风险', author: 'SmartContract', category: 'grid', risk: 'medium', status: 'active', return: 34.6, trades: 123, winRate: 58, maxDrawdown: 12.4, sharpeRatio: 1.9, subscribers: 456 }
])

// 计算属性 - 过滤后的策略
const filteredStrategies = computed(() => {
  let result = strategies.value

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(s =>
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 类型过滤
  if (selectedCategories.value.length > 0) {
    result = result.filter(s => selectedCategories.value.includes(s.category))
  }

  // 风险过滤
  if (selectedRisks.value.length > 0) {
    result = result.filter(s => selectedRisks.value.includes(s.risk))
  }

  // 收益率过滤
  if (returnRange.value !== 'all') {
    const [min, max] = returnRange.value.split('-').map(v => v === '+' ? Infinity : parseFloat(v))
    result = result.filter(s => s.return >= min && (max ? s.return <= max : true))
  }

  // 状态过滤
  if (statusFilter.value !== 'all') {
    result = result.filter(s => s.status === statusFilter.value)
  }

  // 排序
  if (sortBy.value === 'return') {
    result = [...result].sort((a, b) => b.return - a.return)
  } else if (sortBy.value === 'winRate') {
    result = [...result].sort((a, b) => b.winRate - a.winRate)
  } else if (sortBy.value === 'trades') {
    result = [...result].sort((a, b) => b.trades - a.trades)
  }

  return result
})

// 方法
const resetFilters = () => {
  selectedCategories.value = []
  selectedRisks.value = []
  returnRange.value = 'all'
  statusFilter.value = 'all'
  searchQuery.value = ''
}

const getRiskLabel = (risk) => {
  const labels = { low: '低风险', medium: '中风险', high: '高风险' }
  return labels[risk] || risk
}

const getCategoryLabel = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : category
}
</script>

