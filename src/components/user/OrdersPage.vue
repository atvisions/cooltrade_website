<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="orders" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">我的订单</h1>
          <p class="text-gray-600 mt-2">查看和管理您的订单记录</p>
        </div>

      <!-- 筛选器 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex items-center space-x-4">
          <select class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>全部订单</option>
            <option>待支付</option>
            <option>已完成</option>
            <option>已取消</option>
          </select>
          <input
            type="text"
            placeholder="搜索订单..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">订单 #{{ 10000 + i }}</h3>
                <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  已完成
                </span>
              </div>
              <p class="text-sm text-gray-600">策略订阅 - 高级网格交易策略</p>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-gray-900">$99.00</div>
              <div class="text-sm text-gray-500">2024-01-{{ 20 - i }}</div>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>订单时间: 2024-01-{{ 20 - i }} 14:30</span>
              <span>支付方式: 信用卡</span>
            </div>
            <div class="flex items-center space-x-3">
              <button class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">查看详情</button>
              <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                下载发票
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="false" class="text-center py-16">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无订单</h3>
        <p class="text-gray-600 mb-6">您还没有任何订单记录</p>
        <router-link
          to="/strategies"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          去购买策略
        </router-link>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
</script>

