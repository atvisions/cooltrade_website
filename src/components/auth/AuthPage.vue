<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <Header />

    <!-- 主内容区域 -->
    <div class="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md mx-auto">
        <!-- 卡片容器 -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- 顶部装饰条 -->
          <div class="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>

          <div class="p-8 sm:p-10">
            <!-- 标题区域 -->
            <div class="text-center mb-8">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style="font-family: 'Inter', sans-serif;">
                {{ activeTab === 'login' ? '欢迎回来' : '创建账户' }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ activeTab === 'login' ? '登录您的账户以继续' : '加入我们的智能交易平台' }}
              </p>
            </div>

            <!-- 标签切换 -->
            <div class="flex space-x-2 bg-gray-50 rounded-xl p-1.5 mb-8">
              <button
                @click="activeTab = 'login'"
                :class="[
                  'flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200',
                  activeTab === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                登录
              </button>
              <button
                @click="activeTab = 'register'"
                :class="[
                  'flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200',
                  activeTab === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                注册
              </button>
            </div>

            <!-- 登录表单 -->
            <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">邮箱或用户名</label>
                <div class="relative">
                  <UserIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="loginForm.email"
                    type="text"
                    placeholder="请输入邮箱或用户名"
                    class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">密码</label>
                <div class="relative">
                  <LockClosedIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="请输入密码"
                    autocomplete="current-password"
                    class="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <EyeIcon v-if="showPassword" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1">
                <label class="flex items-center cursor-pointer group">
                  <input
                    v-model="loginForm.remember"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  <span class="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">记住我</span>
                </label>
                <router-link
                  to="/forgot-password"
                  class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  忘记密码？
                </router-link>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                <span v-if="!isLoading">登录</span>
                <div v-else class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  登录中...
                </div>
              </button>
            </form>

            <!-- 注册表单 -->
            <form v-else @submit.prevent="handleRegister" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">用户名</label>
                <div class="relative">
                  <UserIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="registerForm.username"
                    type="text"
                    placeholder="请输入用户名（3-20个字符）"
                    :class="[
                      'w-full pl-11 pr-11 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white',
                      validationErrors.username
                        ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-transparent hover:border-gray-300'
                    ]"
                    @blur="validateUsername"
                    required
                  />
                  <!-- 加载指示器 -->
                  <div v-if="validationLoading.username" class="absolute right-3.5 top-1/2 transform -translate-y-1/2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                  <!-- 验证成功指示器 -->
                  <div v-else-if="registerForm.username && !validationErrors.username" class="absolute right-3.5 top-1/2 transform -translate-y-1/2">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <!-- 错误提示 -->
                <p v-if="validationErrors.username" class="mt-1.5 text-xs text-red-600 font-medium">
                  {{ validationErrors.username }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">邮箱</label>
                <div class="relative">
                  <EnvelopeIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="registerForm.email"
                    type="email"
                    placeholder="请输入邮箱地址"
                    :class="[
                      'w-full pl-11 pr-11 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white',
                      validationErrors.email
                        ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-transparent hover:border-gray-300'
                    ]"
                    @blur="validateEmail"
                    required
                  />
                  <!-- 加载指示器 -->
                  <div v-if="validationLoading.email" class="absolute right-3.5 top-1/2 transform -translate-y-1/2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                  <!-- 验证成功指示器 -->
                  <div v-else-if="registerForm.email && !validationErrors.email" class="absolute right-3.5 top-1/2 transform -translate-y-1/2">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <!-- 错误提示 -->
                <p v-if="validationErrors.email" class="mt-1.5 text-xs text-red-600 font-medium">
                  {{ validationErrors.email }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">密码</label>
                <div class="relative">
                  <LockClosedIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="registerForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="请输入密码（至少8位）"
                    autocomplete="new-password"
                    class="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
                    required
                    minlength="8"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <EyeIcon v-if="showPassword" class="w-5 h-5" />
                    <EyeSlashIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">验证码</label>
                <div class="flex space-x-2">
                  <div class="relative flex-1">
                    <ShieldCheckIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      v-model="registerForm.code"
                      type="text"
                      placeholder="请输入验证码"
                      class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    @click="sendVerificationCode"
                    :disabled="codeCooldown > 0"
                    :class="[
                      'px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap',
                      codeCooldown > 0
                        ? 'bg-green-50 text-green-600 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    ]"
                  >
                    {{ codeCooldown > 0 ? `${codeCooldown}s` : '发送' }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">邀请码（可选）</label>
                <div class="relative">
                  <svg class="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  <input
                    v-model="registerForm.invitation_code"
                    type="text"
                    placeholder="请输入邀请码（可选）"
                    class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300"
                  />
                </div>
              </div>

              <div class="flex items-start pt-1">
                <input
                  v-model="registerForm.agreeTerms"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5 cursor-pointer"
                  required
                />
                <span class="ml-2.5 text-xs text-gray-600 leading-relaxed">
                  我已阅读并同意
                  <a href="#" class="text-blue-600 hover:text-blue-700 font-medium transition-colors">《用户协议》</a>
                  和
                  <a href="#" class="text-blue-600 hover:text-blue-700 font-medium transition-colors">《隐私政策》</a>
                </span>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                <span v-if="!isLoading">注册</span>
                <div v-else class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  注册中...
                </div>
              </button>
            </form>
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { authAPI, handleApiError, API_ENDPOINTS, getAPIBaseURL } from '../../utils/api.js'
import notification from '../../utils/notification.js'
import { useUserStore } from '../../utils/userStore.js'
import Header from '../common/Header.vue'

const router = useRouter()
const userStore = useUserStore()
const API_BASE_URL = getAPIBaseURL()

// 响应式数据
const activeTab = ref('login')
const showPassword = ref(false)
const isLoading = ref(false)
const codeCooldown = ref(0)

// 验证状态
const validationErrors = reactive({
  username: '',
  email: ''
})

const validationLoading = reactive({
  username: false,
  email: false
})

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

// 页面加载时检查是否有保存的登录信息
const loadRememberedLogin = () => {
  const rememberedLogin = localStorage.getItem('remembered_login')
  if (rememberedLogin) {
    try {
      const loginData = JSON.parse(rememberedLogin)
      loginForm.email = loginData.email || ''
      loginForm.password = loginData.password || ''
      loginForm.remember = true
      console.log('已加载记住的登录信息:', loginData.email)
    } catch (error) {
      console.error('加载记住的登录信息失败:', error)
      localStorage.removeItem('remembered_login')
    }
  }
}

// 保存登录信息（如果勾选了记住我）
const saveLoginIfRemembered = () => {
  if (loginForm.remember) {
    const loginData = {
      email: loginForm.email,
      password: loginForm.password
    }
    localStorage.setItem('remembered_login', JSON.stringify(loginData))
    console.log('已保存登录信息')
  } else {
    // 如果没有勾选记住我，清除之前保存的信息
    localStorage.removeItem('remembered_login')
    console.log('已清除保存的登录信息')
  }
}

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  code: '',
  invitation_code: '',
  agreeTerms: false
})

