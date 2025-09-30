<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">合约策略市场</h1>
        <p class="text-gray-600 mt-2">发现和订阅优质交易策略</p>
      </div>

          <!-- 搜索和筛选 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div class="flex items-center gap-4 flex-wrap">
              <!-- 搜索框 -->
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

              <!-- 风险等级筛选 -->
              <div>
                <select v-model="filterRisk" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">全部风险</option>
                  <option value="low">低风险</option>
                  <option value="medium">中风险</option>
                  <option value="high">高风险</option>
                </select>
              </div>

              <!-- 策略类型筛选 -->
              <div>
                <select v-model="filterCategory" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">全部类型</option>
                  <option value="grid">网格交易</option>
                  <option value="trend">趋势跟踪</option>
                  <option value="arbitrage">套利</option>
                  <option value="dca">定投</option>
                  <option value="swing">波段交易</option>
                </select>
              </div>

              <!-- 排序 -->
              <div>
                <select v-model="sortBy" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="popular">最受欢迎</option>
                  <option value="return">收益率</option>
                  <option value="winRate">胜率</option>
                  <option value="recent">最新发布</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 策略列表 -->
          <div class="space-y-6">
            <div
              v-for="strategy in filteredStrategies"
              :key="strategy.id"
              class="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              <!-- 头部 -->
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

              <!-- 统计数据 -->
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

              <!-- 操作按钮 -->
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

          <!-- 空状态 -->
          <div v-if="filteredStrategies.length === 0" class="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div class="text-6xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无策略</h3>
            <p class="text-gray-600">尝试调整搜索条件或筛选器</p>
          </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '../common/Header.vue'

const searchQuery = ref('')
const sortBy = ref('popular')
const filterRisk = ref('')
const filterCategory = ref('')

const strategies = ref([
  { id: 1, name: 'BTC网格交易策略', description: '适合震荡市场的BTC网格交易策略，自动低买高卖，稳定获利', author: 'CryptoMaster', category: 'grid', risk: 'low', status: 'active', return: 23.5, trades: 156, winRate: 68, maxDrawdown: 8.5, sharpeRatio: 1.8, subscribers: 234 },
  { id: 2, name: 'ETH趋势跟踪策略', description: '基于移动平均线的ETH趋势跟踪策略，捕捉大趋势', author: 'QuantTrader', category: 'trend', risk: 'medium', status: 'active', return: 45.2, trades: 89, winRate: 72, maxDrawdown: 15.2, sharpeRatio: 2.1, subscribers: 567 },
  { id: 3, name: 'DCA定投策略', description: '定期定额投资策略，降低市场波动风险，适合长期投资', author: 'BlockchainPro', category: 'dca', risk: 'low', status: 'active', return: 15.8, trades: 234, winRate: 65, maxDrawdown: 5.3, sharpeRatio: 1.5, subscribers: 123 },
  { id: 4, name: '跨交易所套利策略', description: '捕捉不同交易所之间的价格差异，低风险套利', author: 'DeFiKing', category: 'arbitrage', risk: 'low', status: 'active', return: 12.3, trades: 456, winRate: 78, maxDrawdown: 3.2, sharpeRatio: 2.5, subscribers: 345 },
  { id: 5, name: 'BTC波段交易策略', description: '捕捉BTC中短期价格波动，适合有经验的交易者', author: 'NFTCollector', category: 'swing', risk: 'high', status: 'stopped', return: 8.9, trades: 67, winRate: 62, maxDrawdown: 18.7, sharpeRatio: 1.2, subscribers: 89 },
  { id: 6, name: '多币种网格策略', description: '同时运行多个币种的网格策略，分散风险', author: 'SmartContract', category: 'grid', risk: 'medium', status: 'active', return: 34.6, trades: 123, winRate: 58, maxDrawdown: 12.4, sharpeRatio: 1.9, subscribers: 456 }
])

const filteredStrategies = computed(() => {
  let result = strategies.value
  if (searchQuery.value) {
    result = result.filter(s =>
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  if (filterRisk.value) {
    result = result.filter(s => s.risk === filterRisk.value)
  }
  if (filterCategory.value) {
    result = result.filter(s => s.category === filterCategory.value)
  }
  if (sortBy.value === 'return') {
    result = [...result].sort((a, b) => b.return - a.return)
  } else if (sortBy.value === 'winRate') {
    result = [...result].sort((a, b) => b.winRate - a.winRate)
  } else if (sortBy.value === 'popular') {
    result = [...result].sort((a, b) => b.subscribers - a.subscribers)
  }
  return result
})

const getRiskLabel = (risk) => {
  const labels = { low: '低风险', medium: '中风险', high: '高风险' }
  return labels[risk] || risk
}

const getCategoryLabel = (category) => {
  const labels = {
    grid: '网格交易',
    trend: '趋势跟踪',
    arbitrage: '套利',
    dca: '定投',
    swing: '波段交易'
  }
  return labels[category] || category
}
</script>
