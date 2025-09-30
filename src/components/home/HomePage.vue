<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            智能交易，从
            <span class="text-blue-600">
              CoolTrade
            </span>
            开始
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            专业的加密货币量化交易平台，提供智能策略、实时监控、风险管理等全方位服务
          </p>
          <div class="flex items-center justify-center space-x-4">
            <router-link
              to="/auth"
              class="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              立即开始
            </router-link>
            <router-link
              to="/explore"
              class="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-semibold text-lg border border-gray-200"
            >
              探索策略
            </router-link>
          </div>
        </div>

        <!-- Hero Image/Animation -->
        <div class="mt-16 relative">
          <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div class="grid grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div class="text-4xl mb-2">📈</div>
                <div class="text-2xl font-bold text-blue-900">1000+</div>
                <div class="text-sm text-blue-700">活跃策略</div>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div class="text-4xl mb-2">👥</div>
                <div class="text-2xl font-bold text-purple-900">5000+</div>
                <div class="text-sm text-purple-700">注册用户</div>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div class="text-4xl mb-2">💰</div>
                <div class="text-2xl font-bold text-green-900">$10M+</div>
                <div class="text-sm text-green-700">交易量</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">核心功能</h2>
          <p class="text-xl text-gray-600">为您提供专业的量化交易工具</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">智能策略</h3>
            <p class="text-gray-600 mb-4">
              基于AI和机器学习的智能交易策略，自动分析市场趋势，优化交易决策
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                多种策略模板
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                自定义参数
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                回测验证
              </li>
            </ul>
          </div>

          <!-- Feature 2 -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200 hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">实时监控</h3>
            <p class="text-gray-600 mb-4">
              24/7实时监控交易状态，及时推送重要通知，让您随时掌握市场动态
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                实时行情
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                智能预警
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                多端同步
              </li>
            </ul>
          </div>

          <!-- Feature 3 -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">风险管理</h3>
            <p class="text-gray-600 mb-4">
              完善的风险控制体系，保护您的资产安全，让交易更加稳健
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                止损止盈
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                仓位控制
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                风险评估
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div class="text-5xl font-bold mb-2">99.9%</div>
            <div class="text-blue-100">系统稳定性</div>
          </div>
          <div>
            <div class="text-5xl font-bold mb-2">24/7</div>
            <div class="text-blue-100">全天候服务</div>
          </div>
          <div>
            <div class="text-5xl font-bold mb-2">&lt;100ms</div>
            <div class="text-blue-100">响应时间</div>
          </div>
          <div>
            <div class="text-5xl font-bold mb-2">100+</div>
            <div class="text-blue-100">支持交易对</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">准备开始您的量化交易之旅？</h2>
        <p class="text-xl text-gray-600 mb-8">
          立即注册，免费体验专业的量化交易服务
        </p>
        <router-link
          to="/auth"
          class="inline-block px-12 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
        >
          免费注册
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-4">CoolTrade</h3>
            <p class="text-sm">专业的加密货币量化交易平台</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">产品</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white">交易策略</a></li>
              <li><a href="#" class="hover:text-white">实时监控</a></li>
              <li><a href="#" class="hover:text-white">风险管理</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">支持</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white">帮助中心</a></li>
              <li><a href="#" class="hover:text-white">API文档</a></li>
              <li><a href="#" class="hover:text-white">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">关于</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white">关于我们</a></li>
              <li><a href="#" class="hover:text-white">隐私政策</a></li>
              <li><a href="#" class="hover:text-white">服务条款</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 CoolTrade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Header from '../common/Header.vue'
</script>

