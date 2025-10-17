<template>
  <div class="p-6 border-b border-gray-200">
    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"/>
      </svg>
      网格交易配置
    </h3>

    <!-- 主要参数 - 紧凑布局 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- 价格区间卡片 - 降低高度 -->
      <div class="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="text-xs font-medium text-gray-600">价格区间</div>
            <div class="text-[10px] text-gray-500">Price Range</div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
            {{ config.grid_type || 'Neutral' }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <div class="text-[10px] text-gray-500 mb-0.5">下限</div>
            <div class="text-xl font-bold text-blue-600">
              ${{ formatPrice(config.settings?.lower_price) }}
            </div>
          </div>
          <div>
            <div class="text-[10px] text-gray-500 mb-0.5">上限</div>
            <div class="text-xl font-bold text-indigo-600">
              ${{ formatPrice(config.settings?.higher_price) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 网格设置卡片 - 降低高度 -->
      <div class="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="text-xs font-medium text-gray-600">网格设置</div>
            <div class="text-[10px] text-gray-500">Grid Settings</div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700">
            {{ config.settings?.grids || 10 }}个
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <div class="text-[10px] text-gray-500 mb-0.5">网格数量</div>
            <div class="text-2xl font-bold text-orange-600">
              {{ config.settings?.grids || 10 }}
            </div>
          </div>
          <div>
            <div class="text-[10px] text-gray-500 mb-0.5">单格利润</div>
            <div class="text-2xl font-bold text-green-600">
              {{ config.settings?.profit_per_grid || 0 }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投资与配置 - 紧凑小卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <!-- 建议仓位 -->
      <div class="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-1.5">
          <div class="text-[10px] text-gray-500">建议仓位</div>
          <div class="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-purple-600">
          {{ config.position_size_percentage || config.settings?.position_size_percentage || 50 }}%
        </div>
        <div class="text-[10px] text-gray-500 mt-0.5">风险控制</div>
      </div>

      <!-- 保证金模式 -->
      <div class="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-1.5">
          <div class="text-[10px] text-gray-500">保证金模式</div>
          <div class="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-blue-600">
          {{ config.margin_mode_display || config.margin_mode || 'isolated' }}
        </div>
        <div class="text-[10px] text-gray-500 mt-0.5">风险隔离</div>
      </div>

      <!-- 仓位模式 -->
      <div class="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-1.5">
          <div class="text-[10px] text-gray-500">仓位模式</div>
          <div class="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-indigo-600">
          {{ config.position_mode_display || config.position_mode || 'one_way' }}
        </div>
        <div class="text-[10px] text-gray-500 mt-0.5">持仓方向</div>
      </div>

      <!-- 杠杆倍数 -->
      <div class="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-1.5">
          <div class="text-[10px] text-gray-500">杠杆倍数</div>
          <div class="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-orange-600">
          {{ config.leverage || 1 }}x
        </div>
        <div class="text-[10px] text-gray-500 mt-0.5">资金放大</div>
      </div>
    </div>

    <!-- 网格明细表 -->
    <div v-if="gridLevels.length > 0" class="mb-6">
      <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        网格明细表
        <span class="text-xs text-gray-500 font-normal">
          (共 {{ gridLevels.length }} 个网格)
        </span>
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-orange-50 border-b-2 border-orange-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-orange-700 uppercase">网格</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-orange-700 uppercase">买入价格</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-orange-700 uppercase">卖出价格</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-orange-700 uppercase">利润率</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="level in gridLevels"
                :key="level.level"
                class="hover:bg-orange-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900">网格 {{ level.level }}</td>
              <td class="px-4 py-3 text-right text-gray-900">${{ formatPrice(level.buy_price) }}</td>
              <td class="px-4 py-3 text-right text-gray-900">${{ formatPrice(level.sell_price) }}</td>
              <td class="px-4 py-3 text-right text-green-600 font-semibold">
                {{ calculateProfitRate(level.buy_price, level.sell_price) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 风险提示 -->
    <div v-if="config.risk_info?.risk_warning || config.risk_warning" class="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
          <div class="text-sm font-semibold text-yellow-800 mb-1">风险提示</div>
          <div class="text-sm text-yellow-700">
            {{ config.risk_info?.risk_warning || config.risk_warning }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const formatPrice = (price) => {
  if (!price) return '0.00'
  return parseFloat(price).toFixed(2)
}

const calculateProfitRate = (buyPrice, sellPrice) => {
  if (!buyPrice || !sellPrice) return '0.00'
  const rate = ((sellPrice - buyPrice) / buyPrice * 100).toFixed(2)
  return rate
}

// 获取网格明细
const gridLevels = computed(() => {
  // 优先根据设置自动生成（因为 AI 返回的 grid_levels 可能不完整）
  const settings = props.config.settings || {}
  const lowerPrice = parseFloat(settings.lower_price || 0)
  const higherPrice = parseFloat(settings.higher_price || 0)
  const grids = parseInt(settings.grids || props.config.grid_count || 10)

  // 如果有有效的价格区间和网格数量，自动生成完整的网格明细
  if (lowerPrice && higherPrice && lowerPrice < higherPrice && grids > 0) {
    const priceStep = (higherPrice - lowerPrice) / grids
    const levels = []

    for (let i = 0; i < grids; i++) {
      levels.push({
        level: i + 1,
        buy_price: lowerPrice + (priceStep * i),
        sell_price: lowerPrice + (priceStep * (i + 1))
      })
    }

    return levels
  }

  // 如果无法自动生成，尝试使用 AI 返回的网格明细
  if (props.config.grid_levels && props.config.grid_levels.length > 0) {
    return props.config.grid_levels
  }

  return []
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>

