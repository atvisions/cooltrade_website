<template>
  <div class="bg-white rounded-xl overflow-hidden border border-gray-200">
    <!-- Header -->
    <div class="border-b border-gray-100 px-6 py-4">
      <h2 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        技术指标
      </h2>
    </div>

    <!-- Content -->
    <div class="p-6">
      <TechnicalIndicatorsGrid
        :technical-indicator="technicalIndicator"
        :technical-signals="technicalSignals"
        :exchanges="exchanges"
        :token="token"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import TechnicalIndicatorsGrid from './TechnicalIndicatorsGrid.vue'

const props = defineProps({
  technicalIndicator: { type: Object, default: null },
  technicalSignals: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) }
})
</script>

