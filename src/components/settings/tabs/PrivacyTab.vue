<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900">隐私设置</h2>
      <p class="text-gray-600 mt-1">控制您的信息可见性和隐私偏好</p>
    </div>

      <!-- 主页访问控制 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">主页访问控制</h3>
        <p class="text-gray-600 mb-6">控制谁可以访问您的个人主页</p>

        <div class="flex items-center justify-between py-3">
          <div>
            <h4 class="font-medium text-gray-900">公开主页</h4>
            <p class="text-sm text-gray-500">允许所有人访问您的个人主页。关闭后，只有您自己可以查看</p>
          </div>
          <button
            @click="togglePublicProfile"
            :disabled="saving"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
              allowPublicProfile ? 'bg-blue-600' : 'bg-gray-200',
              saving ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
              allowPublicProfile ? 'translate-x-6' : 'translate-x-1'
            ]"></span>
          </button>
        </div>
      </div>

      <!-- 主页信息可见性 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">主页信息可见性</h3>
        <p class="text-gray-600 mb-6">控制哪些信息在您的公开主页上显示</p>

        <div class="space-y-4">
          <div v-for="(setting, key) in profileVisibility" :key="key" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div>
              <h4 class="font-medium text-gray-900">{{ getVisibilityLabel(key) }}</h4>
              <p class="text-sm text-gray-500">{{ getVisibilityDescription(key) }}</p>
            </div>
            <button
              @click="toggleVisibility(key)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                setting ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                setting ? 'translate-x-6' : 'translate-x-1'
              ]"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- 数据使用偏好 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">数据使用偏好</h3>
        <p class="text-gray-600 mb-6">管理您的数据如何被使用和分享</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 class="font-medium text-gray-900">个性化推荐</h4>
              <p class="text-sm text-gray-500">基于您的交易历史和偏好提供个性化内容推荐</p>
            </div>
            <button
              @click="toggleDataUsage('personalization')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                dataUsagePreferences.personalization ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                dataUsagePreferences.personalization ? 'translate-x-6' : 'translate-x-1'
              ]"></span>
            </button>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 class="font-medium text-gray-900">数据分析</h4>
              <p class="text-sm text-gray-500">允许使用匿名数据改进平台功能和用户体验</p>
            </div>
            <button
              @click="toggleDataUsage('analytics')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                dataUsagePreferences.analytics ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                dataUsagePreferences.analytics ? 'translate-x-6' : 'translate-x-1'
              ]"></span>
            </button>
          </div>

          <div class="flex items-center justify-between py-3">
            <div>
              <h4 class="font-medium text-gray-900">营销通讯</h4>
              <p class="text-sm text-gray-500">接收产品更新、市场洞察和促销信息</p>
            </div>
            <button
              @click="toggleDataUsage('marketing')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                dataUsagePreferences.marketing ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                dataUsagePreferences.marketing ? 'translate-x-6' : 'translate-x-1'
              ]"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- 账户隐私 -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">账户隐私</h3>
        <p class="text-gray-600 mb-6">控制其他用户如何找到和联系您</p>

        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 class="font-medium text-gray-900">允许搜索</h4>
              <p class="text-sm text-gray-500">其他用户可以通过用户名或邮箱找到您</p>
            </div>
            <button
              @click="toggleAccountPrivacy('searchable')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                accountPrivacy.searchable ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                accountPrivacy.searchable ? 'translate-x-6' : 'translate-x-1'
              ]"></span>
            </button>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 class="font-medium text-gray-900">显示在线状态</h4>
              <p class="text-sm text-gray-500">其他用户可以看到您是否在线</p>
            </div>
            <button
              @click="toggleAccountPrivacy('showOnlineStatus')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                accountPrivacy.showOnlineStatus ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                accountPrivacy.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
              ]"></span>
            </button>
          </div>

          <div class="flex items-center justify-between py-3">
            <div>
              <h4 class="font-medium text-gray-900">允许私信</h4>
              <p class="text-sm text-gray-500">其他用户可以向您发送私人消息</p>
            </div>
            <button
              @click="toggleAccountPrivacy('allowMessages')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                accountPrivacy.allowMessages ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                accountPrivacy.allowMessages ? 'translate-x-6' : 'translate-x-1'
              ]"></span>
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue'
import { userAPI } from '../../../utils/api.js'
import notification from '../../../utils/notification.js'

// 注入父组件的数据和方法
const profileVisibility = inject('profileVisibility')
const dataUsagePreferences = inject('dataUsagePreferences')
const accountPrivacy = inject('accountPrivacy')
const getVisibilityLabel = inject('getVisibilityLabel')
const getVisibilityDescription = inject('getVisibilityDescription')
const toggleVisibility = inject('toggleVisibility')
const toggleDataUsage = inject('toggleDataUsage')
const toggleAccountPrivacy = inject('toggleAccountPrivacy')

// 本地状态
const allowPublicProfile = ref(true)
const saving = ref(false)

// 加载隐私设置
const loadPrivacySettings = async () => {
  try {
    const response = await userAPI.getPrivacySettings()
    if (response.status === 'success') {
      allowPublicProfile.value = response.data.allow_public_profile
      // 更新主页信息可见性
      if (response.data.profile_visibility) {
        Object.assign(profileVisibility.value, response.data.profile_visibility)
      }
    }
  } catch (error) {
    console.error('加载隐私设置失败:', error)
  }
}

// 切换公开主页
const togglePublicProfile = async () => {
  saving.value = true
  try {
    const newValue = !allowPublicProfile.value
    const response = await userAPI.updatePrivacySettings({
      allow_public_profile: newValue
    })

    if (response.status === 'success') {
      allowPublicProfile.value = newValue
      notification.success(
        newValue ? '主页已设为公开' : '主页已设为私密',
        '设置已更新'
      )
    } else {
      notification.error(response.message || '更新失败', '错误')
    }
  } catch (error) {
    notification.error(error.message || '更新失败', '错误')
  } finally {
    saving.value = false
  }
}

// 组件挂载时加载设置
onMounted(() => {
  loadPrivacySettings()
})
</script>