// 验证码倒计时
let cooldownTimer = null

// 实时验证函数
const validateUsername = async () => {
  const username = registerForm.username.trim()

  // 清除之前的错误
  validationErrors.username = ''

  if (!username) {
    return
  }

  // 基本格式验证
  if (username.length < 3) {
    validationErrors.username = '用户名至少需要3个字符'
    return
  }

  if (username.length > 20) {
    validationErrors.username = '用户名不能超过20个字符'
    return
  }

  // 检查用户名格式（只允许字母、数字、下划线）
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    validationErrors.username = '用户名只能包含字母、数字和下划线'
    return
  }

  // 检查用户名是否已存在
  validationLoading.username = true
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-username/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    })

    const result = await response.json()

    if (response.ok) {
      if (result.exists) {
        validationErrors.username = '该用户名已被使用'
      }
    } else {
      // 如果API不存在，我们用注册API来检查
      validationErrors.username = ''
    }
  } catch (error) {
    console.error('验证用户名失败:', error)
    // 网络错误时不显示错误，让用户继续操作
  } finally {
    validationLoading.username = false
  }
}

const validateEmail = async () => {
  const email = registerForm.email.trim()

  // 清除之前的错误
  validationErrors.email = ''

  if (!email) {
    return
  }

  // 邮箱格式验证 - 支持用户名中包含点号，如 liu.zhao@qq.com
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    validationErrors.email = '请输入有效的邮箱地址'
    return
  }

  // 检查邮箱是否已存在
  validationLoading.email = true
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    })

    const result = await response.json()

    if (response.ok) {
      if (result.exists) {
        validationErrors.email = '该邮箱已被注册'
      }
    } else {
      // 如果API不存在，我们用注册API来检查
      validationErrors.email = ''
    }
  } catch (error) {
    console.error('验证邮箱失败:', error)
    // 网络错误时不显示错误，让用户继续操作
  } finally {
    validationLoading.email = false
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!registerForm.email) {
    notification.warning('请先输入邮箱')
    return
  }

  // 检查邮箱是否有验证错误
  if (validationErrors.email) {
    notification.warning('请先修正邮箱格式错误')
    return
  }

  // 如果邮箱还在验证中，先等待验证完成
  if (validationLoading.email) {
    notification.info('正在验证邮箱，请稍候')
    return
  }

  // 先验证邮箱
  await validateEmail()

  // 验证后如果有错误，不发送验证码
  if (validationErrors.email) {
    return
  }

  try {
    // 立即开始倒计时，提供即时反馈
    console.log('发送验证码到:', registerForm.email)
    console.log('立即开始倒计时，提供用户反馈')
    codeCooldown.value = 60
    cooldownTimer = setInterval(() => {
      codeCooldown.value--
      if (codeCooldown.value <= 0) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
      }
    }, 1000)

    console.log('API调用开始时间:', new Date().toLocaleTimeString())

    // 调用API发送验证码
    const result = await authAPI.sendCode(registerForm.email, 'register')
    console.log('API调用结束时间:', new Date().toLocaleTimeString())
    console.log('发送验证码API响应:', result)
    console.log('验证码发送成功')
  } catch (error) {
    console.error('发送验证码失败:', error)
    // 如果发送失败，停止倒计时并恢复按钮
    if (cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
    codeCooldown.value = 0

    const errorMessage = handleApiError(error)
    notification.error(errorMessage, '发送验证码失败')
  }
}

