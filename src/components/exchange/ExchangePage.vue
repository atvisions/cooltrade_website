<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="exchanges" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">我的交易所</h1>
            <p class="text-gray-600 mt-2">管理您的交易所账户和API密钥</p>
          </div>

          <!-- 已绑定的交易所 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">已绑定的交易所</h3>
              <button
                @click="() => { console.log('点击绑定按钮'); showBindModal = true; console.log('showBindModal:', showBindModal) }"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <PlusIcon class="w-5 h-5" />
                <span>绑定新交易所</span>
              </button>
            </div>

            <!-- 同步提示 -->
            <div v-if="isSyncing" class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <div class="flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>
                  <p class="text-sm font-medium text-blue-800">正在同步余额...</p>
                  <p class="text-xs text-blue-600 mt-1">正在获取实时价格并计算总资产，请稍候</p>
                </div>
              </div>
            </div>

            <!-- 交易所列表 -->
            <div v-if="exchanges.length > 0" class="space-y-4">
              <ExchangeCard
                v-for="exchange in exchanges"
                :key="exchange.id"
                :exchange="exchange"
                @sync="syncExchange"
                @edit="editExchange"
                @unbind="unbindExchange"
                @toggle-status="toggleExchangeStatus"
              />
            </div>

            <!-- 空状态 -->
            <div v-else class="text-center py-12">
              <div class="text-6xl mb-4">🏦</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">还没有绑定交易所</h3>
              <p class="text-gray-600 mb-6">绑定交易所后，即可使用自动交易功能</p>
              <button
                @click="() => { console.log('点击空状态按钮'); showBindModal = true; console.log('showBindModal:', showBindModal) }"
                class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium inline-flex items-center space-x-2"
              >
                <PlusIcon class="w-5 h-5" />
                <span>绑定第一个交易所</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 绑定交易所弹窗 -->
    <BindExchangeModal
      v-if="showBindModal"
      ref="bindModalRef"
      @close="showBindModal = false"
      @success="handleBindSuccess"
    />

    <!-- 交易所详情弹窗 -->
    <ExchangeDetailModal
      v-if="showDetailModal"
      :exchange="selectedExchange"
      @close="showDetailModal = false"
    />

    <!-- 解绑确认弹窗 -->
    <ConfirmModal
      v-if="showUnbindConfirm"
      type="danger"
      title="确认解绑交易所"
      message="解绑后，该交易所的所有配置和数据将被删除，且无法恢复。确定要继续吗？"
      confirmText="确认解绑"
      cancelText="取消"
      @confirm="confirmUnbind"
      @cancel="cancelUnbind"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import ExchangeCard from './ExchangeCard.vue'
import BindExchangeModal from './BindExchangeModal.vue'
import ExchangeDetailModal from './ExchangeDetailModal.vue'
import ConfirmModal from '../common/ConfirmModal.vue'
import { exchangeAPI } from '../../utils/api'
import { showNotification } from '../../utils/notification'

// 状态
const exchanges = ref([])
const showBindModal = ref(false)
const showDetailModal = ref(false)
const selectedExchange = ref(null)
const isLoading = ref(false)
const showUnbindConfirm = ref(false)
const exchangeToUnbind = ref(null)
const bindModalRef = ref(null)

// 是否正在同步
const isSyncing = computed(() => {
  return exchanges.value.some(ex => ex.syncing === true)
})

// 加载交易所列表
const loadExchanges = async () => {
  isLoading.value = true
  try {
    const response = await exchangeAPI.getExchangeList()
    console.log('API 响应:', response)

    // 处理不同的响应格式
    let exchangeList = []
    if (Array.isArray(response)) {
      exchangeList = response
    } else if (response.results && Array.isArray(response.results)) {
      exchangeList = response.results
    } else if (response.data && Array.isArray(response.data)) {
      exchangeList = response.data
    } else {
      console.warn('未知的响应格式:', response)
      exchangeList = []
    }

    // 计算每个交易所的总余额和可用余额
    exchangeList.forEach(ex => {
      // 初始化同步状态
      ex.syncing = false

      if (ex.balance_snapshot && typeof ex.balance_snapshot === 'object') {
        // 新格式：包含 spot 和 future
        if (ex.balance_snapshot.total_usd !== undefined) {
          ex.total_balance = ex.balance_snapshot.total_usd
          ex.available_balance = ex.total_balance * 0.8
        }
        // 旧格式：直接是币种余额对象
        else {
          ex.total_balance = Object.values(ex.balance_snapshot).reduce((sum, val) => {
            if (typeof val === 'object' && val.total) {
              return sum + parseFloat(val.total || 0)
            }
            return sum + parseFloat(val || 0)
          }, 0)
          ex.available_balance = ex.total_balance * 0.8
        }
      } else {
        ex.total_balance = 0
        ex.available_balance = 0
      }

      // 设置权限标志
      ex.has_read_permission = ex.permissions?.read || false
      ex.has_trade_permission = ex.permissions?.trade || false
    })

    exchanges.value = exchangeList
  } catch (error) {
    console.error('加载交易所列表失败:', error)
    showNotification({
      type: 'error',
      title: '加载失败',
      message: error.message || '请重试'
    })
    exchanges.value = []
  } finally {
    isLoading.value = false
  }
}

