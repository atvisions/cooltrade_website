// API 配置和工具函数

// API 基础URL - 直接使用环境变量（构建时确定）
// 开发环境使用 .env.development，生产环境使用 .env.production
const _API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// 导出 API 基础 URL（不带 /api 路径，向后兼容）
export const API_BASE_URL = _API_BASE_URL

// 导出 API 基础 URL（带 /api 路径）
export const getAPIBaseURL = () => `${_API_BASE_URL}/api`

// 创建一个函数来生成 API 端点，确保每次都使用最新的 API_BASE_URL
const createAPIEndpoints = () => {
  const API_BASE_URL = getAPIBaseURL()

  return {
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
    TOKEN_LIST: `${API_BASE_URL}/market/tokens/`,

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
    BOT_PERFORMANCE_ANALYSIS: `${API_BASE_URL}/trading/bots/performance_analysis/`,
    BOT_MY_SHARES: `${API_BASE_URL}/trading/bots/my_shares/`,

    // 策略市场相关
    MARKETPLACE_LIST: `${API_BASE_URL}/trading/marketplace/`,
    MARKETPLACE_DETAIL: (shareCode) => `${API_BASE_URL}/trading/marketplace/${shareCode}/`,
    MARKETPLACE_COPY: (shareCode) => `${API_BASE_URL}/trading/marketplace/${shareCode}/copy/`,
    MARKETPLACE_STATS: `${API_BASE_URL}/trading/marketplace/stats/`,

    TRADING_PAIRS: `${API_BASE_URL}/trading/trading-pairs/`,
    TRADING_PAIR_INFO: `${API_BASE_URL}/market/trading-pair-info/`,
    EXCHANGE_API_SYNC: (id) => `${API_BASE_URL}/auth/exchange-apis/${id}/sync/`,
    EXCHANGE_API_TEST: `${API_BASE_URL}/auth/exchange-apis/test/`,

    // 信号相关
    SIGNAL_LIST: `${API_BASE_URL}/trading/signals/`,
    SIGNAL_DETAIL: (id) => `${API_BASE_URL}/trading/signals/${id}/`,
    SIGNAL_ACTIVE: `${API_BASE_URL}/trading/signals/active/`,
    SIGNAL_STATISTICS: `${API_BASE_URL}/trading/signals/statistics/`,
    SIGNAL_MARK_EXECUTED: (id) => `${API_BASE_URL}/trading/signals/${id}/mark_executed/`,
    SIGNAL_CANCEL: (id) => `${API_BASE_URL}/trading/signals/${id}/cancel/`,

    // 信号触发器相关
    SIGNAL_TRIGGER_LIST: `${API_BASE_URL}/trading/signal-triggers/`,
    SIGNAL_TRIGGER_CREATE: `${API_BASE_URL}/trading/signal-triggers/`,
    SIGNAL_TRIGGER_DETAIL: (id) => `${API_BASE_URL}/trading/signal-triggers/${id}/`,
    SIGNAL_TRIGGER_TOGGLE: (id) => `${API_BASE_URL}/trading/signal-triggers/${id}/toggle/`,
    SIGNAL_TRIGGER_AVAILABLE_BOTS: `${API_BASE_URL}/trading/signal-triggers/available_bots/`,

    // 交易建议相关
    RECOMMENDATION_LIST: `${API_BASE_URL}/trading/recommendations/`,
    RECOMMENDATION_DETAIL: (id) => `${API_BASE_URL}/trading/recommendations/${id}/`,
    RECOMMENDATION_PENDING: `${API_BASE_URL}/trading/recommendations/pending/`,
    RECOMMENDATION_APPROVE: (id) => `${API_BASE_URL}/trading/recommendations/${id}/approve/`,
    RECOMMENDATION_REJECT: (id) => `${API_BASE_URL}/trading/recommendations/${id}/reject/`,

    // 风控配置相关
    RISK_CONFIG: `${API_BASE_URL}/trading/risk-config/`,
    RISK_CONFIG_DETAIL: (id) => `${API_BASE_URL}/trading/risk-config/${id}/`,
    RISK_CONFIG_RESET_BREAKER: (id) => `${API_BASE_URL}/trading/risk-config/${id}/reset_breaker/`,
    RISK_CONFIG_UPDATE_METRICS: `${API_BASE_URL}/trading/risk-config/update_metrics/`,

    // 交易记录相关
    TRADE_LIST: `${API_BASE_URL}/trading/trades/`,
    TRADE_DETAIL: (id) => `${API_BASE_URL}/trading/trades/${id}/`,

    // 持仓相关
    POSITION_LIST: `${API_BASE_URL}/trading/positions/`,
    POSITION_DETAIL: (id) => `${API_BASE_URL}/trading/positions/${id}/`,
    POSITION_OPEN: `${API_BASE_URL}/trading/positions/open/`,
    POSITION_CLOSE: (id) => `${API_BASE_URL}/trading/positions/${id}/close/`,

    // 会员相关
    MEMBERSHIP_PLANS: `${API_BASE_URL}/auth/membership/plans/`,
    MEMBERSHIP_STATUS: `${API_BASE_URL}/auth/membership/status/`,
    MEMBERSHIP_ORDERS: `${API_BASE_URL}/auth/membership/orders/`,
    CREATE_MEMBERSHIP_ORDER: `${API_BASE_URL}/auth/membership/orders/create/`,

    // 加密货币支付相关
    CRYPTO_SUPPORTED_TOKENS: `${API_BASE_URL}/auth/crypto/supported-tokens/`,
    CRYPTO_CREATE_ORDER: `${API_BASE_URL}/auth/crypto/create-order/`,
    CRYPTO_VERIFY_PAYMENT: `${API_BASE_URL}/auth/crypto/verify-payment/`,
    CRYPTO_PAYMENT_STATUS: (orderId) => `${API_BASE_URL}/auth/crypto/payment-status/${orderId}/`,
    CRYPTO_TOKEN_PRICE: `${API_BASE_URL}/auth/crypto/token-price/`,
    USER_ORDERS: `${API_BASE_URL}/auth/orders/`,
    CANCEL_ORDER: `${API_BASE_URL}/auth/orders/cancel/`,

    // Market 相关 API
    MARKET_STATS: `${API_BASE_URL}/market/stats/`,
    MARKET_TOKENS: `${API_BASE_URL}/market/tokens/`,
    MARKET_TOKEN_DETAIL: (symbol) => `${API_BASE_URL}/market/tokens/${symbol}/detail/`,
    MARKET_TOKEN_TOGGLE_FAVORITE: (symbol) => `${API_BASE_URL}/market/tokens/${symbol}/toggle_favorite/`,
    MARKET_TOKEN_SENTIMENT: (symbol) => `${API_BASE_URL}/market/tokens/${symbol}/sentiment/`,
    MARKET_TOKENS_CHAINS: `${API_BASE_URL}/market/tokens/chains/`,
    MARKET_TOKENS_EXCHANGES: `${API_BASE_URL}/market/tokens/exchanges/`,
    MARKET_TOKENS_CATEGORIES: `${API_BASE_URL}/market/tokens/categories/`,
    MARKET_TOKENS_FAVORITES: `${API_BASE_URL}/market/tokens/favorites/`,
    MARKET_TOKENS_TOP100: `${API_BASE_URL}/market/tokens/top100/`,
    MARKET_TOKENS_HOT: `${API_BASE_URL}/market/tokens/hot/`,
    MARKET_TOKENS_NEWEST: `${API_BASE_URL}/market/tokens/newest/`,
    MARKET_TOKENS_RECOMMENDED: `${API_BASE_URL}/market/tokens/recommended/`,
    MARKET_TOKENS_PERSONALIZED: `${API_BASE_URL}/market/tokens/personalized_recommendations/`,
    MARKET_TOKENS_AI_RECOMMEND: `${API_BASE_URL}/market/tokens/ai_recommend/`,
    MARKET_TOKENS_TRENDING: `${API_BASE_URL}/market/tokens/trending/`,
    MARKET_TOKENS_TOP_GAINERS: `${API_BASE_URL}/market/tokens/top_gainers/`,
    MARKET_TOKENS_TOP_LOSERS: `${API_BASE_URL}/market/tokens/top_losers/`,
    MARKET_TOKENS_TOP_VOLUME: `${API_BASE_URL}/market/tokens/top_volume/`,
    MARKET_KLINES: (symbol) => `${API_BASE_URL}/market/klines/${symbol}/`,
    MARKET_TOKEN_KLINES: (symbol) => `${API_BASE_URL}/market/tokens/${symbol}/klines/`,

    // 其他端点可以在这里添加
  }
}

