<template>
  <!-- 背景遮罩 -->
  <div class="fixed inset-0 z-50 overflow-hidden">
    <div class="absolute inset-0 bg-black bg-opacity-30 transition-opacity" @click="handleClose"></div>

    <!-- 侧边栏面板 -->
    <div class="fixed inset-y-0 right-0 flex max-w-full">
      <div class="relative w-screen max-w-md">
        <div class="h-full flex flex-col bg-white shadow-xl">
          <!-- 头部 -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <!-- 返回按钮 - 编辑模式下不显示 -->
                <button
                  v-if="currentStep === 'config' && !isEditMode"
                  @click="currentStep = 'select'"
                  class="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ currentStep === 'select' ? '添加交易所' : (isEditMode ? `编辑 ${getExchangeName(formData.exchange)}` : `连接 ${getExchangeName(formData.exchange)}`) }}
                </h2>
              </div>
              <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-2">
              {{ isEditMode ? '更新您的 API 配置信息' : 'CoolTrade 不会获取您的提现或转账权限' }}
            </p>
          </div>

          <!-- 表单内容 - 可滚动区域 -->
          <div class="flex-1 overflow-y-auto">
            <!-- 步骤1: 选择交易所 -->
            <div v-if="currentStep === 'select'" class="px-6 py-6">
              <!-- 账户类型选择 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">账户类型</label>
                <div class="flex space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    @click="formData.is_testnet = false"
                    :class="[
                      'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      !formData.is_testnet
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    真实账户
                  </button>
                  <button
                    @click="formData.is_testnet = true"
                    :class="[
                      'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      formData.is_testnet
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    ]"
                  >
                    模拟账户
                  </button>
                </div>
              </div>

              <!-- 选择交易所 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">选择交易所</label>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="ex in supportedExchanges"
                    :key="ex.id"
                    @click="selectExchange(ex.id)"
                    class="p-4 rounded-xl transition-all duration-200 flex flex-col items-center space-y-2 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                  >
                    <img :src="ex.logo" :alt="ex.name" class="w-14 h-14 object-contain" />
                    <div class="text-xs font-medium text-gray-900">{{ ex.name }}</div>
                  </button>
                </div>
              </div>
            </div>

            <!-- 步骤2: 配置API -->
            <div v-else class="px-6 py-6">

              <!-- 交易所信息卡片 -->
              <div class="mb-6">
                <div :class="[
                  'rounded-lg p-4 flex items-center space-x-3',
                  isEditMode ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gray-50'
                ]">
                  <img
                    :src="getExchangeLogo(formData.exchange)"
                    :alt="getExchangeName(formData.exchange)"
                    class="w-12 h-12 rounded-lg bg-white p-2"
                  />
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ getExchangeName(formData.exchange) }}</h3>
                    <p class="text-sm text-gray-600">{{ isEditMode ? '更新 API 连接信息' : '配置 API 连接信息' }}</p>
                  </div>
                  <div v-if="isEditMode" class="text-blue-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 编辑模式提示 -->
              <div v-if="isEditMode" class="mb-6">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div class="flex items-start space-x-2">
                    <div class="text-blue-500 mt-0.5">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-blue-800">
                        出于安全考虑，现有密钥不会显示。如需更新密钥，请重新填写；如只修改名称，密钥字段留空即可。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 连接指南 - 仅新建模式显示 -->
              <div v-if="!isEditMode" class="mb-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <div class="text-green-500 mt-0.5">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-green-900 mb-1">如何获取 API 密钥</p>
                      <ol class="text-xs text-green-800 space-y-1 list-decimal list-inside">
                        <li>登录您的交易所账户，进入 API 管理</li>
                        <li>创建新的 API 密钥（建议开启 IP 白名单）</li>
                        <li>只需开启"读取"权限，不要开启"提现"权限</li>
                        <li>将生成的 API Key 和 Secret Key 粘贴到下方</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <!-- API配置表单 -->
              <div class="space-y-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">账户名称</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="例如：我的币安账户"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                    <span v-if="isEditMode" class="text-xs text-gray-500 font-normal ml-2">(留空表示不修改)</span>
                  </label>
                  <input
                    v-model="formData.api_key"
                    type="text"
                    :placeholder="isEditMode ? '留空表示不修改' : '输入您的 API Key'"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Secret Key
                    <span v-if="isEditMode" class="text-xs text-gray-500 font-normal ml-2">(留空表示不修改)</span>
                  </label>
                  <input
                    v-model="formData.secret_key"
                    type="password"
                    :placeholder="isEditMode ? '留空表示不修改' : '输入您的 Secret Key'"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                <div v-if="formData.exchange === 'okx'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Passphrase</label>
                  <input
                    v-model="formData.passphrase"
                    type="password"
                    placeholder="输入您的 Passphrase（仅 OKX）"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <!-- 检测到的权限 -->
              <div v-if="detectedPermissions">
                <label class="block text-sm font-medium text-gray-700 mb-3">检测到的权限</label>
                <div class="space-y-2">
                  <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span class="text-sm text-gray-700">只读权限</span>
                    <div :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center',
                      detectedPermissions.has_read ? 'bg-green-500' : 'bg-gray-300'
                    ]">
                      <svg v-if="detectedPermissions.has_read" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span class="text-sm text-gray-700">交易权限</span>
                    <div :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center',
                      detectedPermissions.has_trade ? 'bg-green-500' : 'bg-gray-300'
                    ]">
                      <svg v-if="detectedPermissions.has_trade" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>

                  <div v-if="detectedPermissions.has_withdraw" class="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span class="text-sm text-red-600">⚠️ 检测到提现权限</span>
                    <div class="w-5 h-5 rounded-full flex items-center justify-center bg-red-500">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div v-if="currentStep === 'config'" class="px-6 py-4 border-t border-gray-200">
            <!-- 编辑模式且未修改密钥：直接显示保存按钮 -->
            <button
              v-if="isEditMode && !formData.api_key && !formData.secret_key"
              @click="handleSubmit"
              :disabled="isLoading || !formData.name"
              class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ isLoading ? '更新中...' : '更新配置' }}</span>
            </button>

            <!-- 未测试连接时显示测试按钮 -->
            <button
              v-else-if="!detectedPermissions"
              @click="testConnection"
              :disabled="isLoading || !formData.api_key || !formData.secret_key"
              class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>{{ isLoading ? '测试中...' : '测试连接' }}</span>
            </button>

            <!-- 测试成功后显示保存按钮 -->
            <button
              v-else
              @click="handleSubmit"
              :disabled="isLoading || (!isEditMode && !isFormValid)"
              class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ isLoading ? (isEditMode ? '更新中...' : '保存中...') : (isEditMode ? '更新配置' : '保存并绑定') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { exchangeAPI } from '../../utils/api'
