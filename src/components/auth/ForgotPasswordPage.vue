<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <Header />

    <!-- 主内容区域 -->
    <div class="pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <div class="w-full max-w-md">
        <!-- 卡片容器 -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- 顶部装饰条 -->
          <div class="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>

          <div class="p-8 sm:p-10">
            <!-- Logo和标题 -->
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
                <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style="font-family: 'Inter', sans-serif;">找回密码</h1>
              <p class="text-sm text-gray-600">{{ currentStep === 1 ? '输入您的邮箱地址，我们将发送验证码' : '输入验证码和新密码' }}</p>
            </div>

            <!-- 步骤指示器 -->
            <div class="flex items-center justify-center mb-8">
              <div class="flex items-center">
                <div :class="[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                  currentStep >= 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
                ]">
                  1
                </div>
                <div :class="[
                  'w-20 h-1 mx-2 rounded-full transition-all duration-200',
                  currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                ]"></div>
                <div :class="[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                  currentStep >= 2 ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'
                ]">
                  2
                </div>
              </div>
            </div>
            <!-- 步骤1: 输入邮箱 -->
            <div v-if="currentStep === 1">
              <form @submit.prevent="sendResetCode" class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">邮箱地址</label>
                  <div class="relative">
                    <svg class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                    </svg>
                    <input
                      v-model="email"
                      type="email"
                      placeholder="请输入您的邮箱地址"
                      autocomplete="email"
                      class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="isLoading || !email"
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isLoading ? '发送中...' : '发送验证码' }}
                </button>
              </form>
            </div>

            <!-- 步骤2: 输入验证码和新密码 -->
            <div v-if="currentStep === 2">
              <form @submit.prevent="resetPassword" class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">验证码</label>
                  <div class="relative">
                    <svg class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <input
                      v-model="verificationCode"
                      type="text"
                      placeholder="请输入6位验证码"
                      maxlength="6"
                      class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
                      required
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1.5">验证码已发送到 {{ email }}</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">新密码</label>
                  <div class="relative">
                    <svg class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <input
                      v-model="newPassword"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="请输入新密码（至少8位）"
                      autocomplete="new-password"
                      minlength="8"
                      class="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
                      required
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">确认新密码</label>
                  <div class="relative">
                    <svg class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <input
                      v-model="confirmPassword"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="请再次输入新密码"
                      autocomplete="new-password"
                      minlength="8"
                      class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div class="flex space-x-3 pt-2">
                  <button
                    type="button"
                    @click="goBackToStep1"
                    class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200"
                  >
                    返回上一步
                  </button>
                  <button
                    type="submit"
                    :disabled="isLoading || !verificationCode || !newPassword || !confirmPassword"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                  >
                    <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isLoading ? '重置中...' : '重置密码' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- 返回登录链接 -->
            <div class="mt-6 text-center">
              <router-link
                to="/auth"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                ← 返回登录页面
              </router-link>
            </div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            © 2024 CoolTrade. 保留所有权利.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, handleApiError } from '../../utils/api.js'
import notification from '../../utils/notification.js'
import Header from '../common/Header.vue'

const router = useRouter()

// 响应式数据
const currentStep = ref(1)
const isLoading = ref(false)
const showPassword = ref(false)

// 表单数据
const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 发送重置密码验证码
const sendResetCode = async () => {
  if (!email.value) {
    notification.warning('请输入邮箱地址')
    return
  }

  isLoading.value = true

  try {
    console.log('发送密码重置验证码到:', email.value)
    
    const result = await authAPI.requestPasswordReset(email.value)
    console.log('密码重置验证码发送成功:', result)
    
    // 进入下一步
    currentStep.value = 2
    
  } catch (error) {
    console.error('发送密码重置验证码失败:', error)
    const errorMessage = handleApiError(error)
    notification.error(errorMessage, '发送验证码失败')
  } finally {
    isLoading.value = false
  }
}

// 重置密码
const resetPassword = async () => {
  // 基本验证
  if (!verificationCode.value || !newPassword.value || !confirmPassword.value) {
    notification.warning('请填写完整信息')
    return
  }

  if (newPassword.value.length < 8) {
    notification.warning('密码长度至少为8位')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    notification.warning('两次输入的密码不一致')
    return
  }

  isLoading.value = true

  try {
    console.log('重置密码数据:', {
      email: email.value,
      code: verificationCode.value,
      newPassword: newPassword.value
    })
    
    const result = await authAPI.resetPasswordWithCode(
      email.value,
      verificationCode.value,
      newPassword.value,
      confirmPassword.value
    )
    
    console.log('密码重置成功:', result)
    
    // 保存登录信息
    if (result.data && result.data.token) {
      localStorage.setItem('auth_token', result.data.token)
      console.log('Token已保存:', result.data.token)
    }
    if (result.data && result.data.user) {
      localStorage.setItem('user_info', JSON.stringify(result.data.user))
      console.log('用户信息已保存:', result.data.user)
    }

    notification.passwordResetSuccess()
    
    // 等待一小段时间确保localStorage已保存
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 跳转到仪表板
    try {
      await router.push('/')
      console.log('密码重置后跳转成功')
    } catch (routerError) {
      console.error('密码重置后跳转失败:', routerError)
      window.location.href = '/'
    }
    
  } catch (error) {
    console.error('密码重置失败:', error)
    const errorMessage = handleApiError(error)
    notification.error(errorMessage, '密码重置失败')
  } finally {
    isLoading.value = false
  }
}

// 返回第一步
const goBackToStep1 = () => {
  currentStep.value = 1
  verificationCode.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>
