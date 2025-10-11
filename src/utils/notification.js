/**
 * 全局通知工具
 */

// 通知类型
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// 默认配置
const defaultConfig = {
  duration: 5000,
  showProgress: true,
  position: 'top-right'
}

/**
 * 显示通知
 * @param {Object} options 通知选项
 * @param {string} options.type 通知类型 (success, error, warning, info)
 * @param {string} options.title 通知标题
 * @param {string} options.message 通知消息
 * @param {number} options.duration 显示时长(ms)，0为不自动关闭
 * @param {boolean} options.showProgress 是否显示进度条
 */
export const showNotification = (options) => {
  const notification = {
    ...defaultConfig,
    ...options,
    timestamp: Date.now()
  }

  // 触发全局事件
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: notification
  }))

  return notification
}

/**
 * 显示成功通知
 * @param {string} message 消息内容
 * @param {string} title 标题（可选）
 * @param {Object} options 其他选项
 */
export const showSuccess = (message, title = null, options = {}) => {
  return showNotification({
    type: NotificationType.SUCCESS,
    title,
    message,
    ...options
  })
}

/**
 * 显示错误通知
 * @param {string} message 消息内容
 * @param {string} title 标题（可选）
 * @param {Object} options 其他选项
 */
export const showError = (message, title = null, options = {}) => {
  return showNotification({
    type: NotificationType.ERROR,
    title: title || '错误',
    message,
    duration: 8000, // 错误消息显示更长时间
    ...options
  })
}

/**
 * 显示警告通知
 * @param {string} message 消息内容
 * @param {string} title 标题（可选）
 * @param {Object} options 其他选项
 */
export const showWarning = (message, title = null, options = {}) => {
  return showNotification({
    type: NotificationType.WARNING,
    title: title || '警告',
    message,
    duration: 6000,
    ...options
  })
}

/**
 * 显示信息通知
 * @param {string} message 消息内容
 * @param {string} title 标题（可选）
 * @param {Object} options 其他选项
 */
export const showInfo = (message, title = null, options = {}) => {
  return showNotification({
    type: NotificationType.INFO,
    title,
    message,
    ...options
  })
}

/**
 * 显示加载通知
 * @param {string} message 消息内容
 * @param {string} title 标题（可选）
 */
export const showLoading = (message, title = null) => {
  return showNotification({
    type: NotificationType.INFO,
    title: title || '处理中',
    message,
    duration: 0, // 不自动关闭
    showProgress: false
  })
}

/**
 * 快捷方法 - 充值成功
 */
export const showRechargeSuccess = (amount, balance) => {
  return showSuccess(
    `充值 ¥${amount} 成功，当前余额 ¥${balance}`,
    '充值成功',
    { duration: 6000 }
  )
}

/**
 * 快捷方法 - 支付成功
 */
export const showPaymentSuccess = (amount, item) => {
  return showSuccess(
    `支付 ¥${amount} 成功${item ? `，已购买 ${item}` : ''}`,
    '支付成功',
    { duration: 6000 }
  )
}

/**
 * 快捷方法 - 登录成功
 */
export const showLoginSuccess = (username) => {
  return showSuccess(
    `欢迎回来${username ? `，${username}` : ''}！`,
    '登录成功'
  )
}

/**
 * 快捷方法 - 注册成功
 */
export const showRegisterSuccess = (username) => {
  return showSuccess(
    `欢迎加入 CoolTrade${username ? `，${username}` : ''}！`,
    '注册成功'
  )
}

/**
 * 快捷方法 - 密码重置成功
 */
export const showPasswordResetSuccess = () => {
  return showSuccess(
    '密码重置成功，正在跳转到仪表板...',
    '重置成功'
  )
}

/**
 * 快捷方法 - 验证码发送成功
 */
export const showCodeSentSuccess = (email) => {
  return showSuccess(
    `验证码已发送到 ${email}`,
    '发送成功'
  )
}

/**
 * 快捷方法 - 操作成功
 */
export const showOperationSuccess = (operation) => {
  return showSuccess(`${operation}成功`)
}

/**
 * 快捷方法 - 网络错误
 */
export const showNetworkError = () => {
  return showError(
    '网络连接失败，请检查网络设置后重试',
    '网络错误'
  )
}

/**
 * 快捷方法 - 服务器错误
 */
export const showServerError = () => {
  return showError(
    '服务器暂时无法响应，请稍后重试',
    '服务器错误'
  )
}

/**
 * 快捷方法 - 权限错误
 */
export const showPermissionError = () => {
  return showError(
    '您没有权限执行此操作',
    '权限不足'
  )
}

/**
 * 快捷方法 - 收藏成功
 */
export const showFavoriteSuccess = (tokenName) => {
  return showSuccess(
    `${tokenName} 已添加到收藏`,
    '收藏成功',
    { duration: 3000 }
  )
}

/**
 * 快捷方法 - 取消收藏成功
 */
export const showUnfavoriteSuccess = (tokenName) => {
  return showSuccess(
    `${tokenName} 已从收藏中移除`,
    '取消收藏',
    { duration: 3000 }
  )
}

/**
 * 快捷方法 - 需要登录
 */
export const showLoginRequired = () => {
  return showWarning(
    '请先登录后再进行此操作',
    '需要登录',
    { duration: 4000 }
  )
}

// 默认导出
export default {
  show: showNotification,
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,

  // 快捷方法
  rechargeSuccess: showRechargeSuccess,
  paymentSuccess: showPaymentSuccess,
  loginSuccess: showLoginSuccess,
  registerSuccess: showRegisterSuccess,
  passwordResetSuccess: showPasswordResetSuccess,
  codeSentSuccess: showCodeSentSuccess,
  operationSuccess: showOperationSuccess,
  networkError: showNetworkError,
  serverError: showServerError,
  permissionError: showPermissionError,
  favoriteSuccess: showFavoriteSuccess,
  unfavoriteSuccess: showUnfavoriteSuccess,
  loginRequired: showLoginRequired
}
