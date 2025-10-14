<template>
  <div class="bg-white rounded-xl p-6">
    <div class="grid grid-cols-2 gap-6">
      
      <!-- Asks (Sell Orders) -->
      <div>
        <h4 class="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Asks (Sell)</h4>
        <div class="space-y-1">
          <div v-for="i in 10" :key="'ask-' + i" class="flex justify-between text-xs">
            <span class="text-red-600 font-mono">{{ (45000 + i * 10).toFixed(2) }}</span>
            <span class="text-gray-600 font-mono">{{ (Math.random() * 2).toFixed(4) }}</span>
            <span class="text-gray-500 font-mono">${{ (Math.random() * 10000).toFixed(0) }}</span>
          </div>
        </div>
      </div>

      <!-- Bids (Buy Orders) -->
      <div>
        <h4 class="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Bids (Buy)</h4>
        <div class="space-y-1">
          <div v-for="i in 10" :key="'bid-' + i" class="flex justify-between text-xs">
            <span class="text-green-600 font-mono">{{ (44900 - i * 10).toFixed(2) }}</span>
            <span class="text-gray-600 font-mono">{{ (Math.random() * 2).toFixed(4) }}</span>
            <span class="text-gray-500 font-mono">${{ (Math.random() * 10000).toFixed(0) }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Order Book Stats -->
    <div class="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-xs text-gray-600 mb-1">Spread</div>
        <div class="text-sm font-semibold text-gray-900">0.05%</div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">Bid Volume</div>
        <div class="text-sm font-semibold text-green-600">$2.3M</div>
      </div>
      <div>
        <div class="text-xs text-gray-600 mb-1">Ask Volume</div>
        <div class="text-sm font-semibold text-red-600">$1.8M</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mock order book data
// In production, this would connect to WebSocket for real-time data
</script>

