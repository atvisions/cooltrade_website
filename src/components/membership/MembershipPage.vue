<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="membership" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">会员中心</h1>
            <p class="text-gray-600 mt-2">升级会员，解锁更多功能</p>
          </div>

          <!-- 当前会员状态 -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center space-x-3 mb-2">
                  <div class="text-4xl">{{ currentPlan.icon }}</div>
                  <div>
                    <h2 class="text-2xl font-bold">{{ currentPlan.name }}</h2>
                    <p class="text-blue-100">{{ currentPlan.description }}</p>
                  </div>
                </div>
                <div class="mt-4 text-sm text-blue-100">
                  <p v-if="currentPlan.id !== 'free'">到期时间: {{ expiryDate }}</p>
                  <p v-else>升级会员，享受更多权益</p>
                </div>
              </div>
              <div class="text-right">
                <button
                  v-if="currentPlan.id !== 'free'"
                  class="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  续费
                </button>
                <button
                  v-else
                  @click="scrollToPlans"
                  class="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  立即升级
                </button>
              </div>
            </div>
          </div>

          <!-- 会员权益对比 -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">会员权益对比</h2>
            
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">功能</th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">🆓</span>
                        <span>免费版</span>
                      </div>
                    </th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">⭐</span>
                        <span>Pro版</span>
                      </div>
                    </th>
                    <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div class="flex flex-col items-center">
                        <span class="text-2xl mb-1">💎</span>
                        <span>VIP版</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="feature in features" :key="feature.name" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ feature.name }}</td>
                    <td class="px-6 py-4 text-center text-sm text-gray-600">{{ feature.free }}</td>
                    <td class="px-6 py-4 text-center text-sm text-gray-600">{{ feature.pro }}</td>
                    <td class="px-6 py-4 text-center text-sm text-gray-600">{{ feature.vip }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 会员套餐 -->
          <div id="plans">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">选择套餐</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="plan in plans"
                :key="plan.id"
                :class="[
                  'bg-white rounded-2xl border-2 p-8 transition-all duration-200',
                  plan.popular
                    ? 'border-blue-500 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-lg',
                  currentPlan.id === plan.id ? 'ring-2 ring-blue-500' : ''
                ]"
              >
                <!-- 推荐标签 -->
                <div v-if="plan.popular" class="text-center mb-4">
                  <span class="inline-block px-4 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    最受欢迎
                  </span>
                </div>

                <!-- 套餐图标和名称 -->
                <div class="text-center mb-6">
                  <div class="text-5xl mb-3">{{ plan.icon }}</div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
                  <p class="text-gray-600 text-sm">{{ plan.description }}</p>
                </div>

                <!-- 价格 -->
                <div class="text-center mb-6">
                  <div class="flex items-baseline justify-center">
                    <span class="text-gray-500 text-lg">¥</span>
                    <span class="text-5xl font-bold text-gray-900">{{ plan.price }}</span>
                    <span class="text-gray-500 text-lg ml-2">/月</span>
                  </div>
                  <p v-if="plan.yearlyPrice" class="text-sm text-gray-500 mt-2">
                    年付 ¥{{ plan.yearlyPrice }} (省 ¥{{ plan.price * 12 - plan.yearlyPrice }})
                  </p>
                </div>

                <!-- 功能列表 -->
                <ul class="space-y-3 mb-8">
                  <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                    <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-gray-600">{{ feature }}</span>
                  </li>
                </ul>

                <!-- 购买按钮 -->
                <button
                  v-if="currentPlan.id === plan.id"
                  disabled
                  class="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed"
                >
                  当前套餐
                </button>
                <button
                  v-else-if="plan.id === 'free'"
                  disabled
                  class="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-medium cursor-not-allowed"
                >
                  免费使用
                </button>
                <button
                  v-else
                  @click="selectPlan(plan)"
                  :class="[
                    'w-full py-3 rounded-xl font-medium transition-all duration-200',
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  ]"
                >
                  {{ currentPlan.id === 'free' ? '立即升级' : '切换套餐' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 常见问题 -->
          <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">常见问题</h2>
            
            <div class="space-y-4">
              <div
                v-for="faq in faqs"
                :key="faq.question"
                class="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ faq.question }}</h3>
                <p class="text-gray-600">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'

// 当前会员套餐
const currentPlan = ref({
  id: 'free',
  name: '免费版',
  icon: '🆓',
  description: '体验基础功能'
})

// 到期时间
const expiryDate = ref('2024-12-31')

// 功能对比
const features = ref([
  { name: 'AI策略生成', free: '3次/月', pro: '无限次', vip: '无限次' },
  { name: '策略数量', free: '3个', pro: '20个', vip: '无限' },
  { name: '自动交易', free: '✗', pro: '✓', vip: '✓' },
  { name: '策略分享', free: '✗', pro: '✓', vip: '✓' },
  { name: '高级分析', free: '✗', pro: '✓', vip: '✓' },
  { name: '实时信号推送', free: '✗', pro: '✓', vip: '✓' },
  { name: '交易所API绑定', free: '1个', pro: '3个', vip: '无限' },
  { name: '历史数据导出', free: '✗', pro: '✓', vip: '✓' },
  { name: '优先客服支持', free: '✗', pro: '✗', vip: '✓' },
  { name: '专属策略顾问', free: '✗', pro: '✗', vip: '✓' }
])

// 会员套餐
const plans = ref([
  {
    id: 'free',
    name: '免费版',
    icon: '🆓',
    description: '适合新手体验',
    price: 0,
    yearlyPrice: null,
    popular: false,
    features: [
      'AI策略生成 3次/月',
      '最多3个策略',
      '基础数据分析',
      '社区交流'
    ]
  },
  {
    id: 'pro',
    name: 'Pro版',
    icon: '⭐',
    description: '适合专业交易者',
    price: 99,
    yearlyPrice: 999,
    popular: true,
    features: [
      'AI策略生成无限次',
      '最多20个策略',
      '自动交易功能',
      '策略分享收益',
      '高级数据分析',
      '实时信号推送',
      '绑定3个交易所',
      '历史数据导出'
    ]
  },
  {
    id: 'vip',
    name: 'VIP版',
    icon: '💎',
    description: '适合机构和高频交易者',
    price: 299,
    yearlyPrice: 2999,
    popular: false,
    features: [
      'Pro版所有功能',
      '无限策略数量',
      '无限交易所绑定',
      '优先客服支持',
      '专属策略顾问',
      '定制化策略开发',
      'API调用优先级',
      '专属社群'
    ]
  }
])

// 常见问题
const faqs = ref([
  {
    question: '如何升级会员？',
    answer: '选择您想要的套餐，点击"立即升级"按钮，完成支付即可。支持支付宝、微信支付、银行卡等多种支付方式。'
  },
  {
    question: '会员可以随时取消吗？',
    answer: '可以。您可以随时取消会员订阅，取消后会员权益将在当前计费周期结束后失效，不会立即失效。'
  },
  {
    question: '年付和月付有什么区别？',
    answer: '年付相比月付可以节省约17%的费用。例如Pro版月付99元/月，年付999元相当于83元/月。'
  },
  {
    question: '升级后可以降级吗？',
    answer: '可以。您可以在下一个计费周期选择降级到更低的套餐，当前周期的会员权益不受影响。'
  },
  {
    question: '支持退款吗？',
    answer: '我们提供7天无理由退款服务。如果您在购买后7天内对服务不满意，可以申请全额退款。'
  }
])

// 方法
const scrollToPlans = () => {
  document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })
}

const selectPlan = (plan) => {
  console.log('选择套餐:', plan)
  // TODO: 跳转到支付页面
  alert(`即将跳转到支付页面，购买 ${plan.name}`)
}
</script>

