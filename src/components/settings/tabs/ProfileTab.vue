<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">主页信息</h2>
      <p class="text-gray-600 mt-1">管理您的公开主页展示信息</p>
    </div>

      <!-- 基本信息编辑 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
        <form @submit.prevent="updateProfile" class="space-y-6">
          <!-- 头像上传 -->
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div v-if="userInfo.avatar" class="w-20 h-20 rounded-full overflow-hidden">
                <img :src="userInfo.avatar" :alt="userInfo.username" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {{ userInitial }}
              </div>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="handleAvatarChange"
                class="hidden"
              />
            </div>
            <div>
              <button
                type="button"
                @click="$refs.avatarInput.click()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {{ userInfo.avatar ? '更换头像' : '上传头像' }}
              </button>
              <p class="text-sm text-gray-500 mt-1">JPG, GIF 或 PNG. 最大 1MB.</p>
            </div>
          </div>



          <!-- 账户信息（只读） -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                用户名
                <span class="text-xs text-gray-500 ml-1">(需要在安全设置中修改)</span>
              </label>
              <input
                v-model="profileForm.username"
                type="text"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                title="用户名需要在安全设置中修改"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
                <span class="text-xs text-gray-500 ml-1">(需要在安全设置中修改)</span>
              </label>
              <input
                v-model="profileForm.email"
                type="email"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                title="邮箱地址需要在安全设置中修改"
              />
            </div>
          </div>

          <!-- 联系信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">手机号码</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入手机号码"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">微信号</label>
              <input
                v-model="profileForm.wechatId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入微信号"
              />
            </div>
          </div>

          <!-- 个人简介 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
            <textarea
              v-model="profileForm.bio"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="介绍一下您的交易经验和投资理念..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">{{ profileForm.bio?.length || 0 }}/500 字符</p>
          </div>

          <!-- 社交媒体链接 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-700">社交媒体链接</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Telegram</label>
                <input
                  v-model="profileForm.telegram"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  v-model="profileForm.twitter"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">个人网站</label>
              <input
                v-model="profileForm.website"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://your-website.com"
              />
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="profileLoading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ profileLoading ? '保存中...' : '保存更改' }}
            </button>
          </div>
        </form>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import notification from '../../../utils/notification.js'

// 注入父组件的数据和方法
const userInfo = inject('userInfo')
const profileForm = inject('profileForm')
const profileLoading = inject('profileLoading')
const updateProfile = inject('updateProfile')
const handleAvatarChange = inject('handleAvatarChange')

// 计算用户名首字母
const userInitial = computed(() => {
  return userInfo.value.username ? userInfo.value.username.charAt(0).toUpperCase() : 'U'
})
</script>
