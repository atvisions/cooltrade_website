<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div class="px-6 py-4 border-b border-gray-100">
      <h4 class="text-lg font-semibold text-gray-900">热门策略</h4>
    </div>

    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <img :src="logo" alt="Token logo" class="w-10 h-10 rounded-full border-2 border-gray-200" />
          <div>
            <span class="font-semibold text-gray-900">{{ pair }}</span>
            <div class="flex items-center space-x-2 mt-1">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                direction === '做多' ? 'bg-success-100 text-success-700 border border-success-200' : 'bg-danger-100 text-danger-700 border border-danger-200'
              ]">
                {{ direction }}
              </span>
              <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200 rounded-full">
                {{ type }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4 bg-gray-50 rounded-lg p-3">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">策略创建者</div>
          <div class="text-sm text-gray-900 font-medium">@{{ creator }}</div>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="text-sm text-gray-600">历史胜率</div>
          <div class="text-sm text-success-600 font-semibold">{{ winRate }}%</div>
        </div>
      </div>

      <div class="space-y-3 mb-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">入场区间</span>
            <span class="font-medium text-gray-900">{{ entryRange }}</span>
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">止损价格</span>
            <span class="font-medium text-danger-600">{{ stopLoss }}</span>
          </div>
        </div>
      </div>

      <div class="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-warning-700">
            🔥 热门策略
          </p>
          <p class="text-sm text-warning-700">
            {{ followers }}人跟单
          </p>
        </div>
      </div>

      <button class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25">
        立即跟单
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  logo: String,
  pair: String,
  direction: String,
  type: String,
  creator: String,
  winRate: Number,
  entryRange: String,
  stopLoss: String,
  followers: Number,
});
</script>

