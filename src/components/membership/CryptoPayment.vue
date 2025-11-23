<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <button @click="$emit('back')" class="text-gray-600 hover:text-gray-900 flex items-center text-sm">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>
      <h3 class="text-lg font-bold">加密货币支付</h3>
      <div class="w-12"></div>
    </div>

    <!-- 选择代币和网络 -->
    <div v-if="!order" class="space-y-3">
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1.5">选择代币</label>
        <select v-model="selectedToken" class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1.5">选择网络</label>
        <select v-model="selectedNetwork" class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="ethereum">Ethereum (ERC-20)</option>
          <option value="bsc">BSC (BEP-20)</option>
          <option value="polygon">Polygon</option>
        </select>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-gray-600">套餐价格</span>
          <span class="text-sm font-semibold">${{ plan.price }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600">预计支付</span>
          <span class="text-sm font-semibold text-blue-600">≈ {{ plan.price }} {{ selectedToken }}</span>
        </div>
      </div>

      <button
        @click="createOrder"
        :disabled="creating"
        class="w-full py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {{ creating ? '创建中...' : '创建订单' }}
      </button>
    </div>

    <!-- 显示支付信息 -->
    <div v-else class="space-y-3">
      <div class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
        <div class="text-xs text-gray-600 mb-1">订单号</div>
        <div class="font-mono text-xs font-semibold text-gray-900">{{ order.order_id }}</div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-gray-600">支付地址</span>
          <button @click="copyAddress" class="text-blue-600 text-xs hover:text-blue-700 flex items-center">
            <svg class="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            复制
          </button>
        </div>
        <div class="font-mono text-xs break-all bg-white p-2 rounded border border-gray-200">
          {{ order.payment_address }}
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div class="text-xs text-gray-600 mb-1">支付金额</div>
        <div class="text-2xl font-bold text-gray-900">{{ order.token_amount }} {{ selectedToken }}</div>
        <div class="text-xs text-gray-500 mt-0.5">≈ ${{ plan.price }}</div>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="text-xs text-yellow-800">
            <div class="font-semibold mb-1">重要提示</div>
            <ul class="list-disc list-inside space-y-0.5 text-xs">
              <li>请在 24 小时内完成支付</li>
              <li>请确保转账金额准确无误</li>
              <li>系统会自动检测支付状态</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 输入交易哈希（可选） -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1.5">
          交易哈希 (可选，加快验证速度)
        </label>
        <input
          v-model="txHash"
          type="text"
          placeholder="0x..."
          class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        @click="verifyPayment"
        :disabled="verifying || !txHash"
        class="w-full py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {{ verifying ? '验证中...' : '我已支付，立即验证' }}
      </button>

      <!-- 支付状态 -->
      <div class="text-center py-2">
        <div class="inline-flex items-center space-x-2 text-xs text-gray-500">
          <div class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-gray-300 border-t-blue-600"></div>
          <span>系统正在自动检测支付...</span>
        </div>
      </div>

      <!-- 取消订单 -->
      <button
        @click="handleCancelOrder"
        :disabled="cancelling"
        class="w-full py-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
      >
        {{ cancelling ? '取消中...' : '取消订单' }}
      </button>
    </div>

    <!-- 确认对话框 -->
    <ConfirmDialog
      :show="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :type="confirmDialog.type"
      :confirm-text="confirmDialog.confirmText"
      :cancel-text="confirmDialog.cancelText"
      @confirm="confirmDialog.onConfirm"
      @cancel="confirmDialog.onCancel"
      @close="confirmDialog.show = false"
    />
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import ConfirmDialog from '../common/ConfirmDialog.vue'
import { membershipAPI } from '@/utils/api'
import { showSuccess, showError, showWarning } from '@/utils/notification'

const props = defineProps({
  plan: Object
})

const emit = defineEmits(['success', 'back'])

const selectedToken = ref('USDT')
const selectedNetwork = ref('ethereum')
const order = ref(null)
const creating = ref(false)
const verifying = ref(false)
const cancelling = ref(false)
const txHash = ref('')

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  title: '确认',
  message: '',
  type: 'warning',
  confirmText: '确定',
  cancelText: '取消',
  onConfirm: () => {},
  onCancel: () => {}
})

// 轮询定时器
let pollingInterval = null

// 创建订单
async function createOrder() {
  creating.value = true
  try {
    const response = await membershipAPI.createCryptoOrder(
      props.plan.id,
      selectedToken.value,
      selectedNetwork.value
    )

    if (response.status === 'success') {
      // 后端返回的数据结构：{ order_id, payment_request }
      // 需要合并到一个对象中供前端使用
      const { order_id, payment_request } = response.data
      order.value = {
        order_id: order_id,
        payment_address: payment_request.receiver_address,
        token_amount: payment_request.token_amount,
        token_price: payment_request.token_price,
        amount_usd: payment_request.amount_usd,
        expires_at: payment_request.expires_at,
        network: payment_request.network,
        token_symbol: payment_request.token_symbol
      }
      showSuccess('订单创建成功，请完成支付')

      // 开始轮询支付状态
      startPolling()
    } else {
      showError(response.message || '创建订单失败')
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    showError('创建订单失败，请重试')
  } finally {
    creating.value = false
  }
}

// 验证支付
async function verifyPayment() {
  if (!txHash.value) {
    showWarning('请输入交易哈希')
    return
  }

  verifying.value = true
  try {
    const response = await membershipAPI.verifyCryptoPayment(
      order.value.order_id,
      txHash.value,
      selectedToken.value,
      selectedNetwork.value
    )

    if (response.status === 'success') {
      showSuccess('支付验证成功！会员已激活 🎉')
      stopPolling()
      emit('success')
    } else {
      showError(response.message || '支付验证失败，请稍后重试')
    }
  } catch (error) {
    console.error('支付验证失败:', error)
    showError('支付验证失败，请检查交易哈希是否正确')
  } finally {
    verifying.value = false
  }
}

// 轮询支付状态
function startPolling() {
  // 每5秒检查一次支付状态
  pollingInterval = setInterval(async () => {
    try {
      const response = await membershipAPI.getPaymentStatus(order.value.order_id)
      if (response.status === 'success' && response.data.status === 'paid') {
        stopPolling()
        showSuccess('支付成功！会员已激活 🎉')
        emit('success')
      }
    } catch (error) {
      console.error('轮询支付状态失败:', error)
    }
  }, 5000)
}

// 停止轮询
function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

// 复制地址
function copyAddress() {
  navigator.clipboard.writeText(order.value.payment_address)
  showSuccess('地址已复制到剪贴板')
}

// 处理取消订单
function handleCancelOrder() {
  confirmDialog.value = {
    show: true,
    title: '取消订单',
    message: '确定要取消订单吗？',
    type: 'danger',
    confirmText: '确定取消',
    cancelText: '返回',
    onConfirm: async () => {
      cancelling.value = true
      try {
        const response = await membershipAPI.cancelOrder(order.value.order_id)
        if (response.status === 'success') {
          showSuccess('订单已取消')
          stopPolling()
          emit('back')
        } else {
          showError(response.message || '取消订单失败')
        }
      } catch (error) {
        console.error('取消订单失败:', error)
        showError('取消订单失败')
      } finally {
        cancelling.value = false
      }
    },
    onCancel: () => {}
  }
}

// 组件卸载时停止轮询
onUnmounted(() => {
  stopPolling()
})
</script>