// 同步交易所
const syncExchange = async (exchangeId) => {
  const exchange = exchanges.value.find(ex => ex.id === exchangeId)
  if (!exchange) return

  // 防止重复点击
  if (exchange.syncing) {
    console.log('正在同步中，请稍候...')
    return
  }

  try {
    console.log('开始同步余额，交易所ID:', exchangeId)
    exchange.syncing = true

    const response = await exchangeAPI.syncBalance(exchangeId)
    console.log('同步余额响应:', response)

    // 后端现在返回完整的交易所对象（包含权限信息）
    const updatedExchange = response.data || response
    console.log('更新后的交易所数据:', updatedExchange)

    // 更新本地数据
    const index = exchanges.value.findIndex(ex => ex.id === exchangeId)
    if (index !== -1) {
      // 使用后端返回的完整数据替换本地数据
      exchanges.value[index] = updatedExchange

      // 重新计算余额
      const ex = exchanges.value[index]
      console.log('balance_snapshot:', ex.balance_snapshot)

      if (ex.balance_snapshot && typeof ex.balance_snapshot === 'object') {
        // 新格式：包含 spot 和 future
        if (ex.balance_snapshot.total_usd !== undefined) {
          ex.total_balance = ex.balance_snapshot.total_usd
          ex.available_balance = ex.total_balance * 0.8
          console.log('使用新格式，total_balance:', ex.total_balance)
        }
        // 旧格式
        else {
          ex.total_balance = Object.values(ex.balance_snapshot).reduce((sum, val) => {
            if (typeof val === 'object' && val.total) {
              return sum + parseFloat(val.total || 0)
            }
            return sum + parseFloat(val || 0)
          }, 0)
          ex.available_balance = ex.total_balance * 0.8
          console.log('使用旧格式，total_balance:', ex.total_balance)
        }
      }

      // 设置权限标志
      ex.has_read_permission = ex.permissions?.read || false
      ex.has_trade_permission = ex.permissions?.trade || false

      // 确保 syncing 状态被重置
      ex.syncing = false
    }

    showNotification({
      type: 'success',
      title: '同步成功',
      message: `余额已更新，总资产: ${formatCurrency(exchange.total_balance)}`
    })
  } catch (error) {
    console.error('同步失败:', error)
    showNotification({
      type: 'error',
      title: '同步失败',
      message: error.message || '请重试'
    })
  } finally {
    if (exchange) {
      exchange.syncing = false
    }
  }
}

// 切换交易所状态（启用/暂停）
const toggleExchangeStatus = async (exchangeId) => {
  const exchange = exchanges.value.find(ex => ex.id === exchangeId)
  if (!exchange) return

  const newStatus = exchange.status === 'active' ? 'disabled' : 'active'
  const actionText = newStatus === 'active' ? '启用' : '暂停'

  try {
    // 调用 API 更新状态
    const response = await exchangeAPI.updateExchangeStatus(exchangeId, newStatus)

    // 更新本地数据
    exchange.status = newStatus

    showNotification({
      type: 'success',
      title: `${actionText}成功`,
      message: `交易所已${actionText}`
    })
  } catch (error) {
    console.error(`${actionText}失败:`, error)
    showNotification({
      type: 'error',
      title: `${actionText}失败`,
      message: error.message || '请重试'
    })
  }
}

// 编辑交易所
const editExchange = async (exchange) => {
  console.log('编辑交易所:', exchange)
  // 打开绑定弹窗，传入编辑模式和交易所数据
  showBindModal.value = true
  // 等待弹窗组件挂载后，设置编辑模式
  // 使用 setTimeout 确保组件完全挂载和渲染
  await nextTick()
  await nextTick() // 多次调用 nextTick 确保 DOM 更新完成

  setTimeout(() => {
    if (bindModalRef.value) {
      console.log('调用 setEditMode')
      bindModalRef.value.setEditMode(exchange)
    } else {
      console.error('bindModalRef 未找到')
    }
  }, 50)
}

// 解绑交易所 - 显示确认弹窗
const unbindExchange = (exchangeId) => {
  exchangeToUnbind.value = exchangeId
  showUnbindConfirm.value = true
}

// 确认解绑
const confirmUnbind = async () => {
  if (!exchangeToUnbind.value) return

  try {
    await exchangeAPI.deleteExchange(exchangeToUnbind.value)
    exchanges.value = exchanges.value.filter(ex => ex.id !== exchangeToUnbind.value)
    showNotification({
      type: 'success',
      title: '解绑成功',
      message: '交易所已解绑'
    })
  } catch (error) {
    console.error('解绑失败:', error)
    showNotification({
      type: 'error',
      title: '解绑失败',
      message: error.message || '请重试'
    })
  } finally {
    showUnbindConfirm.value = false
    exchangeToUnbind.value = null
  }
}

// 取消解绑
const cancelUnbind = () => {
  showUnbindConfirm.value = false
  exchangeToUnbind.value = null
}

// 绑定成功回调
const handleBindSuccess = (newExchange) => {
  console.log('绑定成功，新交易所:', newExchange)

  // 检查是否是编辑模式（更新现有交易所）
  const existingIndex = exchanges.value.findIndex(ex => ex.id === newExchange.id)
  if (existingIndex !== -1) {
    // 更新现有交易所
    exchanges.value[existingIndex] = newExchange
  } else {
    // 添加新交易所
    exchanges.value.push(newExchange)
  }

  showBindModal.value = false
  // 通知已经在 BindExchangeModal 中显示了，这里不需要重复
}

// 页面加载
onMounted(() => {
  loadExchanges()
})
</script>