// 使用 Proxy 让 API_ENDPOINTS 动态返回正确的 URL
export const API_ENDPOINTS = new Proxy({}, {
  get(_target, prop) {
    const endpoints = createAPIEndpoints()
    return endpoints[prop]
  }
})

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
      let errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`

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
    return apiRequest(`${getAPIBaseURL()}/auth/request-password-reset/`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // 使用验证码重置密码
  async resetPasswordWithCode(email, code, newPassword, confirmPassword) {
    return apiRequest(`${getAPIBaseURL()}/auth/reset-password-with-code/`, {
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
    return apiRequest(`${getAPIBaseURL()}/market/overview/`)
  },

  // 获取代币列表
  async getTokenList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${getAPIBaseURL()}/market/tokens/?${queryParams}` : `${getAPIBaseURL()}/market/tokens/`
    return apiRequest(url)
  },

  // 获取代币详情
  async getTokenDetail(tokenId) {
    return apiRequest(`${getAPIBaseURL()}/market/tokens/${tokenId}/`)
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

  // 获取最新信号及AI价格建议
  async getLatestSignal(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/bots/${id}/latest-signal/`)
  },

  // 获取机器人指标实时值
  async getBotIndicatorValues(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/bots/${id}/indicator-values/`)
  },

  // 获取分享统计
  async getShareStats(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/bots/${id}/share_stats/`)
  },

  // 取消分享
  async unshareBot(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/bots/${id}/unshare/`, {
      method: 'POST'
    })
  },

  // 获取我的分享列表
  async getMyShares() {
    return apiRequest(API_ENDPOINTS.BOT_MY_SHARES)
  },

  // 获取机器人统计数据
  async getBotStatistics() {
    return apiRequest(API_ENDPOINTS.BOT_STATISTICS)
  },

  // 获取性能分析数据
  async getPerformanceAnalysis(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.BOT_PERFORMANCE_ANALYSIS}?${queryParams}` : API_ENDPOINTS.BOT_PERFORMANCE_ANALYSIS
    return apiRequest(url)
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
  },

  // ===== 信号触发器相关 =====
  // 获取触发器列表
  async getTriggerList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.SIGNAL_TRIGGER_LIST}?${queryParams}` : API_ENDPOINTS.SIGNAL_TRIGGER_LIST
    return apiRequest(url)
  },

  // 创建触发器
  async createTrigger(data) {
    return apiRequest(API_ENDPOINTS.SIGNAL_TRIGGER_CREATE, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 获取触发器详情
  async getTriggerDetail(id) {
    return apiRequest(API_ENDPOINTS.SIGNAL_TRIGGER_DETAIL(id))
  },

  // 更新触发器
  async updateTrigger(id, data) {
    return apiRequest(API_ENDPOINTS.SIGNAL_TRIGGER_DETAIL(id), {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  // 删除触发器
  async deleteTrigger(id) {
    return apiRequest(API_ENDPOINTS.SIGNAL_TRIGGER_DETAIL(id), {
      method: 'DELETE'
    })
  },

  // 切换触发器状态
  async toggleTrigger(id) {
    return apiRequest(API_ENDPOINTS.SIGNAL_TRIGGER_TOGGLE(id), {
      method: 'POST'
    })
  },

  // 获取可用的机器人列表
  async getAvailableBots() {
    return apiRequest(API_ENDPOINTS.SIGNAL_TRIGGER_AVAILABLE_BOTS)
  },

  // ===== 回测相关 =====
  // 创建回测
  async createBacktest(data) {
    return apiRequest(`${getAPIBaseURL()}/trading/backtests/`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 获取回测详情
  async getBacktestDetail(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/backtests/${id}/`)
  },

  // 获取回测列表
  async getBacktestList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${getAPIBaseURL()}/trading/backtests/?${queryParams}` : `${getAPIBaseURL()}/trading/backtests/`
    return apiRequest(url)
  },

  // 获取回测资金曲线
  async getBacktestEquityCurve(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/backtests/${id}/equity_curve/`)
  },

  // 获取回测交易明细
  async getBacktestTrades(id, params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${getAPIBaseURL()}/trading/backtests/${id}/trades/?${queryParams}` : `${getAPIBaseURL()}/trading/backtests/${id}/trades/`
    return apiRequest(url)
  },

  // 获取回测统计信息
  async getBacktestStatistics(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/backtests/${id}/statistics/`)
  },

  // 删除回测
  async deleteBacktest(id) {
    return apiRequest(`${getAPIBaseURL()}/trading/backtests/${id}/`, {
      method: 'DELETE'
    })
  },

  // ===== 交易建议相关 =====
  // 获取交易建议列表
  async getRecommendationList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.RECOMMENDATION_LIST}?${queryParams}` : API_ENDPOINTS.RECOMMENDATION_LIST
    return apiRequest(url)
  },

  // 获取交易建议详情
  async getRecommendationDetail(id) {
    return apiRequest(API_ENDPOINTS.RECOMMENDATION_DETAIL(id))
  },

  // 获取待处理的交易建议
  async getPendingRecommendations() {
    return apiRequest(API_ENDPOINTS.RECOMMENDATION_PENDING)
  },

  // 批准交易建议
  async approveRecommendation(id) {
    return apiRequest(API_ENDPOINTS.RECOMMENDATION_APPROVE(id), {
      method: 'POST'
    })
  },

  // 拒绝交易建议
  async rejectRecommendation(id) {
    return apiRequest(API_ENDPOINTS.RECOMMENDATION_REJECT(id), {
      method: 'POST'
    })
  },

  // ===== 风控配置相关 =====
  // 获取风控配置
  async getRiskConfig() {
    return apiRequest(API_ENDPOINTS.RISK_CONFIG)
  },

  // 创建风控配置
  async createRiskConfig(data) {
    return apiRequest(API_ENDPOINTS.RISK_CONFIG, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 更新风控配置
  async updateRiskConfig(id, data) {
    return apiRequest(API_ENDPOINTS.RISK_CONFIG_DETAIL(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // 重置熔断机制
  async resetCircuitBreaker(id) {
    return apiRequest(API_ENDPOINTS.RISK_CONFIG_RESET_BREAKER(id), {
      method: 'POST'
    })
  },

  // 更新风控指标
  async updateRiskMetrics() {
    return apiRequest(API_ENDPOINTS.RISK_CONFIG_UPDATE_METRICS, {
      method: 'POST'
    })
  },

  // ===== 交易记录相关 =====
  // 获取交易记录列表
  async getTradeList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.TRADE_LIST}?${queryParams}` : API_ENDPOINTS.TRADE_LIST
    return apiRequest(url)
  },

  // 获取交易记录详情
  async getTradeDetail(id) {
    return apiRequest(API_ENDPOINTS.TRADE_DETAIL(id))
  },

  // ===== 持仓相关 =====
  // 获取持仓列表
  async getPositionList(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `${API_ENDPOINTS.POSITION_LIST}?${queryParams}` : API_ENDPOINTS.POSITION_LIST
    return apiRequest(url)
  },

  // 获取持仓详情
  async getPositionDetail(id) {
    return apiRequest(API_ENDPOINTS.POSITION_DETAIL(id))
  },

  // 获取未平仓列表
  async getOpenPositions() {
    return apiRequest(API_ENDPOINTS.POSITION_OPEN)
  },

  // 手动平仓
  async closePosition(id) {
    return apiRequest(API_ENDPOINTS.POSITION_CLOSE(id), {
      method: 'POST'
    })
  }
}

// 会员相关的API函数
export const membershipAPI = {
  // 获取会员套餐列表
  async getPlans() {
    return apiRequest(API_ENDPOINTS.MEMBERSHIP_PLANS)
  },

  // 获取用户会员状态
  async getStatus() {
    return apiRequest(API_ENDPOINTS.MEMBERSHIP_STATUS)
  },

  // 获取订单历史
  async getOrders() {
    return apiRequest(API_ENDPOINTS.MEMBERSHIP_ORDERS)
  },

  // 创建订单（传统支付）
  async createOrder(planId, paymentMethod) {
    return apiRequest(API_ENDPOINTS.CREATE_MEMBERSHIP_ORDER, {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId, payment_method: paymentMethod })
    })
  },

  // 创建加密货币订单
  async createCryptoOrder(planId, tokenSymbol = 'USDT', network = 'ethereum') {
    return apiRequest(API_ENDPOINTS.CRYPTO_CREATE_ORDER, {
      method: 'POST',
      body: JSON.stringify({
        plan_id: planId,
        token_symbol: tokenSymbol,
        network: network
      })
    })
  },

  // 验证加密货币支付
  async verifyCryptoPayment(orderId, txHash, tokenSymbol, network) {
    return apiRequest(API_ENDPOINTS.CRYPTO_VERIFY_PAYMENT, {
      method: 'POST',
      body: JSON.stringify({
        order_id: orderId,
        tx_hash: txHash,
        token_symbol: tokenSymbol,
        network: network
      })
    })
  },

  // 查询支付状态
  async getPaymentStatus(orderId) {
    return apiRequest(API_ENDPOINTS.CRYPTO_PAYMENT_STATUS(orderId))
  },

  // 获取支持的代币
  async getSupportedTokens() {
    return apiRequest(API_ENDPOINTS.CRYPTO_SUPPORTED_TOKENS)
  },

  // 获取代币价格
  async getTokenPrice(tokenSymbol, network) {
    return apiRequest(API_ENDPOINTS.CRYPTO_TOKEN_PRICE, {
      params: { token_symbol: tokenSymbol, network: network }
    })
  },

  // 获取用户所有订单
  async getUserOrders() {
    return apiRequest(API_ENDPOINTS.USER_ORDERS)
  },

  // 取消订单
  async cancelOrder(orderId) {
    return apiRequest(API_ENDPOINTS.CANCEL_ORDER, {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId })
    })
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