import { showNotification } from '../../utils/notification'

// Emits
const emit = defineEmits(['close', 'success'])

// 调试：组件挂载时打印
onMounted(() => {
  console.log('BindExchangeModal 已挂载')
})

// 当前步骤
const currentStep = ref('select') // 'select' | 'config'

// 支持的交易所
const supportedExchanges = ref([
  { id: 'binance', name: 'Binance', logo: '/dex/binance.png' },
  { id: 'okx', name: 'OKX', logo: '/dex/okx.png' },
  { id: 'bybit', name: 'Bybit', logo: '/dex/bybit.png' },
  { id: 'gate', name: 'Gate.io', logo: '/dex/gate.png' }
  // { id: 'bitget', name: 'Bitget', logo: '/dex/bitget.png' }  // TODO: 添加 bitget logo
])

// 检测到的权限
const detectedPermissions = ref(null)

// 获取交易所名称
const getExchangeName = (exchange) => {
  const names = {
    binance: 'Binance',
    okx: 'OKX',
    bybit: 'Bybit',
    gate: 'Gate.io',
    bitget: 'Bitget'
  }
  return names[exchange] || exchange
}

// 获取交易所 Logo
const getExchangeLogo = (exchange) => {
  const logos = {
    binance: '/dex/binance.png',
    okx: '/dex/okx.png',
    bybit: '/dex/bybit.png',
    gate: '/dex/gate.png',
    bitget: '/dex/bitget.png'
  }
  return logos[exchange] || '/dex/binance.png'
}

