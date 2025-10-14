<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Market Data -->
    <div class="bg-white rounded-xl p-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Market Data</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Funding Rate</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ formatFundingRate(primaryExchange?.funding_rate) }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Open Interest</span>
          <span class="text-sm font-semibold text-gray-900">
            ${{ formatLargeNumber(totalOpenInterest) }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Long/Short Ratio</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ formatRatio(primaryExchange?.long_short_ratio) }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-sm text-gray-600">Risk Score</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ token?.risk_score || 0 }}/100
          </span>
        </div>
      </div>
    </div>

    <!-- Contract Specs -->
    <div class="bg-white rounded-xl p-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Contract Specifications</h3>
      <div v-if="primaryExchange?.contract_spec" class="space-y-3">
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Max Leverage</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ primaryExchange.contract_spec.max_leverage }}x
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Maker Fee</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ formatFeeRate(primaryExchange.contract_spec.maker_fee_rate) }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Taker Fee</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ formatFeeRate(primaryExchange.contract_spec.taker_fee_rate) }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-sm text-gray-600">Min Order</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ primaryExchange.contract_spec.min_order_qty }}
          </span>
        </div>
      </div>
      <div v-else class="text-sm text-gray-400">No contract data available</div>
    </div>

  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) }
})

const primaryExchange = computed(() => {
  if (!props.exchanges || props.exchanges.length === 0) return null
  const binance = props.exchanges.find(e => e.exchange === 'binance')
  return binance || props.exchanges[0]
})

const totalOpenInterest = computed(() => {
  if (!props.exchanges || props.exchanges.length === 0) return 0
  return props.exchanges.reduce((sum, exchange) => {
    return sum + parseFloat(exchange.open_interest_value || 0)
  }, 0)
})

const formatFundingRate = (rate) => {
  if (!rate) return '-'
  return (parseFloat(rate) * 100).toFixed(4) + '%'
}

const formatLargeNumber = (value) => {
  if (!value) return '0'
  const num = parseFloat(value)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  return num.toFixed(2)
}

const formatRatio = (ratio) => {
  if (!ratio) return '-'
  return parseFloat(ratio).toFixed(2)
}

const formatFeeRate = (rate) => {
  if (!rate) return '-'
  return (parseFloat(rate) * 100).toFixed(3) + '%'
}
</script>

