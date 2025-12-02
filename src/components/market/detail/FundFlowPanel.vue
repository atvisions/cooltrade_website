<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
        {{ symbol }}{{ marketType === 'futures' ? '合约' : '现货' }}流入流出
      </h3>
      <!-- 现货/合约切换 -->
      <div class="flex gap-1 bg-gray-100 p-1 rounded-lg">
        <button
          @click="marketType = 'spot'"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-all',
            marketType === 'spot' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          ]"
        >现货</button>
        <button
          @click="marketType = 'futures'"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-all',
            marketType === 'futures' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          ]"
        >合约</button>
      </div>
    </div>

    <!-- 内容 -->
    <div class="p-0">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>

      <template v-else-if="flowData && flowData.periods">
        <!-- 表格 -->
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50">
              <th class="text-left py-3 px-4 font-medium text-gray-500">时间</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">流入</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">流出</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">净流入</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">净流入变化</th>
              <th class="text-right py-3 px-4 font-medium text-gray-500">净流入/市值</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in flowData.periods"
              :key="row.period"
              class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 px-4 font-medium text-gray-900">{{ periodLabels[row.period] || row.period }}</td>
              <td class="py-3 px-4 text-right text-gray-700">{{ formatCurrency(row.inflow) }}</td>
              <td class="py-3 px-4 text-right text-gray-700">{{ formatCurrency(row.outflow) }}</td>
              <td class="py-3 px-4 text-right font-medium" :class="row.net_flow >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ row.net_flow >= 0 ? '' : '-' }}{{ formatCurrency(Math.abs(row.net_flow)) }}
              </td>
              <td class="py-3 px-4 text-right font-medium" :class="row.net_flow_change >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ row.net_flow_change >= 0 ? '+' : '' }}{{ row.net_flow_change.toFixed(2) }}%
              </td>
              <td class="py-3 px-4 text-right font-medium" :class="row.net_flow_market_cap_ratio >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ row.net_flow_market_cap_ratio >= 0 ? '' : '' }}{{ row.net_flow_market_cap_ratio.toFixed(4) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <div v-else class="text-center py-8 text-gray-400">暂无数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { apiRequest, API_ENDPOINTS } from '../../../utils/api.js'

const props = defineProps({
  symbol: { type: String, required: true },
  defaultMarketType: { type: String, default: 'futures' }
})

const marketType = ref(props.defaultMarketType)
const loading = ref(false)
const flowData = ref(null)

// 时间周期中文标签
const periodLabels = {
  '5m': '5分钟',
  '15m': '15分钟',
  '30m': '30分钟',
  '1h': '1小时',
  '4h': '4小时',
  '8h': '8小时',
  '12h': '12小时',
}

// 格式化货币（带单位）
const formatCurrency = (val) => {
  if (!val && val !== 0) return '-'
  const absVal = Math.abs(val)
  if (absVal >= 1e8) return '$' + (val / 1e8).toFixed(2) + '亿'
  if (absVal >= 1e4) return '$' + (val / 1e4).toFixed(2) + '万'
  return '$' + val.toFixed(2)
}

const loadData = async () => {
  if (!props.symbol) return
  loading.value = true
  try {
    const url = `${API_ENDPOINTS.MARKET_TOKEN_FUND_FLOW(props.symbol)}?market_type=${marketType.value}`
    const response = await apiRequest(url)
    if (response.status === 'success') {
      flowData.value = response.data
    }
  } catch (err) {
    console.error('加载资金流向失败:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch([() => props.symbol, marketType], loadData)
</script>

