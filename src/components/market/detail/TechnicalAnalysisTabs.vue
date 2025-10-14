<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-200">
    <!-- Tabs Header -->
    <div class="border-b border-gray-200">
      <div class="flex space-x-1 p-2 bg-gray-50">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="tab.iconPath"/>
          </svg>
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      
      <!-- Technical Indicators Tab -->
      <div v-show="activeTab === 'indicators'" class="space-y-4">
        <TechnicalIndicatorsGrid
          :technical-indicator="technicalIndicator"
          :technical-signals="technicalSignals"
          :exchanges="exchanges"
          :token="token"
        />
      </div>

      <!-- On-Chain Indicators Tab -->
      <div v-show="activeTab === 'onchain'" class="space-y-4">
        <OnChainIndicators
          :indicators="technicalIndicator"
        />
      </div>

      <!-- Market Data Tab -->
      <div v-show="activeTab === 'market'" class="space-y-4">
        <MarketDataGrid 
          :exchanges="exchanges"
          :token="token"
        />
      </div>

      <!-- AI Strategies Tab -->
      <div v-show="activeTab === 'strategies'" class="space-y-4">
        <AIStrategiesGrid 
          :strategies="strategies"
          :market-condition="marketCondition"
        />
      </div>

      <!-- Order Book Tab -->
      <div v-show="activeTab === 'orderbook'">
        <OrderBookView />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import TechnicalIndicatorsGrid from './TechnicalIndicatorsGrid.vue'
import OnChainIndicators from './OnChainIndicators.vue'
import MarketDataGrid from './MarketDataGrid.vue'
import AIStrategiesGrid from './AIStrategiesGrid.vue'
import OrderBookView from './OrderBookView.vue'

const props = defineProps({
  technicalIndicator: { type: Object, default: null },
  technicalSignals: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) },
  strategies: { type: Array, default: () => [] },
  marketCondition: { type: String, default: '' }
})

const tabs = [
  {
    id: 'indicators',
    name: '技术指标',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    id: 'onchain',
    name: '链上数据',
    iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
  },
  {
    id: 'market',
    name: '市场数据',
    iconPath: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
  },
  {
    id: 'strategies',
    name: 'AI策略',
    iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  },
  {
    id: 'orderbook',
    name: '订单簿',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  }
]

const activeTab = ref('indicators')
</script>

