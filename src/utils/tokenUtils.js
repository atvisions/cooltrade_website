/**
 * 代币相关工具函数
 */

/**
 * 默认的占位图标 URL（内联 SVG，不需要网络请求）
 */
export const DEFAULT_TOKEN_LOGO = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#e2e8f0"/><text x="20" y="25" text-anchor="middle" fill="#64748b" font-size="14" font-family="Arial">?</text></svg>')

/**
 * USDT Logo（内联 SVG，绿色圆形+白色T字）
 */
export const USDT_LOGO = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#26A17B"/><path d="M22.5 21.5v4.5h-5v-4.5h-6v-3h6v-4h-4v-3h13v3h-4v4h6v3h-6z" fill="white"/></svg>')

/**
 * 使用 CryptoCompare 的 logo（国内可访问）
 * @param {string} symbol - 代币符号，如 BTC, ETH
 * @returns {string} Logo URL
 */
export function getCryptoCompareLogo(symbol) {
  if (!symbol) return DEFAULT_TOKEN_LOGO
  return `https://www.cryptocompare.com/media/37746251/${symbol.toLowerCase()}.png`
}

/**
 * 获取代币 Logo URL
 * 使用 CryptoCompare 作为主要来源（国内可访问）
 * @param {Object} token - 代币对象
 * @returns {string} Logo URL
 */
export function getTokenLogo(token) {
  if (!token) return DEFAULT_TOKEN_LOGO

  // 使用代币符号从 CryptoCompare 获取 logo
  if (token.symbol) {
    return getCryptoCompareLogo(token.symbol)
  }

  return DEFAULT_TOKEN_LOGO
}

/**
 * 获取代币 Logo URL（从 bot 对象）
 * @param {Object} bot - 机器人对象
 * @returns {string} Logo URL
 */
export function getBotTokenLogo(bot) {
  if (!bot) return DEFAULT_TOKEN_LOGO

  // 使用代币符号从 CryptoCompare 获取 logo
  if (bot.token_symbol) {
    return getCryptoCompareLogo(bot.token_symbol)
  }

  return DEFAULT_TOKEN_LOGO
}

/**
 * 图片加载失败时的处理函数
 * 添加标记防止无限循环重试
 * @param {Event} e - 图片错误事件
 */
export function handleImageError(e) {
  // 检查是否已经处理过，防止无限循环
  if (e.target.dataset.errorHandled) {
    return
  }

  // 标记已处理
  e.target.dataset.errorHandled = 'true'

  // 使用内联 SVG 占位图（不需要网络请求）
  e.target.src = DEFAULT_TOKEN_LOGO
}

