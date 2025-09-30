<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>

      <!-- 模态框 -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- 头部 -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">关注列表</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 内容 -->
        <div class="bg-white px-6 py-4 max-h-96 overflow-y-auto">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <!-- 关注列表 -->
          <div v-else-if="following.length > 0" class="space-y-4">
            <div v-for="user in following" :key="user.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <!-- 头像 -->
                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img v-if="user.avatar" :src="user.avatar" :alt="user.username" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                </div>
                
                <!-- 用户信息 -->
                <div class="flex-1">
                  <router-link :to="`/profile/${user.id}`" class="font-medium text-gray-900 hover:text-blue-600">
                    {{ user.username }}
                  </router-link>
                  <p v-if="user.bio" class="text-sm text-gray-500 truncate">{{ user.bio }}</p>
                </div>
              </div>

              <!-- 查看按钮 -->
              <button
                @click="viewProfile(user.id)"
                class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                查看主页
              </button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-8">
            <p class="text-gray-500">暂无关注</p>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && !loading" class="mt-4 text-center">
            <button
              @click="loadMore"
              class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              加载更多
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '../../utils/api.js'
import notification from '../../utils/notification.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  userId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['close'])
const router = useRouter()

const following = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(false)

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 查看用户主页
const viewProfile = (userId) => {
  closeModal()
  router.push(`/profile/${userId}`)
}

// 加载关注列表
const loadFollowing = async (pageNum = 1) => {
  loading.value = true
  try {
    const response = await userAPI.getFollowing(props.userId, pageNum)
    if (response.status === 'success') {
      if (pageNum === 1) {
        following.value = response.data.following
      } else {
        following.value = [...following.value, ...response.data.following]
      }
      hasMore.value = response.data.has_more
      page.value = pageNum
    } else {
      notification.error(response.message || '加载失败', '错误')
    }
  } catch (error) {
    notification.error(error.message || '加载失败', '错误')
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  loadFollowing(page.value + 1)
}

// 监听模态框打开
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    following.value = []
    page.value = 1
    hasMore.value = false
    loadFollowing(1)
  }
})
</script>

