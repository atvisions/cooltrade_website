/**
 * 时间工具函数
 */

/**
 * 计算剩余时间（人类可读格式）
 * @param {string|Date} expiresAt - 过期时间
 * @returns {Object} { text: string, isExpired: boolean, isExpiringSoon: boolean, minutes: number }
 */
export function getTimeRemaining(expiresAt) {
  if (!expiresAt) {
    return {
      text: '无期限',
      isExpired: false,
      isExpiringSoon: false,
      minutes: Infinity
    }
  }

  const now = new Date()
  const expiry = new Date(expiresAt)
  const diffMs = expiry - now
  const diffMinutes = Math.floor(diffMs / 60000)

  // 已过期
  if (diffMs <= 0) {
    return {
      text: '已过期',
      isExpired: true,
      isExpiringSoon: false,
      minutes: 0
    }
  }

  // 即将过期（5分钟内）
  const isExpiringSoon = diffMinutes <= 5

  // 格式化显示
  let text = ''
  if (diffMinutes < 60) {
    text = `${diffMinutes}分钟`
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60)
    const mins = diffMinutes % 60
    text = mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  } else {
    const days = Math.floor(diffMinutes / 1440)
    const hours = Math.floor((diffMinutes % 1440) / 60)
    text = hours > 0 ? `${days}天${hours}小时` : `${days}天`
  }

  return {
    text,
    isExpired: false,
    isExpiringSoon,
    minutes: diffMinutes
  }
}

/**
 * 格式化时间为相对时间（如：2小时前）
 * @param {string|Date} dateTime - 时间
 * @returns {string} 相对时间字符串
 */
export function formatRelativeTime(dateTime) {
  if (!dateTime) return '-'

  const now = new Date()
  const date = new Date(dateTime)
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}小时前`
  } else if (diffMinutes < 10080) {
    const days = Math.floor(diffMinutes / 1440)
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

/**
 * 格式化日期时间
 * @param {string|Date} dateTime - 时间
 * @param {boolean} includeSeconds - 是否包含秒
 * @returns {string} 格式化的时间字符串
 */
export function formatDateTime(dateTime, includeSeconds = false) {
  if (!dateTime) return '-'

  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  let result = `${year}-${month}-${day} ${hours}:${minutes}`

  if (includeSeconds) {
    const seconds = String(date.getSeconds()).padStart(2, '0')
    result += `:${seconds}`
  }

  return result
}

/**
 * 格式化日期
 * @param {string|Date} dateTime - 时间
 * @returns {string} 格式化的日期字符串
 */
export function formatDate(dateTime) {
  if (!dateTime) return '-'

  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 格式化时间
 * @param {string|Date} dateTime - 时间
 * @param {boolean} includeSeconds - 是否包含秒
 * @returns {string} 格式化的时间字符串
 */
export function formatTime(dateTime, includeSeconds = false) {
  if (!dateTime) return '-'

  const date = new Date(dateTime)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  let result = `${hours}:${minutes}`

  if (includeSeconds) {
    const seconds = String(date.getSeconds()).padStart(2, '0')
    result += `:${seconds}`
  }

  return result
}

/**
 * 获取时间范围的开始和结束时间
 * @param {string} range - 时间范围（'7d', '30d', '90d', '180d', '1y', 'custom'）
 * @param {string} customStart - 自定义开始时间
 * @param {string} customEnd - 自定义结束时间
 * @returns {Object} { start: Date, end: Date }
 */
export function getTimeRange(range, customStart = null, customEnd = null) {
  const now = new Date()
  const end = new Date()
  let start = new Date()

  if (range === 'custom') {
    return {
      start: customStart ? new Date(customStart) : start,
      end: customEnd ? new Date(customEnd) : end
    }
  }

  switch (range) {
    case '7d':
      start.setDate(now.getDate() - 7)
      break
    case '30d':
      start.setDate(now.getDate() - 30)
      break
    case '90d':
      start.setDate(now.getDate() - 90)
      break
    case '180d':
      start.setDate(now.getDate() - 180)
      break
    case '1y':
      start.setFullYear(now.getFullYear() - 1)
      break
    default:
      start.setDate(now.getDate() - 30)
  }

  return { start, end }
}

/**
 * 判断时间是否在今天
 * @param {string|Date} dateTime - 时间
 * @returns {boolean}
 */
export function isToday(dateTime) {
  if (!dateTime) return false

  const date = new Date(dateTime)
  const today = new Date()

  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

/**
 * 判断时间是否在本周
 * @param {string|Date} dateTime - 时间
 * @returns {boolean}
 */
export function isThisWeek(dateTime) {
  if (!dateTime) return false

  const date = new Date(dateTime)
  const today = new Date()
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))

  return date >= firstDayOfWeek && date <= lastDayOfWeek
}

/**
 * 判断时间是否在本月
 * @param {string|Date} dateTime - 时间
 * @returns {boolean}
 */
export function isThisMonth(dateTime) {
  if (!dateTime) return false

  const date = new Date(dateTime)
  const today = new Date()

  return date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

