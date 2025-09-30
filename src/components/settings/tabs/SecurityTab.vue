<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">安全设置</h2>
      <p class="text-gray-600 mt-1">管理您的账户安全和登录设置</p>
    </div>

      <!-- 导航标签页 -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8">
            <button
              @click="activeSecurityTab = 'password'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeSecurityTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              修改密码
            </button>
            <button
              @click="activeSecurityTab = 'username'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeSecurityTab === 'username'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              修改用户名
            </button>
            <button
              @click="activeSecurityTab = 'email'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeSecurityTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              修改邮箱
            </button>
          </nav>
        </div>
      </div>

      <!-- 修改密码内容 -->
      <div v-if="activeSecurityTab === 'password'" class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-8">
          <div class="max-w-md">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">修改密码</h3>
              <p class="text-sm text-gray-600">更新您的登录密码以确保账户安全</p>
            </div>

            <!-- 安全提示 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <p class="text-sm text-blue-800">
                    为了账户安全，请使用包含大小写字母、数字和特殊字符的强密码。
                  </p>
                </div>
              </div>
            </div>

            <form @submit.prevent="changePassword" class="space-y-5">
              <!-- 隐藏的用户名字段，用于密码管理器 -->
              <input
                type="text"
                name="username"
                :value="userStore.username.value"
                autocomplete="username"
                style="display: none;"
                aria-hidden="true"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入当前密码"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请输入新密码"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="请再次输入新密码"
                />
              </div>

              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  :disabled="passwordLoading"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ passwordLoading ? '修改中...' : '确认修改' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 修改用户名内容 -->
      <div v-if="activeSecurityTab === 'username'" class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-8">
          <div class="max-w-md">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">修改用户名</h3>
              <p class="text-sm text-gray-600">更改您的账户用户名标识</p>
            </div>

            <!-- 限制提示 -->
            <div v-if="!usernameChangeInfo.canChange" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <p class="text-sm text-yellow-800">{{ usernameChangeInfo.message }}</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="changeUsername" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">当前用户名</label>
                <input
                  :value="userInfo.username"
                  type="text"
                  name="username"
                  autocomplete="username"
                  readonly
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">新用户名</label>
                <input
                  v-model="usernameForm.newUsername"
                  type="text"
                  name="new-username"
                  autocomplete="username"
                  required
                  :disabled="!usernameChangeInfo.canChange"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  placeholder="请输入新用户名"
                />
                <p class="text-xs text-gray-500 mt-2">用户名只能包含字母、数字和下划线，3-20个字符</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">当前密码确认</label>
                <input
                  v-model="usernameForm.currentPassword"
                  type="password"
                  autocomplete="current-password"
                  required
                  :disabled="!usernameChangeInfo.canChange"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  placeholder="请输入当前密码以确认身份"
                />
              </div>

              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  :disabled="usernameLoading || !usernameChangeInfo.canChange"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ usernameLoading ? '修改中...' : '确认修改' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 修改邮箱内容 -->
      <div v-if="activeSecurityTab === 'email'" class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="p-8">
          <div class="max-w-md">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">修改邮箱地址</h3>
              <p class="text-sm text-gray-600">更新您的账户邮箱地址</p>
            </div>

            <!-- 安全提示 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <p class="text-sm text-blue-800">
                    修改邮箱需要验证当前密码和新邮箱，确保账户安全。
                  </p>
                </div>
              </div>
            </div>

            <!-- 邮箱修改表单 -->
            <form @submit.prevent="handleEmailChangeSubmit" class="space-y-5">
              <!-- 隐藏的用户名字段，用于密码管理器 -->
              <input
                type="text"
                name="username"
                :value="userStore.username.value"
                autocomplete="username"
                style="display: none;"
                aria-hidden="true"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">当前邮箱</label>
                <input
                  :value="userInfo.email"
                  type="email"
                  name="current-email"
                  autocomplete="email"
                  readonly
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                <input
                  v-model="emailChangeForm.currentPassword"
                  type="password"
                  autocomplete="current-password"
                  required
                  :disabled="emailVerificationSent"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  placeholder="请输入当前密码以确认身份"
                />
              </div>

              <div class="flex space-x-3">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">新邮箱地址</label>
                  <input
                    v-model="emailChangeForm.newEmail"
                    type="email"
                    name="email"
                    autocomplete="email"
                    required
                    :disabled="emailVerificationSent"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                    placeholder="请输入新邮箱地址"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    type="button"
                    @click="sendEmailVerificationCode"
                    :disabled="emailChangeLoading || emailVerificationSent || !emailChangeForm.newEmail || !emailChangeForm.currentPassword"
                    class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium"
                  >
                    {{ emailChangeLoading ? '发送中...' : (emailVerificationSent ? '已发送' : '发送验证码') }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">验证码</label>
                <input
                  v-model="emailChangeForm.verificationCode"
                  type="text"
                  name="verification-code"
                  autocomplete="one-time-code"
                  maxlength="6"
                  :disabled="!emailVerificationSent"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  placeholder="请输入6位验证码"
                />
              </div>

              <!-- 重发验证码 -->
              <div v-if="emailVerificationSent" class="text-center">
                <button
                  type="button"
                  @click="resendEmailVerificationCode"
                  :disabled="resendCountdown > 0 || emailChangeLoading"
                  class="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {{ resendCountdown > 0 ? `${resendCountdown}秒后可重发` : '重新发送验证码' }}
                </button>
              </div>

              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  @click="resetEmailChange"
                  class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  :disabled="emailChangeLoading || !emailChangeForm.verificationCode || !emailVerificationSent"
                  class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ emailChangeLoading ? '验证中...' : '确认修改' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useUserStore } from '../../../utils/userStore.js'

// 子标签页状态
const activeSecurityTab = ref('password')

// 使用全局用户状态
const userStore = useUserStore()

// 注入父组件的数据和方法
const userInfo = inject('userInfo')
const passwordForm = inject('passwordForm')
const passwordLoading = inject('passwordLoading')
const usernameForm = inject('usernameForm')
const usernameLoading = inject('usernameLoading')
const usernameChangeInfo = inject('usernameChangeInfo')
const emailChangeForm = inject('emailChangeForm')
const emailChangeLoading = inject('emailChangeLoading')
const emailVerificationSent = inject('emailVerificationSent')
const resendCountdown = inject('resendCountdown')
const changePassword = inject('changePassword')
const changeUsername = inject('changeUsername')
const sendEmailVerificationCode = inject('sendEmailVerificationCode')
const handleEmailChangeSubmit = inject('handleEmailChangeSubmit')
const resendEmailVerificationCode = inject('resendEmailVerificationCode')
const resetEmailChange = inject('resetEmailChange')
</script>
