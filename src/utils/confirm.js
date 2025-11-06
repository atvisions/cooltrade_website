/**
 * 全局确认对话框工具
 */

/**
 * 显示确认对话框
 * @param {Object} options 对话框选项
 * @param {string} options.type 类型 (warning, danger, info, success)
 * @param {string} options.title 标题
 * @param {string} options.message 消息
 * @param {string} options.confirmText 确认按钮文本
 * @param {string} options.cancelText 取消按钮文本
 * @returns {Promise<boolean>} 用户是否确认
 */
export const showConfirm = (options) => {
  return new Promise((resolve) => {
    const confirmOptions = {
      type: 'warning',
      confirmText: '确认',
      cancelText: '取消',
      ...options
    }

    // 触发全局事件
    window.dispatchEvent(new CustomEvent('show-confirm', {
      detail: {
        ...confirmOptions,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      }
    }))
  })
}

/**
 * 显示警告确认对话框
 * @param {string} title 标题
 * @param {string} message 消息
 * @param {Object} options 其他选项
 * @returns {Promise<boolean>}
 */
export const showWarningConfirm = (title, message, options = {}) => {
  return showConfirm({
    type: 'warning',
    title,
    message,
    ...options
  })
}

/**
 * 显示危险确认对话框
 * @param {string} title 标题
 * @param {string} message 消息
 * @param {Object} options 其他选项
 * @returns {Promise<boolean>}
 */
export const showDangerConfirm = (title, message, options = {}) => {
  return showConfirm({
    type: 'danger',
    title,
    message,
    confirmText: '确认删除',
    ...options
  })
}

/**
 * 显示信息确认对话框
 * @param {string} title 标题
 * @param {string} message 消息
 * @param {Object} options 其他选项
 * @returns {Promise<boolean>}
 */
export const showInfoConfirm = (title, message, options = {}) => {
  return showConfirm({
    type: 'info',
    title,
    message,
    ...options
  })
}

// 默认导出
export default {
  show: showConfirm,
  warning: showWarningConfirm,
  danger: showDangerConfirm,
  info: showInfoConfirm
}