// 选择交易所
const selectExchange = (exchangeId) => {
  formData.value.exchange = exchangeId
  currentStep.value = 'config'
}

// 关闭弹窗
const handleClose = () => {
  currentStep.value = 'select'
  detectedPermissions.value = null
  isEditMode.value = false
  editingExchangeId.value = null
  // 重置表单
  formData.value = {
    exchange: 'binance',
    name: '',
    api_key: '',
    secret_key: '',
    passphrase: '',
    is_testnet: false
  }
  emit('close')
}

// 设置编辑模式
const setEditMode = (exchange) => {
  console.log('设置编辑模式:', exchange)
  console.log('当前 currentStep:', currentStep.value)
  console.log('当前 isEditMode:', isEditMode.value)

  isEditMode.value = true
  editingExchangeId.value = exchange.id
  currentStep.value = 'config'

  // 填充表单数据
  formData.value = {
    exchange: exchange.exchange,
    name: exchange.name,
    api_key: '', // 不显示原有的 API Key（安全考虑）
    secret_key: '', // 不显示原有的 Secret Key（安全考虑）
    passphrase: '', // 不显示原有的 Passphrase（安全考虑）
    is_testnet: exchange.is_testnet
  }

  console.log('设置后 currentStep:', currentStep.value)
  console.log('设置后 isEditMode:', isEditMode.value)
  console.log('设置后 formData:', formData.value)
}

// 暴露方法给父组件
defineExpose({
  setEditMode
})

// 表单数据
const formData = ref({
  exchange: 'binance',
  name: '',
  api_key: '',
  secret_key: '',
  passphrase: '',
  is_testnet: false
})

const isLoading = ref(false)
const isEditMode = ref(false)
const editingExchangeId = ref(null)

// 表单验证
const isFormValid = computed(() => {
  return formData.value.exchange &&
         formData.value.name &&
         formData.value.api_key &&
         formData.value.secret_key
})

