<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-semibold text-gray-900">快速操作</h4>
        <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
      </div>
    </div>
    <div class="p-6 space-y-4">
      <button class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg">
        新建策略
      </button>
      <button class="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200">
        风险评估
      </button>
      <button class="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200">
        资金管理
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

