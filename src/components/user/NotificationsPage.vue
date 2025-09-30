<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="notifications" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">通知中心</h1>
              <p class="text-gray-600 mt-2">查看您的所有通知消息</p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="markAllAsRead"
                class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                全部标记为已读
              </button>
              <button
                @click="clearAll"
                class="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                清空所有
              </button>
            </div>
          </div>

          <!-- 筛选器 -->
          <div class="mb-6">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="filter in filters"
                  :key="filter.id"
                  @click="activeFilter = filter.id"
                  :class="[
                    'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeFilter === filter.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <component :is="filter.icon" class="w-4 h-4" />
                  <span>{{ filter.name }}</span>
                  <span
                    v-if="filter.count > 0"
                    :class="[
                      'ml-2 px-2 py-0.5 text-xs rounded-full',
                      activeFilter === filter.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    ]"
                  >
                    {{ filter.count }}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          <!-- 通知列表 -->
          <div v-if="filteredNotifications.length > 0" class="space-y-3">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              :class="[
                'rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 cursor-pointer',
                notification.read
                  ? 'bg-white border border-gray-200'
                  : 'bg-blue-50 border-l-4 border-blue-600'
              ]"
              @click="viewNotification(notification)"
            >
              <div class="flex items-start space-x-4">
                <!-- 图标 -->
                <div
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    getNotificationIconClass(notification.type)
                  ]"
                >
                  <component :is="getNotificationIcon(notification.type)" class="w-6 h-6" />
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ notification.title }}</h3>
                      <span
                        v-if="!notification.read"
                        class="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full"
                      >
                        新
                      </span>
                    </div>
                    <span class="text-sm text-gray-500 whitespace-nowrap ml-4">{{ notification.time }}</span>
                  </div>
                  <p :class="['mb-3', notification.read ? 'text-gray-600' : 'text-gray-700']">
                    {{ notification.message }}
                  </p>
                  <div class="flex items-center space-x-3">
                    <button
                      @click.stop="viewNotification(notification)"
                      class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      查看详情
                    </button>
                    <button
                      v-if="!notification.read"
                      @click.stop="markAsRead(notification.id)"
                      class="text-sm text-gray-600 hover:text-gray-700 transition-colors"
                    >
                      标记为已读
                    </button>
                    <button
                      @click.stop="deleteNotification(notification.id)"
                      class="text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div class="text-6xl mb-4">🔔</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无通知</h3>
            <p class="text-gray-600">{{ getEmptyStateMessage() }}</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import {
  BellIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// 筛选器
const activeFilter = ref('all')
const filters = ref([
  { id: 'all', name: '全部', icon: BellIcon, count: 0 },
  { id: 'unread', name: '未读', icon: BellIcon, count: 0 },
  { id: 'trade', name: '交易提醒', icon: ChartBarIcon, count: 0 },
  { id: 'system', name: '系统消息', icon: InformationCircleIcon, count: 0 },
  { id: 'warning', name: '风险警告', icon: ExclamationTriangleIcon, count: 0 }
])

// 通知数据（模拟）
const notifications = ref([
  {
    id: 1,
    type: 'trade',
    title: '交易提醒',
    message: '您的策略"ETH网格交易"触发了买入信号，已自动执行交易，买入价格 $2,680.50',
    time: '2分钟前',
    read: false
  },
  {
    id: 2,
    type: 'trade',
    title: '交易提醒',
    message: '您的策略"BNB DCA策略"已完成定投，本次买入 0.5 BNB，均价 $635.80',
    time: '15分钟前',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: '风险警告',
    message: '您的 OP/USDT 持仓接近止损价格，当前价格 $1.26，止损价格 $1.20',
    time: '30分钟前',
    read: false
  },
  {
    id: 4,
    type: 'system',
    title: '系统消息',
    message: '系统将于今晚23:00进行例行维护，预计持续30分钟，期间可能无法交易',
    time: '1小时前',
    read: true
  },
  {
    id: 5,
    type: 'trade',
    title: '交易提醒',
    message: '您的策略"AVAX套利策略"已平仓，盈利 $340.00 (+2.8%)',
    time: '2小时前',
    read: true
  },
  {
    id: 6,
    type: 'system',
    title: '会员到期提醒',
    message: '您的 Pro 会员将于 7 天后到期，请及时续费以继续享受会员权益',
    time: '3小时前',
    read: true
  },
  {
    id: 7,
    type: 'success',
    title: '策略分享收益',
    message: '您分享的策略"ETH网格交易"本周被 12 人订阅，获得收益 $120.00',
    time: '5小时前',
    read: true
  },
  {
    id: 8,
    type: 'system',
    title: '安全提醒',
    message: '检测到您的账户在新设备登录，如非本人操作，请立即修改密码',
    time: '1天前',
    read: true
  }
])

// 计算筛选后的通知
const filteredNotifications = computed(() => {
  let result = notifications.value

  if (activeFilter.value === 'unread') {
    result = result.filter(n => !n.read)
  } else if (activeFilter.value !== 'all') {
    result = result.filter(n => n.type === activeFilter.value)
  }

  return result
})

// 更新筛选器计数
const updateFilterCounts = () => {
  filters.value[0].count = notifications.value.length
  filters.value[1].count = notifications.value.filter(n => !n.read).length
  filters.value[2].count = notifications.value.filter(n => n.type === 'trade').length
  filters.value[3].count = notifications.value.filter(n => n.type === 'system').length
  filters.value[4].count = notifications.value.filter(n => n.type === 'warning').length
}

// 初始化计数
updateFilterCounts()

// 获取通知图标
const getNotificationIcon = (type) => {
  const icons = {
    trade: ChartBarIcon,
    system: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
    success: CheckCircleIcon
  }
  return icons[type] || BellIcon
}

// 获取通知图标样式
const getNotificationIconClass = (type) => {
  const classes = {
    trade: 'bg-blue-600 text-white',
    system: 'bg-gray-600 text-white',
    warning: 'bg-orange-600 text-white',
    success: 'bg-green-600 text-white'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

// 查看通知详情
const viewNotification = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  console.log('查看通知:', notification)
  // TODO: 跳转到详情页面或显示详情弹窗
}

// 标记为已读
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
    updateFilterCounts()
  }
}

// 全部标记为已读
const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
  updateFilterCounts()
}

// 删除通知
const deleteNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
    updateFilterCounts()
  }
}

// 清空所有通知
const clearAll = () => {
  if (confirm('确定要清空所有通知吗？')) {
    notifications.value = []
    updateFilterCounts()
  }
}

// 获取空状态消息
const getEmptyStateMessage = () => {
  if (activeFilter.value === 'unread') {
    return '您目前没有未读通知'
  } else if (activeFilter.value === 'trade') {
    return '您目前没有交易提醒'
  } else if (activeFilter.value === 'system') {
    return '您目前没有系统消息'
  } else if (activeFilter.value === 'warning') {
    return '您目前没有风险警告'
  }
  return '您目前没有任何通知消息'
}
</script>