// 测试连接
const testConnection = async () => {
  console.log('testConnection 被调用')
  console.log('formData:', formData.value)

  // 基础验证
  if (!formData.value.exchange || !formData.value.api_key || !formData.value.secret_key) {
    console.log('验证失败：缺少必填字段')
    showNotification({
      type: 'warning',
      title: '提示',
      message: '请先填写交易所和API密钥信息'
    })
    return
  }

  // OKX 需要 passphrase
  if (formData.value.exchange === 'okx' && !formData.value.passphrase) {
    showNotification({
      type: 'warning',
      title: '提示',
      message: 'OKX 交易所需要填写 Passphrase'
    })
    return
  }

  isLoading.value = true
  try {
    console.log('开始测试连接...', formData.value)
    const response = await exchangeAPI.testConnection({
      exchange: formData.value.exchange,
      api_key: formData.value.api_key,
      secret_key: formData.value.secret_key,
      passphrase: formData.value.passphrase,
      is_testnet: formData.value.is_testnet
    })
    console.log('测试连接响应:', response)

    // 保存检测到的权限
    detectedPermissions.value = {
      has_read: response.permissions?.read || false,
      has_trade: response.permissions?.trade || false,
      has_withdraw: response.permissions?.withdraw || false
    }

    // 如果检测到提现权限，显示警告
    if (detectedPermissions.value.has_withdraw) {
      showNotification({
        type: 'warning',
        title: '⚠️ 安全警告',
        message: '检测到提现权限！建议重新创建不包含提现权限的API Key',
        duration: 8000
      })
    } else {
      showNotification({
        type: 'success',
        title: '连接成功',
        message: '已检测到API权限，可以点击保存按钮完成绑定'
      })
    }
  } catch (error) {
    console.error('连接测试失败:', error)
    showNotification({
      type: 'error',
      title: '连接失败',
      message: error.message || '请检查API密钥是否正确'
    })
    detectedPermissions.value = null
  } finally {
    isLoading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  console.log('handleSubmit 被调用')
  console.log('isEditMode:', isEditMode.value)
  console.log('detectedPermissions:', detectedPermissions.value)

  // 编辑模式下，如果没有修改密钥，不需要测试连接
  if (!isEditMode.value && !detectedPermissions.value) {
    console.log('未检测到权限，需要先测试连接')
    showNotification({
      type: 'warning',
      title: '提示',
      message: '请先测试连接以检测API权限'
    })
    return
  }

  // 编辑模式下，只需要验证名称
  if (isEditMode.value && !formData.value.name) {
    showNotification({
      type: 'warning',
      title: '提示',
      message: '请填写账户名称'
    })
    return
  }

  if (!isEditMode.value && !isFormValid.value) {
    showNotification({
      type: 'warning',
      title: '提示',
      message: '请填写完整的表单信息'
    })
    return
  }

  isLoading.value = true
  try {
    let response

    if (isEditMode.value) {
      // 编辑模式：更新交易所
      console.log('开始更新交易所配置...', formData.value)
      const updateData = {
        name: formData.value.name
      }

      // 如果修改了密钥，需要包含密钥信息
      if (formData.value.api_key && formData.value.secret_key) {
        updateData.api_key = formData.value.api_key
        updateData.secret_key = formData.value.secret_key
        if (formData.value.passphrase) {
          updateData.passphrase = formData.value.passphrase
        }
      }

      response = await exchangeAPI.updateExchange(editingExchangeId.value, updateData)
      console.log('更新成功:', response)
    } else {
      // 创建模式：创建新交易所
      console.log('开始创建交易所配置...', formData.value)
      response = await exchangeAPI.createExchange({
        exchange: formData.value.exchange,
        name: formData.value.name,
        api_key: formData.value.api_key,
        secret_key: formData.value.secret_key,
        passphrase: formData.value.passphrase,
        is_testnet: formData.value.is_testnet
      })
      console.log('创建成功:', response)
    }

    // 提取实际的交易所数据
    // 后端返回格式: { success: true, message: '...', data: {...}, permissions: {...} }
    const exchangeData = response.data || response

    // 计算余额
    if (exchangeData.balance_snapshot && typeof exchangeData.balance_snapshot === 'object') {
      exchangeData.total_balance = Object.values(exchangeData.balance_snapshot).reduce((sum, val) => sum + parseFloat(val || 0), 0)
      exchangeData.available_balance = exchangeData.total_balance * 0.8
    } else {
      exchangeData.total_balance = 0
      exchangeData.available_balance = 0
    }

    // 设置权限标志
    exchangeData.has_read_permission = exchangeData.permissions?.read || false
    exchangeData.has_trade_permission = exchangeData.permissions?.trade || false

    console.log('准备发送的交易所数据:', exchangeData)
    emit('success', exchangeData)
    showNotification({
      type: 'success',
      title: isEditMode.value ? '更新成功' : '绑定成功',
      message: isEditMode.value ? '交易所配置已更新' : '交易所已成功绑定，可以开始使用了'
    })

    // 重置表单
    formData.value = {
      exchange: 'binance',
      name: '',
      api_key: '',
      secret_key: '',
      passphrase: '',
      is_testnet: false
    }
    detectedPermissions.value = null
    currentStep.value = 'select'
    isEditMode.value = false
    editingExchangeId.value = null
  } catch (error) {
    console.error(isEditMode.value ? '更新失败:' : '绑定失败:', error)
    showNotification({
      type: 'error',
      title: isEditMode.value ? '更新失败' : '绑定失败',
      message: error.message || '请重试'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

