/**
 * 全局用户状态管理
 * 使用 reactive 对象，更简单直接
 */
import { reactive, computed } from 'vue'

// 用户信息响应式状态（使用 reactive）
const state = reactive({
  currentUser: null,
  token: null
})

// 从 localStorage 加载用户信息
const loadUserFromStorage = () => {
  const token = localStorage.getItem('auth_token')
  const userInfo = localStorage.getItem('user_info')

  if (token && userInfo) {
    try {
      state.currentUser = JSON.parse(userInfo)
      state.token = token
    } catch (error) {
      console.error('解析用户信息失败:', error)
      state.currentUser = null
      state.token = null
    }
  } else {
    state.currentUser = null
    state.token = null
  }
}

// 初始化时加载用户信息
loadUserFromStorage()

// 计算属性
const isAuthenticated = computed(() => {
  const hasToken = !!state.token
  const hasUser = !!state.currentUser
  return hasToken && hasUser
})

const username = computed(() => {
  return state.currentUser?.username || '用户'
})

const userEmail = computed(() => {
  return state.currentUser?.email || ''
})

const userAvatar = computed(() => {
  return state.currentUser?.avatar || null
})

const userInitial = computed(() => {
  return username.value.charAt(0).toUpperCase()
})

// 更新用户信息
const updateUser = (userData) => {
  if (userData) {
    state.currentUser = { ...state.currentUser, ...userData }
    localStorage.setItem('user_info', JSON.stringify(state.currentUser))
  }
}

// 更新头像
const updateAvatar = (avatarUrl) => {
  if (state.currentUser) {
    state.currentUser = { ...state.currentUser, avatar: avatarUrl }
    localStorage.setItem('user_info', JSON.stringify(state.currentUser))
  }
}

// 设置用户信息（登录时使用）
const setUser = (userData) => {
  state.currentUser = userData
  state.token = localStorage.getItem('auth_token')
  localStorage.setItem('user_info', JSON.stringify(userData))
}

// 清除用户信息（登出时使用）
const clearUser = () => {
  state.currentUser = null
  state.token = null
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_info')
}

// 刷新用户信息（从 localStorage 重新加载）
// 注意：这个方法不触发事件，避免无限循环
const refreshUser = () => {
  loadUserFromStorage()
}

// 创建单例 store 对象（只创建一次）
const store = {
  // 状态
  state,
  isAuthenticated,
  username,
  userEmail,
  userAvatar,
  userInitial,

  // 方法
  updateUser,
  updateAvatar,
  setUser,
  clearUser,
  refreshUser,
  loadUserFromStorage
}

// 导出用户状态和方法（始终返回同一个 store 对象）
export const useUserStore = () => {
  return store
}

// 默认导出
export default useUserStore

