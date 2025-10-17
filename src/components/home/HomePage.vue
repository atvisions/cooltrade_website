<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <Header />

    <!-- Hero Section - 简约白色 -->
    <section class="relative bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div class="text-center">
          <!-- 主标题 -->
          <h1 class="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span class="text-black">智能交易</span>
            <br/>
            <span class="text-gray-400">从这里开始</span>
          </h1>

          <!-- 副标题 -->
          <p class="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            AI 驱动的加密货币量化交易平台
          </p>

          <!-- CTA 按钮 -->
          <div class="flex items-center justify-center space-x-4 mb-20">
            <router-link
              to="/auth"
              class="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
            >
              立即开始
            </router-link>
            <router-link
              to="/market"
              class="px-8 py-4 bg-transparent text-black rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border border-gray-200"
            >
              查看市场
            </router-link>
          </div>

          <!-- 数据展示 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div class="text-center">
              <div class="text-4xl font-bold text-black mb-2">1000+</div>
              <div class="text-sm text-gray-500">活跃策略</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-black mb-2">5000+</div>
              <div class="text-sm text-gray-500">注册用户</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-black mb-2">$10M+</div>
              <div class="text-sm text-gray-500">交易量</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-black mb-2">99.9%</div>
              <div class="text-sm text-gray-500">系统稳定性</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section - 简约白色 -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-black mb-4">核心功能</h2>
          <p class="text-lg text-gray-500">为您提供专业的量化交易工具</p>
        </div>

        <div class="grid md:grid-cols-4 gap-6">
          <!-- Feature 1 -->
          <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-black mb-3">AI 策略生成</h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              基于 AI 的智能策略生成，自动分析市场趋势
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-black mb-3">实时监控</h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              24/7 实时监控交易状态，及时推送重要通知
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-black mb-3">风险管理</h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              完善的风险控制体系，保护您的资产安全
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-black mb-3">高速执行</h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              毫秒级响应速度，确保交易机会不错过
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- News Section - 新闻模块 -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="text-3xl font-bold text-black mb-2">最新动态</h2>
            <p class="text-gray-500">了解加密货币市场最新资讯</p>
          </div>
          <a href="#" class="text-black hover:text-gray-600 font-medium flex items-center transition-colors">
            查看更多
            <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- News 1 -->
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-100"></div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <span>2024-01-15</span>
                <span class="mx-2">·</span>
                <span>市场分析</span>
              </div>
              <h3 class="text-lg font-bold text-black mb-2">比特币突破新高，市场情绪高涨</h3>
              <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                比特币价格突破历史新高，市场交易量激增，投资者情绪持续乐观...
              </p>
              <a href="#" class="text-black hover:text-gray-600 font-medium text-sm transition-colors">
                阅读更多 →
              </a>
            </div>
          </div>

          <!-- News 2 -->
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-100"></div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <span>2024-01-14</span>
                <span class="mx-2">·</span>
                <span>平台更新</span>
              </div>
              <h3 class="text-lg font-bold text-black mb-2">CoolTrade 推出 AI 策略生成器</h3>
              <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                全新 AI 策略生成器上线，帮助用户快速创建个性化交易策略...
              </p>
              <a href="#" class="text-black hover:text-gray-600 font-medium text-sm transition-colors">
                阅读更多 →
              </a>
            </div>
          </div>

          <!-- News 3 -->
          <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div class="h-48 bg-gray-100"></div>
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <span>2024-01-13</span>
                <span class="mx-2">·</span>
                <span>行业动态</span>
              </div>
              <h3 class="text-lg font-bold text-black mb-2">DeFi 市场持续增长，TVL 创新高</h3>
              <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                去中心化金融市场总锁仓量突破新高，生态系统持续繁荣...
              </p>
              <a href="#" class="text-black hover:text-gray-600 font-medium text-sm transition-colors">
                阅读更多 →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section - QA 模块 -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-black mb-2">常见问题</h2>
          <p class="text-gray-500">快速了解 CoolTrade 平台</p>
        </div>

        <div class="space-y-4">
          <!-- FAQ 1 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <button class="w-full flex items-center justify-between text-left" @click="toggleFaq(0)">
              <h3 class="text-lg font-bold text-black">什么是量化交易？</h3>
              <svg class="w-6 h-6 text-gray-400 transition-transform" :class="{ 'rotate-180': openFaq === 0 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-show="openFaq === 0" class="mt-4 text-gray-600 leading-relaxed">
              量化交易是指使用数学模型和计算机程序来执行交易策略的方法。通过分析大量历史数据和市场指标，量化交易系统可以自动识别交易机会并执行交易，减少人为情绪的影响，提高交易效率。
            </div>
          </div>

          <!-- FAQ 2 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <button class="w-full flex items-center justify-between text-left" @click="toggleFaq(1)">
              <h3 class="text-lg font-bold text-black">CoolTrade 如何保证资金安全？</h3>
              <svg class="w-6 h-6 text-gray-400 transition-transform" :class="{ 'rotate-180': openFaq === 1 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-show="openFaq === 1" class="mt-4 text-gray-600 leading-relaxed">
              我们采用多重安全措施保护用户资金：1) API 密钥加密存储；2) 只读权限设置，无法提现；3) 实时风险监控系统；4) 多重身份验证；5) 冷热钱包分离存储。您的资金始终在交易所账户中，我们只提供交易信号和策略执行服务。
            </div>
          </div>

          <!-- FAQ 3 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <button class="w-full flex items-center justify-between text-left" @click="toggleFaq(2)">
              <h3 class="text-lg font-bold text-black">新手如何开始使用？</h3>
              <svg class="w-6 h-6 text-gray-400 transition-transform" :class="{ 'rotate-180': openFaq === 2 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-show="openFaq === 2" class="mt-4 text-gray-600 leading-relaxed">
              开始使用非常简单：1) 注册 CoolTrade 账户；2) 完成风险评估问卷；3) 连接您的交易所 API（推荐使用模拟账户测试）；4) 使用 AI 策略生成器创建您的第一个策略；5) 开启策略并监控表现。我们提供详细的新手指南和 24/7 客服支持。
            </div>
          </div>

          <!-- FAQ 4 -->
          <div class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <button class="w-full flex items-center justify-between text-left" @click="toggleFaq(3)">
              <h3 class="text-lg font-bold text-black">平台收费标准是什么？</h3>
              <svg class="w-6 h-6 text-gray-400 transition-transform" :class="{ 'rotate-180': openFaq === 3 }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-show="openFaq === 3" class="mt-4 text-gray-600 leading-relaxed">
              我们提供灵活的定价方案：免费版可使用基础功能和有限策略；专业版月费 $29，包含所有高级功能和无限策略；企业版提供定制化服务和专属支持。所有套餐均提供 14 天免费试用，无需信用卡。
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-black mb-4">准备开始您的量化交易之旅？</h2>
        <p class="text-xl text-gray-500 mb-8">
          立即注册，免费体验专业的量化交易服务
        </p>
        <router-link
          to="/auth"
          class="inline-block px-12 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
        >
          免费注册
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 text-gray-600 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-black font-bold text-xl mb-4">CoolTrade</h3>
            <p class="text-sm mb-4 text-gray-500">专业的加密货币量化交易平台</p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-black transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-black transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-black transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 class="text-black font-semibold mb-4 text-sm">产品</h4>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/ai-strategy" class="hover:text-black transition-colors">AI 策略生成</router-link></li>
              <li><router-link to="/market" class="hover:text-black transition-colors">市场行情</router-link></li>
              <li><router-link to="/trading" class="hover:text-black transition-colors">交易中心</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="text-black font-semibold mb-4 text-sm">支持</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-black transition-colors">帮助中心</a></li>
              <li><a href="#" class="hover:text-black transition-colors">API 文档</a></li>
              <li><a href="#" class="hover:text-black transition-colors">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-black font-semibold mb-4 text-sm">关于</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-black transition-colors">关于我们</a></li>
              <li><a href="#" class="hover:text-black transition-colors">隐私政策</a></li>
              <li><a href="#" class="hover:text-black transition-colors">服务条款</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-200 pt-8 text-center text-sm">
          <p>&copy; 2024 CoolTrade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../common/Header.vue'

// FAQ 展开状态
const openFaq = ref(null)

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

