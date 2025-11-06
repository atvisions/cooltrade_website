import { ref, computed } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

/**
 * 机器人表单 Composable
 * 处理机器人创建、编辑、验证等业务逻辑
 */
export function useBotForm(initialData = null) {
  // 状态
  const formData = ref({
    name: '',
    description: '',
    token: null,
    exchange_api: null,
    trading_pair: 'USDT',
    timeframe: '1h',
    bot_type: 'signal',
    // 信号机器人特定字段
    signal_type: 'price_alert',
    notify_email: true,
    notify_app: true,
    check_interval: '5m',
    // 趋势跟踪机器人特定字段
    max_position_size: 100,
    stop_loss_percentage: 5,
    take_profit_percentage: 10,
    ...initialData
  })

  const errors = ref({})
  const loading = ref(false)
  const isEditing = ref(!!initialData?.id)

  // 验证规则
  const validationRules = {
    name: [
      { required: true, message: '机器人名称不能为空' },
      { min: 2, message: '机器人名称至少2个字符' },
      { max: 100, message: '机器人名称最多100个字符' }
    ],
    token: [
      { required: true, message: '请选择代币' }
    ],
    exchange_api: [
      { required: true, message: '请选择交易所' }
    ],
    trading_pair: [
      { required: true, message: '交易对不能为空' }
    ],
    timeframe: [
      { required: true, message: '时间周期不能为空' }
    ],
    bot_type: [
      { required: true, message: '机器人类型不能为空' }
    ]
  }

  // 计算属性
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0 &&
      formData.value.name &&
      formData.value.token &&
      formData.value.exchange_api
  })

  const isSignalBot = computed(() => formData.value.bot_type === 'signal')
  const isTrendFollowingBot = computed(() => formData.value.bot_type === 'trend_following')

  // 方法
  const validateField = (field) => {
    const rules = validationRules[field]
    if (!rules) return true

    const value = formData.value[field]
    const fieldErrors = []

    for (const rule of rules) {
      if (rule.required && !value) {
        fieldErrors.push(rule.message)
        break
      }
      if (rule.min && value && value.length < rule.min) {
        fieldErrors.push(rule.message)
      }
      if (rule.max && value && value.length > rule.max) {
        fieldErrors.push(rule.message)
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[field] = fieldErrors[0]
      return false
    } else {
      delete errors.value[field]
      return true
    }
  }

  const validateForm = () => {
    errors.value = {}
    let isValid = true

    for (const field of Object.keys(validationRules)) {
      if (!validateField(field)) {
        isValid = false
      }
    }

    return isValid
  }

  const submitForm = async () => {
    if (!validateForm()) {
      showError('请填写所有必填项')
      return false
    }

    try {
      loading.value = true

      if (isEditing.value) {
        await botAPI.updateBot(formData.value.id, formData.value)
        showSuccess('机器人已更新')
      } else {
        await botAPI.createBot(formData.value)
        showSuccess('机器人已创建')
      }

      return true
    } catch (error) {
      console.error('提交表单失败:', error)
      showError(error.message || '提交失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const resetForm = () => {
    formData.value = {
      name: '',
      description: '',
      token: null,
      exchange_api: null,
      trading_pair: 'USDT',
      timeframe: '1h',
      bot_type: 'signal',
      signal_type: 'price_alert',
      notify_email: true,
      notify_app: true,
      check_interval: '5m',
      max_position_size: 100,
      stop_loss_percentage: 5,
      take_profit_percentage: 10
    }
    errors.value = {}
  }

  const setFormData = (data) => {
    formData.value = { ...formData.value, ...data }
  }

  const getFieldError = (field) => {
    return errors.value[field]
  }

  const hasFieldError = (field) => {
    return !!errors.value[field]
  }

  return {
    // 状态
    formData,
    errors,
    loading,
    isEditing,

    // 计算属性
    isValid,
    isSignalBot,
    isTrendFollowingBot,

    // 方法
    validateField,
    validateForm,
    submitForm,
    resetForm,
    setFormData,
    getFieldError,
    hasFieldError
  }
}

