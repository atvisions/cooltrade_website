<template>
  <div class="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:border-primary-300 transition-all duration-200">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <img :src="logo" alt="Token logo" class="w-10 h-10 rounded-full border-2 border-gray-200" />
        <div>
          <span class="font-semibold text-gray-900 text-lg">{{ pair }}</span>
          <div class="flex items-center space-x-2 mt-1">
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              direction === '做多' ? 'bg-success-100 text-success-700 border border-success-200' : 'bg-danger-100 text-danger-700 border border-danger-200'
            ]">
              {{ direction }}
            </span>
            <span class="px-2 py-1 text-xs font-medium bg-warning-100 text-warning-700 border border-warning-200 rounded-full">
              {{ leverage }}x
            </span>
            <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200 rounded-full">
              {{ exchange }}
            </span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm text-gray-500">风险等级</div>
        <span :class="[
          'font-medium text-sm',
          riskLevel === '低' ? 'text-success-600' : riskLevel === '中' ? 'text-warning-600' : 'text-danger-600'
        ]">{{ riskLevel }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="bg-white rounded-lg p-3 border border-gray-200">
        <div class="text-xs text-gray-500 mb-1">入场均价</div>
        <div class="font-semibold text-gray-900">${{ entryPrice }}</div>
      </div>
      <div class="bg-white rounded-lg p-3 border border-gray-200">
        <div class="text-xs text-gray-500 mb-1">保证金</div>
        <div class="font-semibold text-gray-900">${{ margin }}</div>
      </div>
    </div>

    <div class="bg-white rounded-lg p-4 mb-4 border border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">未实现盈亏</div>
        <div class="text-right">
          <div :class="[
            'font-bold text-lg',
            pnlValue > 0 ? 'text-success-600' : 'text-danger-600'
          ]">
            {{ pnlValue > 0 ? '+' : '' }}${{ pnlValue.toFixed(2) }}
          </div>
          <div :class="[
            'text-sm',
            pnlPercentageValue > 0 ? 'text-success-600' : 'text-danger-600'
          ]">
            {{ pnlPercentageValue > 0 ? '+' : '' }}{{ pnlPercentageValue.toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
      <span class="text-gray-500">创建时间</span>
      <span class="text-gray-700">{{ creationDate }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  logo: String,
  pair: String,
  direction: String,
  leverage: Number,
  exchange: String,
  riskLevel: String,
  entryPrice: Number,
  pnl: Number,
  pnlPercentage: Number,
  margin: Number,
  creationDate: String,
});

const pnlValue = computed(() => Number(props.pnl) || 0);
const pnlPercentageValue = computed(() => Number(props.pnlPercentage) || 0);

</script>

