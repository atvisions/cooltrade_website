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

