<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" @click.self="closeModal">
    <div class="bg-white rounded-xl p-5 max-w-md w-full max-h-[85vh] overflow-y-auto">
      <!-- 步骤1: 选择支付方式 -->
      <div v-if="step === 1">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">选择支付方式</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-gray-600">购买套餐</div>
              <div class="text-base font-bold text-gray-900">{{ selectedPlan?.name }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-600">价格</div>
              <div class="text-xl font-bold text-blue-600">${{ selectedPlan?.price }}</div>
            </div>
          </div>
        </div>

        <div class="space-y-2.5">
          <button
            @click="selectPaymentMethod('crypto')"
            class="w-full p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2.5">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">加密货币支付</div>
                  <div class="text-xs text-gray-500">支持 USDT/USDC 多链支付</div>
                </div>
              </div>
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            disabled
            class="w-full p-3 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2.5">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div class="text-left">
                  <div class="text-sm font-semibold text-gray-900">支付宝/微信</div>
                  <div class="text-xs text-gray-500">即将上线</div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 步骤2: 加密货币支付 -->
      <div v-else-if="step === 2">
        <CryptoPayment
          :plan="selectedPlan"
          @success="handlePaymentSuccess"
          @back="step = 1"
        />
      </div>

      <!-- 底部按钮 -->
      <button
        v-if="step === 1"
        @click="closeModal"
        class="mt-4 w-full py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        取消
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CryptoPayment from './CryptoPayment.vue'

const props = defineProps({
  show: Boolean,
  selectedPlan: Object
})

const emit = defineEmits(['close', 'success'])

const step = ref(1)

// 监听 show 变化，重置步骤
watch(() => props.show, (newVal) => {
  if (newVal) {
    step.value = 1
  }
})

function selectPaymentMethod(method) {
  if (method === 'crypto') {
    step.value = 2
  }
}

function closeModal() {
  step.value = 1
  emit('close')
}

function handlePaymentSuccess() {
  emit('success')
  closeModal()
}
</script>

<style scoped>
/* 添加滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

