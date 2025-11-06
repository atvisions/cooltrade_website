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

  // 代币搜索
  TOKEN_SEARCH: `${API_BASE_URL}/market/tokens/search/`,

  // AI 策略相关
  AI_STRATEGY_SEARCH_TOKEN: `${API_BASE_URL}/market/tokens/search/`,  // 兼容旧代码
  AI_STRATEGY_GENERATE: `${API_BASE_URL}/market/ai-strategy/generate/`,
  AI_STRATEGY_LIST: `${API_BASE_URL}/market/ai-strategy/list/`,
  AI_STRATEGY_DETAIL: `${API_BASE_URL}/market/ai-strategy/`,
  AI_STRATEGY_APPLY: `${API_BASE_URL}/market/ai-strategy/apply/`,
  AI_STRATEGY_SHARE: `${API_BASE_URL}/market/ai-strategy/share/`,
  AI_STRATEGY_LIKE: `${API_BASE_URL}/market/ai-strategy/like/`,

  // 交易所 API 相关
  EXCHANGE_API_LIST: `${API_BASE_URL}/auth/exchange-apis/`,
  EXCHANGE_API_CREATE: `${API_BASE_URL}/auth/exchange-apis/create/`,
  EXCHANGE_API_DETAIL: (id) => `${API_BASE_URL}/auth/exchange-apis/${id}/`,
  SUPPORTED_EXCHANGES: `${API_BASE_URL}/auth/exchanges/supported/`,

  // 交易机器人相关
  BOT_LIST: `${API_BASE_URL}/trading/bots/`,
  BOT_CREATE: `${API_BASE_URL}/trading/bots/`,
  BOT_DETAIL: (id) => `${API_BASE_URL}/trading/bots/${id}/`,
  BOT_UPDATE: (id) => `${API_BASE_URL}/trading/bots/${id}/`,
  BOT_DELETE: (id) => `${API_BASE_URL}/trading/bots/${id}/`,
  BOT_START: (id) => `${API_BASE_URL}/trading/bots/${id}/start/`,
  BOT_STOP: (id) => `${API_BASE_URL}/trading/bots/${id}/stop/`,
  BOT_PAUSE: (id) => `${API_BASE_URL}/trading/bots/${id}/pause/`,
  BOT_TRADES: (id) => `${API_BASE_URL}/trading/bots/${id}/trades/`,
  BOT_SIGNALS: (id) => `${API_BASE_URL}/trading/bots/${id}/signals/`,
  BOT_STATISTICS: `${API_BASE_URL}/trading/bots/statistics/`,
  EXCHANGE_API_SYNC: (id) => `${API_BASE_URL}/auth/exchange-apis/${id}/sync/`,
  EXCHANGE_API_TEST: `${API_BASE_URL}/auth/exchange-apis/test/`,

  // 信号相关
  SIGNAL_LIST: `${API_BASE_URL}/trading/signals/`,
  SIGNAL_DETAIL: (id) => `${API_BASE_URL}/trading/signals/${id}/`,
  SIGNAL_ACTIVE: `${API_BASE_URL}/trading/signals/active/`,
  SIGNAL_STATISTICS: `${API_BASE_URL}/trading/signals/statistics/`,
  SIGNAL_MARK_EXECUTED: (id) => `${API_BASE_URL}/trading/signals/${id}/mark_executed/`,
  SIGNAL_CANCEL: (id) => `${API_BASE_URL}/trading/signals/${id}/cancel/`,

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

  // 处理查询参数
  let finalUrl = url
  if (options.params) {
    const queryParams = new URLSearchParams(options.params).toString()
    finalUrl = `${url}?${queryParams}`
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  // 移除params，因为已经添加到URL中
  delete config.params

  try {
    const response = await fetch(finalUrl, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // 构建详细的错误信息
      let errorMessage = errorData.message || `HTTP error! status: ${response.status}`

      // 如果有验证错误，添加详细信息
      if (errorData.errors && typeof errorData.errors === 'object') {
        const errorDetails = Object.entries(errorData.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('; ')
        if (errorDetails) {
          errorMessage = `${errorData.error || '验证失败'} - ${errorDetails}`
        }
      }

      const error = new Error(errorMessage)
      error.status = response.status
      error.data = errorData
      throw error
    }

    // 处理 204 No Content 响应（如 DELETE 请求）
    if (response.status === 204) {
      return { success: true }
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

// 交易所 API 相关的函数
export const exchangeAPI = {
  // 获取所有交易所配置
  async getExchangeList() {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_LIST)
  },

  // 创建交易所配置
  async createExchange(exchangeData) {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_CREATE, {
      method: 'POST',
      body: JSON.stringify(exchangeData)
    })
  },

  // 获取单个交易所配置
  async getExchangeDetail(id) {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_DETAIL(id))
  },

  // 更新交易所配置
  async updateExchange(id, exchangeData) {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_DETAIL(id), {
      method: 'PUT',
      body: JSON.stringify(exchangeData)
    })
  },

  // 删除交易所配置
  async deleteExchange(id) {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_DETAIL(id), {
      method: 'DELETE'
    })
  },

  // 同步余额
  async syncBalance(id) {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_SYNC(id), {
      method: 'POST'
    })
  },

  // 获取支持的交易所列表
  async getSupportedExchanges() {
    return apiRequest(API_ENDPOINTS.SUPPORTED_EXCHANGES)
  },

  // 测试连接（不保存）
  async testConnection(exchangeData) {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_TEST, {
      method: 'POST',
      body: JSON.stringify(exchangeData)
    })
  },

  // 更新交易所状态（启用/禁用）
  async updateExchangeStatus(id, status) {
    return apiRequest(API_ENDPOINTS.EXCHANGE_API_DETAIL(id), {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }
}

// 市场数据相关的API函数
export const marketAPI = {
  // 获取市场概览数据
  async getMarketOverview() {
    return apiRequest(`${API_BASE_URL}/market/overview/`)
  },

  // 获取代币列表
  async getTokenList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_BASE_URL}/market/tokens/?${queryParams}` : `${API_BASE_URL}/market/tokens/`
    return apiRequest(url)
  },

  // 获取代币详情
  async getTokenDetail(tokenId) {
    return apiRequest(`${API_BASE_URL}/market/tokens/${tokenId}/`)
  }
}

// 交易机器人 API
export const botAPI = {
  // 获取机器人列表
  async getBotList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.BOT_LIST}?${queryParams}` : API_ENDPOINTS.BOT_LIST
    return apiRequest(url)
  },

  // 创建机器人
  async createBot(data) {
    return apiRequest(API_ENDPOINTS.BOT_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 获取机器人详情
  async getBotDetail(id) {
    return apiRequest(API_ENDPOINTS.BOT_DETAIL(id))
  },

  // 更新机器人
  async updateBot(id, data) {
    return apiRequest(API_ENDPOINTS.BOT_UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  // 删除机器人
  async deleteBot(id) {
    return apiRequest(API_ENDPOINTS.BOT_DELETE(id), {
      method: 'DELETE'
    })
  },

  // 启动机器人
  async startBot(id) {
    return apiRequest(API_ENDPOINTS.BOT_START(id), {
      method: 'POST'
    })
  },

  // 停止机器人
  async stopBot(id) {
    return apiRequest(API_ENDPOINTS.BOT_STOP(id), {
      method: 'POST'
    })
  },

  // 暂停机器人
  async pauseBot(id) {
    return apiRequest(API_ENDPOINTS.BOT_PAUSE(id), {
      method: 'POST'
    })
  },

  // 获取机器人交易记录
  async getBotTrades(id, params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.BOT_TRADES(id)}?${queryParams}` : API_ENDPOINTS.BOT_TRADES(id)
    return apiRequest(url)
  },

  // 获取机器人信号记录
  async getBotSignals(id, params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.BOT_SIGNALS(id)}?${queryParams}` : API_ENDPOINTS.BOT_SIGNALS(id)
    return apiRequest(url)
  },

  // 获取机器人统计数据
  async getBotStatistics() {
    return apiRequest(API_ENDPOINTS.BOT_STATISTICS)
  },

  // 获取信号列表
  async getSignalList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.SIGNAL_LIST}?${queryParams}` : API_ENDPOINTS.SIGNAL_LIST
    return apiRequest(url)
  },

  // 获取活跃信号
  async getActiveSignals() {
    return apiRequest(API_ENDPOINTS.SIGNAL_ACTIVE)
  },

  // 获取信号统计
  async getSignalStatistics() {
    return apiRequest(API_ENDPOINTS.SIGNAL_STATISTICS)
  }
}

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
