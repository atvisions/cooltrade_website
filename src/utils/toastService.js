import { useToast } from 'primevue/usetoast'

let toastInstance = null

export function initToastService(app) {
  toastInstance = useToast()
}

export function showSuccess(message, title = '成功') {
  if (!toastInstance) return
  toastInstance.add({
    severity: 'success',
    summary: title,
    detail: message,
    life: 3000
  })
}

export function showError(message, title = '错误') {
  if (!toastInstance) return
  toastInstance.add({
    severity: 'error',
    summary: title,
    detail: message,
    life: 3000
  })
}

export function showWarning(message, title = '警告') {
  if (!toastInstance) return
  toastInstance.add({
    severity: 'warn',
    summary: title,
    detail: message,
    life: 3000
  })
}

export function showInfo(message, title = '提示') {
  if (!toastInstance) return
  toastInstance.add({
    severity: 'info',
    summary: title,
    detail: message,
    life: 3000
  })
}

// 通用的 showToast 函数，根据类型调用对应的函数
export function showToast(message, type = 'info', title = null) {
  const typeMap = {
    'success': () => showSuccess(message, title || '成功'),
    'error': () => showError(message, title || '错误'),
    'warning': () => showWarning(message, title || '警告'),
    'warn': () => showWarning(message, title || '警告'),
    'info': () => showInfo(message, title || '提示')
  }

  const showFn = typeMap[type] || typeMap['info']
  showFn()
}