// 处理登录
const handleLogin = async () => {
  isLoading.value = true

  try {
    // 基本验证
    if (!loginForm.email || !loginForm.password) {
      notification.warning('请填写完整的登录信息')
      return
    }

    // 准备API请求数据
    const loginData = {
      email: loginForm.email,
      password: loginForm.password
    }

    // 调用登录API
    console.log('登录数据:', loginData)

    const result = await authAPI.login(loginData)
    console.log('登录成功，响应数据:', result)

    // 显示登录成功提示
    const username = result.data?.user?.username
    notification.loginSuccess(username)

    // 保存登录信息（如果勾选了记住我）
    saveLoginIfRemembered()

    // 登录成功后的处理
    // 保存用户token和信息
    if (result.data && result.data.token) {
      localStorage.setItem('auth_token', result.data.token)
    }
    if (result.data && result.data.user) {
      localStorage.setItem('user_info', JSON.stringify(result.data.user))

      // 更新全局用户状态
      userStore.setUser(result.data.user)
    }

    // 等待一小段时间确保localStorage已保存
    await new Promise(resolve => setTimeout(resolve, 100))

    // 跳转到仪表板
    try {
      await router.push('/')
    } catch (routerError) {
      console.error('登录后路由跳转失败:', routerError)
      // 如果路由跳转失败，使用window.location强制跳转
      window.location.href = '/'
    }

  } catch (error) {
    console.error('登录失败:', error)
    const errorMessage = handleApiError(error)
    notification.error(errorMessage, '登录失败')
  } finally {
    isLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  isLoading.value = true

  try {
    // 基本验证
    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.code) {
      notification.warning('请填写完整的注册信息')
      return
    }

    // 检查是否有验证错误
    if (validationErrors.username || validationErrors.email) {
      notification.warning('请先修正表单中的错误')
      return
    }

    if (registerForm.password.length < 8) {
      notification.warning('密码长度至少为8位')
      return
    }

    if (!registerForm.agreeTerms) {
      notification.warning('请同意用户协议和隐私政策')
      return
    }

    // 准备API请求数据
    const registerData = {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      code: registerForm.code,
      invitation_code: registerForm.invitation_code || undefined // 如果为空则不发送
    }

    // 调用注册API
    console.log('注册数据:', registerData)

    const result = await authAPI.register(registerData)

    // 注册成功后的处理
    console.log('注册成功，响应数据:', result)

    // 显示注册成功提示
    const username = result.data?.username
    notification.registerSuccess(username)

    // 保存用户信息
    if (result.data) {
      localStorage.setItem('user_info', JSON.stringify(result.data))
    }

    // 注册成功后自动登录
    console.log('注册成功，开始自动登录')
    try {
      const loginResult = await authAPI.login({
        email: registerForm.email,
        password: registerForm.password
      })

      console.log('自动登录成功:', loginResult)

      // 保存登录token和用户信息
      if (loginResult.data && loginResult.data.token) {
        localStorage.setItem('auth_token', loginResult.data.token)
        console.log('Token已保存:', loginResult.data.token)
      }
      if (loginResult.data && loginResult.data.user) {
        localStorage.setItem('user_info', JSON.stringify(loginResult.data.user))
        console.log('用户信息已保存:', loginResult.data.user)

        // ✅ 更新全局用户状态
        userStore.setUser(loginResult.data.user)
      }

      // 等待一小段时间确保localStorage已保存
      await new Promise(resolve => setTimeout(resolve, 100))

      // 跳转到仪表板
      console.log('准备跳转到仪表板，当前token:', localStorage.getItem('auth_token'))

      try {
        await router.push('/')
        console.log('路由跳转成功')
      } catch (routerError) {
        console.error('路由跳转失败:', routerError)
        // 如果路由跳转失败，使用window.location强制跳转
        console.log('使用window.location强制跳转')
        window.location.href = '/'
      }
    } catch (loginError) {
      console.error('自动登录失败:', loginError)
      // 如果自动登录失败，切换到登录标签
      notification.success('注册成功！请手动登录')
      activeTab.value = 'login'
    }

  } catch (error) {
    console.error('注册失败:', error)
    const errorMessage = handleApiError(error)
    notification.error(errorMessage, '注册失败')
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时加载记住的登录信息
onMounted(() => {
  loadRememberedLogin()
})

// 清理定时器
onUnmounted(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
  }
})
</script>
