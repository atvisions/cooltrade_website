<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="points" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">我的积分</h1>
            <p class="text-gray-600 mt-2">管理积分、查看邀请记录</p>
          </div>

          <div class="space-y-6">
    <!-- 积分概览 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">积分概览</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
          <div class="text-4xl font-bold text-orange-600 mb-2">{{ userPoints }}</div>
          <div class="text-sm text-gray-600">当前积分</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div class="text-4xl font-bold text-green-600 mb-2">+{{ totalEarned }}</div>
          <div class="text-sm text-gray-600">累计获得</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
          <div class="text-4xl font-bold text-red-600 mb-2">-{{ totalSpent }}</div>
          <div class="text-sm text-gray-600">累计消费</div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 class="text-sm font-semibold text-blue-900 mb-2">💡 如何获得积分？</h4>
        <ul class="space-y-2 text-sm text-blue-800">
          <li>• 注册账户：+100 积分</li>
          <li>• 邀请好友：+{{ invitationPoints }} 积分/人</li>
          <li>• 完成每日任务：+10-50 积分</li>
          <li>• 分享策略被订阅：+20 积分/次</li>
        </ul>
      </div>
    </div>

    <!-- 邀请好友 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">邀请好友</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ invitationCount }}</div>
          <div class="text-sm text-gray-600 mb-4">已邀请好友</div>
          <div class="text-xs text-gray-500">
            每邀请1人注册可获得 {{ invitationPoints }} 积分
          </div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ invitationCount * invitationPoints }}</div>
          <div class="text-sm text-gray-600 mb-4">邀请获得积分</div>
          <div class="text-xs text-gray-500">
            通过邀请好友累计获得的积分
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-gray-50 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700">我的邀请码</label>
            <button
              @click="copyInvitationCode"
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              复制
            </button>
          </div>
          <code class="block px-4 py-3 bg-white rounded-lg text-xl font-mono font-bold text-gray-900 text-center border-2 border-dashed border-gray-300">
            {{ invitationCode || '加载中...' }}
          </code>
        </div>

        <div class="bg-gray-50 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700">邀请链接</label>
            <button
              @click="copyInvitationLink"
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              复制链接
            </button>
          </div>
          <div class="px-4 py-3 bg-white rounded-lg text-sm text-gray-700 break-all border border-gray-200">
            {{ invitationLink }}
          </div>
        </div>
      </div>
    </div>

    <!-- 邀请记录 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">邀请记录</h3>
      
      <div v-if="invitationRecords.length > 0" class="overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">被邀请人</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">获得积分</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="record in invitationRecords" :key="record.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">{{ record.invitee_username || record.invitee_email }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(record.created_at) }}</td>
              <td class="px-4 py-3 text-sm text-right">
                <span class="text-green-600 font-medium">+{{ invitationPoints }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-2">👥</div>
        <p>还没有邀请记录</p>
        <p class="text-sm mt-1">分享您的邀请码给好友，赚取积分奖励</p>
      </div>
    </div>

    <!-- 积分交易记录 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">积分交易记录</h3>
        <div class="flex items-center space-x-2">
          <button
            v-for="filter in transactionFilters"
            :key="filter.id"
            @click="activeTransactionFilter = filter.id"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
              activeTransactionFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ filter.name }}
          </button>
        </div>
      </div>

      <div v-if="filteredTransactions.length > 0" class="overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">说明</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">积分变动</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(transaction.created_at) }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  transaction.transaction_type === 'earn' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ transaction.transaction_type === 'earn' ? '获得' : '消费' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ transaction.description }}</td>
              <td class="px-4 py-3 text-sm text-right">
                <span :class="[
                  'font-medium',
                  transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ transaction.transaction_type === 'earn' ? '+' : '-' }}{{ transaction.amount }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-2">📊</div>
        <p>暂无交易记录</p>
      </div>
    </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import { apiRequest, API_ENDPOINTS } from '../../utils/api.js'
import notification from '../../utils/notification.js'

// 积分数据
const userPoints = ref(0)
const totalEarned = ref(0)
const totalSpent = ref(0)
const invitationPoints = ref(50)

// 邀请数据
const invitationCode = ref('')
const invitationCount = ref(0)
const invitationLink = ref('')
const invitationRecords = ref([])

// 交易记录
const transactions = ref([])
const activeTransactionFilter = ref('all')
const transactionFilters = ref([
  { id: 'all', name: '全部' },
  { id: 'earn', name: '获得' },
  { id: 'spend', name: '消费' }
])

// 过滤交易记录
const filteredTransactions = computed(() => {
  if (activeTransactionFilter.value === 'all') {
    return transactions.value
  }
  return transactions.value.filter(t => t.transaction_type === activeTransactionFilter.value)
})

// 加载邀请信息
const loadInvitationInfo = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.INVITATION_INFO, {
      method: 'GET'
    })

    if (response.status === 'success') {
      userPoints.value = response.data.points
      invitationCode.value = response.data.invitation_code
      invitationCount.value = response.data.invitation_count
      invitationPoints.value = response.data.invitation_points_per_user
      invitationRecords.value = response.data.invitation_records || []
      
      // 生成邀请链接
      const baseUrl = window.location.origin
      invitationLink.value = `${baseUrl}/register?code=${response.data.invitation_code}`
    }
  } catch (error) {
    console.error('加载邀请信息失败:', error)
    notification.error('加载邀请信息失败')
  }
}

// 加载积分交易记录
const loadTransactions = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.POINTS_TRANSACTIONS, {
      method: 'GET'
    })

    if (response.status === 'success') {
      transactions.value = response.data.transactions || []
      
      // 计算累计获得和消费
      totalEarned.value = transactions.value
        .filter(t => t.transaction_type === 'earn')
        .reduce((sum, t) => sum + t.amount, 0)
      
      totalSpent.value = transactions.value
        .filter(t => t.transaction_type === 'spend')
        .reduce((sum, t) => sum + t.amount, 0)
    }
  } catch (error) {
    console.error('加载积分交易记录失败:', error)
  }
}

// 复制邀请码
const copyInvitationCode = async () => {
  try {
    await navigator.clipboard.writeText(invitationCode.value)
    notification.success('邀请码已复制到剪贴板')
  } catch (error) {
    notification.error('复制失败，请手动复制')
  }
}

// 复制邀请链接
const copyInvitationLink = async () => {
  try {
    await navigator.clipboard.writeText(invitationLink.value)
    notification.success('邀请链接已复制到剪贴板')
  } catch (error) {
    notification.error('复制失败，请手动复制')
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 页面加载时获取数据
onMounted(() => {
  loadInvitationInfo()
  loadTransactions()
})
</script>

