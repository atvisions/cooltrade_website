// API 配置和工具函数

// API 基础URL
export const API_BASE_URL = 'http://localhost:8000/api'

// API 端点
export const API_ENDPOINTS = {
  // 认证相关
  LOGIN: `${API_BASE_URL}/auth/login/`,
  REGISTER: `${API_BASE_URL}/auth/register/`,
  SEND_CODE: `${API_BASE_URL}/auth/send-code/`, // 如果后端有这个端点
  
  // 用户相关
  USER_PROFILE: `${API_BASE_URL}/auth/profile/`,
  UPLOAD_AVATAR: `${API_BASE_URL}/auth/upload-avatar/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password/`,
  USERNAME_CHANGE_STATUS: `${API_BASE_URL}/auth/username-change-status/`,
  CHANGE_USERNAME: `${API_BASE_URL}/auth/change-username/`,
  SEND_EMAIL_CHANGE_CODE: `${API_BASE_URL}/auth/send-email-change-code/`,
  CONFIRM_EMAIL_CHANGE: `${API_BASE_URL}/auth/confirm-email-change/`,
  USER_PROFILE_PUBLIC: `${API_BASE_URL}/auth/profile/`,
  TOGGLE_FOLLOW: `${API_BASE_URL}/auth/follow/`,
  PRIVACY_SETTINGS: `${API_BASE_URL}/auth/privacy-settings/`,
  GET_FOLLOWERS: `${API_BASE_URL}/auth/followers/`,
  GET_FOLLOWING: `${API_BASE_URL}/auth/following/`,

  // 积分相关
  POINTS_CONFIG: `${API_BASE_URL}/auth/points/config/`,
  POINTS_TRANSACTIONS: `${API_BASE_URL}/auth/points/transactions/`,
  SPEND_POINTS: `${API_BASE_URL}/auth/points/spend/`,
  CHECK_PREMIUM_ACCESS: `${API_BASE_URL}/auth/points/check-access/`,

  // 邀请相关
  GENERATE_INVITATION_CODE: `${API_BASE_URL}/auth/generate-invitation-code/`,
  INVITATION_INFO: `${API_BASE_URL}/auth/invitation-info/`,
  USER_RANKING: `${API_BASE_URL}/auth/invitation-info/ranking/`,

  // 其他端点可以在这里添加
}

// 通用的 fetch 包装函数
export async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {},
  }

  // 如果不是FormData，设置Content-Type
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json'
  }

  // 如果有token，添加到请求头
  const token = localStorage.getItem('auth_token')
  if (token) {
    defaultOptions.headers.Authorization = `Token ${token}`
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 认证相关的API函数
export const authAPI = {
  // 登录
  async login(credentials) {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // 注册
  async register(userData) {
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // 发送验证码
  async sendCode(email, purpose = 'register') {
    return apiRequest(API_ENDPOINTS.SEND_CODE, {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    })
  },

  // 请求密码重置验证码
  async requestPasswordReset(email) {
    return apiRequest(`${API_BASE_URL}/auth/request-password-reset/`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // 使用验证码重置密码
  async resetPasswordWithCode(email, code, newPassword, confirmPassword) {
    return apiRequest(`${API_BASE_URL}/auth/reset-password-with-code/`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        code,
        new_password: newPassword,
        confirm_password: confirmPassword
      }),
    })
  },
}

// 用户相关的API函数
export const userAPI = {
  // 获取用户信息
  async getProfile() {
    return apiRequest(API_ENDPOINTS.USER_PROFILE)
  },

  // 更新用户资料
  async updateProfile(profileData) {
    return apiRequest(API_ENDPOINTS.USER_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  },

  // 上传头像
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)

    // 不设置Content-Type和Authorization，让apiRequest函数处理
    return apiRequest(API_ENDPOINTS.UPLOAD_AVATAR, {
      method: 'POST',
      body: formData,
      headers: {
        // 移除Content-Type，让浏览器自动设置multipart/form-data
        // Authorization会由apiRequest函数自动添加
      }
    })
  },

  // 修改密码
  async changePassword(passwordData) {
    return apiRequest(API_ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(passwordData)
    })
  },

  // 获取用户名修改状态
  async getUsernameChangeStatus() {
    return apiRequest(API_ENDPOINTS.USERNAME_CHANGE_STATUS)
  },

  // 修改用户名
  async changeUsername(usernameData) {
    return apiRequest(API_ENDPOINTS.CHANGE_USERNAME, {
      method: 'POST',
      body: JSON.stringify(usernameData)
    })
  },

  // 发送邮箱修改验证码
  async sendEmailChangeCode(emailData) {
    return apiRequest(API_ENDPOINTS.SEND_EMAIL_CHANGE_CODE, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  },

  // 确认邮箱修改
  async confirmEmailChange(emailData) {
    return apiRequest(API_ENDPOINTS.CONFIRM_EMAIL_CHANGE, {
      method: 'POST',
      body: JSON.stringify(emailData)
    })
  },

  // 获取公开用户资料
  async getPublicProfile(userId) {
    return apiRequest(`${API_ENDPOINTS.USER_PROFILE_PUBLIC}${userId}/`)
  },

  // 切换关注状态
  async toggleFollow(userId) {
    return apiRequest(API_ENDPOINTS.TOGGLE_FOLLOW, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId })
    })
  },

  // 获取隐私设置
  async getPrivacySettings() {
    return apiRequest(API_ENDPOINTS.PRIVACY_SETTINGS)
  },

  // 更新隐私设置
  async updatePrivacySettings(settings) {
    return apiRequest(API_ENDPOINTS.PRIVACY_SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  },

  // 获取粉丝列表
  async getFollowers(userId, page = 1, pageSize = 20) {
    return apiRequest(`${API_ENDPOINTS.GET_FOLLOWERS}${userId}/?page=${page}&page_size=${pageSize}`)
  },

  // 获取关注列表
  async getFollowing(userId, page = 1, pageSize = 20) {
    return apiRequest(`${API_ENDPOINTS.GET_FOLLOWING}${userId}/?page=${page}&page_size=${pageSize}`)
  }
}

// 市场数据相关的API函数
// TODO: 等待后端市场应用创建后启用
// export const marketAPI = {
//   // 获取市场概览数据
//   async getMarketOverview() {
//     return apiRequest(`${API_BASE_URL}/market/overview/`)
//   },
//
//   // 获取代币列表
//   async getTokensList(params = {}) {
//     const queryParams = new URLSearchParams(params).toString()
//     return apiRequest(`${API_BASE_URL}/market/tokens/?${queryParams}`)
//   },
//
//   // 获取代币详情
//   async getTokenDetail(tokenId) {
//     return apiRequest(`${API_BASE_URL}/market/tokens/${tokenId}/`)
//   }
// }

// 错误处理工具函数
export function handleApiError(error) {
  if (error.message.includes('401')) {
    // 未授权，清除token并跳转到登录页
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    window.location.href = '/auth'
    return '登录已过期，请重新登录'
  } else if (error.message.includes('403')) {
    return '没有权限执行此操作'
  } else if (error.message.includes('404')) {
    return '请求的资源不存在'
  } else if (error.message.includes('500')) {
    return '服务器内部错误，请稍后重试'
  } else {
    return error.message || '网络错误，请检查网络连接'
  }
}
