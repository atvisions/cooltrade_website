<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <!-- 页面标题区域 -->
    <div class="max-w-7xl mx-auto pt-20 pb-6 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">社区广场</h1>
          <p class="text-gray-600 mt-1">发现优秀交易者，学习交易策略，分享交易心得</p>
        </div>
        <button
          @click="createContent"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          发布内容
        </button>
      </div>

      <!-- Tab 切换 - 现代简约风格 -->
      <div class="flex gap-1 bg-white p-1 rounded-lg inline-flex shadow-sm border border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-all text-sm',
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 全部内容视图 -->
      <div v-if="activeTab === 'all'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧主内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 热门用户卡片 -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                热门交易者
              </h2>
              <button @click="activeTab = 'users'" class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                查看全部
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="user in topUsers.slice(0, 4)" :key="user.id"
                   class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 truncate">{{ user.username }}</div>
                  <div class="text-xs text-green-600 font-medium">+{{ user.profit_rate }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最新文章 -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                最新文章
              </h2>
              <button @click="activeTab = 'articles'" class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                查看全部
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="article in recentArticles.slice(0, 3)" :key="article.id"
                   class="flex gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ article.title }}</h3>
                  <p class="text-sm text-gray-500 line-clamp-2 mb-2">{{ article.excerpt }}</p>
                  <div class="flex items-center gap-3 text-xs text-gray-400">
                    <span>{{ article.author }}</span>
                    <span>•</span>
                    <span>{{ article.views }} 阅读</span>
                    <span>•</span>
                    <span>{{ article.likes }} 点赞</span>
                  </div>
                </div>
                <div v-if="article.cover" class="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img :src="article.cover" class="w-full h-full object-cover" alt="封面" />
                </div>
              </div>
            </div>
          </div>

          <!-- 热门策略 -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                热门策略
              </h2>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="strategy in topStrategies.slice(0, 3)" :key="strategy.id"
                   class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                   @click="viewStrategy(strategy)">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {{ strategy.user?.username?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ strategy.name }}</div>
                      <div class="text-xs text-gray-500">{{ strategy.user?.username }}</div>
                    </div>
                  </div>
                  <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    {{ strategy.bot_type === 'signal' ? '信号' : '趋势' }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <span class="text-gray-600">收益: <span class="text-green-600 font-semibold">+{{ strategy.profit_rate }}%</span></span>
                  <span class="text-gray-400">•</span>
                  <span class="text-gray-600">{{ strategy.copy_count }} 人复制</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 统计数据 -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              社区数据
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span class="text-sm text-gray-600">活跃用户</span>
                <span class="text-xl font-bold text-blue-600">{{ stats.active_users || 0 }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span class="text-sm text-gray-600">分享策略</span>
                <span class="text-xl font-bold text-green-600">{{ stats.total_strategies || 0 }}</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span class="text-sm text-gray-600">社区文章</span>
                <span class="text-xl font-bold text-purple-600">{{ stats.total_articles || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- 热门标签 -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              热门标签
            </h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="tag in popularTags" :key="tag.name"
                      @click="filterByTag(tag.name)"
                      class="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                {{ tag.name }} <span class="text-gray-400 ml-1">{{ tag.count }}</span>
              </button>
            </div>
          </div>

          <!-- 分类导航 -->
          <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              策略分类
            </h3>
            <div class="space-y-2">
              <button v-for="category in categories" :key="category.id"
                      @click="filterByCategory(category.id)"
                      class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-left border border-transparent">
                <div class="flex items-center gap-3">
                  <span class="text-xl">{{ category.icon }}</span>
                  <span class="font-medium text-gray-900">{{ category.name }}</span>
                </div>
                <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ category.count }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户排行榜视图 -->
      <div v-else-if="activeTab === 'users'">
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h2 class="text-xl font-bold text-gray-900">用户排行榜</h2>
            </div>
            <p class="text-sm text-gray-600 mt-1">根据收益率和策略分享数量排名</p>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(user, index) in topUsers" :key="user.id"
                 class="p-6 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-4">
              <!-- 排名 -->
              <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span v-if="index < 3" class="text-3xl">{{ ['🥇', '🥈', '🥉'][index] }}</span>
                <span v-else class="text-lg font-bold text-gray-400">{{ index + 1 }}</span>
              </div>
              <!-- 用户信息 -->
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 text-lg">{{ user.username }}</div>
                <div class="text-sm text-gray-500">分享了 {{ user.strategy_count }} 个策略</div>
              </div>
              <!-- 收益率 -->
              <div class="text-right">
                <div class="text-2xl font-bold text-green-600">+{{ user.profit_rate }}%</div>
                <div class="text-xs text-gray-500">总收益率</div>
              </div>
              <!-- 关注按钮 -->
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                关注
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章列表视图 -->
      <div v-else-if="activeTab === 'articles'">
        <div class="mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-xl font-bold text-gray-900">社区文章</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="article in articles" :key="article.id"
               class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg cursor-pointer transition-all group">
            <!-- 封面图 -->
            <div class="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
              <img v-if="article.cover" :src="article.cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="封面" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <!-- 内容 -->
            <div class="p-5">
              <h3 class="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {{ article.title }}
              </h3>
              <p class="text-sm text-gray-500 line-clamp-3 mb-4">{{ article.excerpt }}</p>
              <!-- 作者和数据 -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {{ article.author.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ article.author }}</span>
                </div>
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ article.views }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {{ article.likes }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 信号机器人视图 -->
      <div v-else-if="activeTab === 'signal'">
        <div class="mb-6 flex items-center gap-4">
          <div class="flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 class="text-xl font-bold text-gray-900">信号机器人</h2>
          </div>
          <div class="flex gap-2">
            <button v-for="type in signalTypes" :key="type.id"
                    @click="selectedSignalType = type.id"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      selectedSignalType === type.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                    ]">
              {{ type.label }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="strategy in signalStrategies" :key="strategy.id"
               class="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6"
               @click="viewStrategy(strategy)">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                {{ strategy.user?.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 truncate">{{ strategy.name }}</div>
                <div class="text-xs text-gray-500">{{ strategy.user?.username }}</div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">收益率</span>
                <span class="font-semibold text-green-600">+{{ strategy.profit_rate }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">复制数</span>
                <span class="font-semibold text-gray-900">{{ strategy.copy_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势机器人视图 -->
      <div v-else-if="activeTab === 'trend'">
        <div class="mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <h2 class="text-xl font-bold text-gray-900">趋势跟踪机器人</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="strategy in trendStrategies" :key="strategy.id"
               class="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6"
               @click="viewStrategy(strategy)">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                {{ strategy.user?.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 truncate">{{ strategy.name }}</div>
                <div class="text-xs text-gray-500">{{ strategy.user?.username }}</div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">收益率</span>
                <span class="font-semibold text-green-600">+{{ strategy.profit_rate }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">复制数</span>
                <span class="font-semibold text-gray-900">{{ strategy.copy_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../common/Header.vue'

// 状态
const activeTab = ref('all')
const selectedSignalType = ref('all')

// Tabs配置
const tabs = [
  { id: 'all', label: '全部' },
  { id: 'users', label: '用户' },
  { id: 'articles', label: '文章' },
  { id: 'signal', label: '信号机器人' },
  { id: 'trend', label: '趋势机器人' }
]

// 信号类型
const signalTypes = [
  { id: 'all', label: '全部' },
  { id: 'breakout', label: '突破' },
  { id: 'reversal', label: '反转' },
  { id: 'trend', label: '趋势' },
  { id: 'volume', label: '成交量' }
]

// 模拟数据
const stats = ref({
  active_users: 1234,
  total_strategies: 567,
  total_articles: 89
})

const topUsers = ref([
  { id: 1, username: 'CryptoMaster', profit_rate: 156.8, strategy_count: 12 },
  { id: 2, username: 'TradeKing', profit_rate: 142.3, strategy_count: 8 },
  { id: 3, username: 'BullRunner', profit_rate: 128.5, strategy_count: 15 },
  { id: 4, username: 'MoonShot', profit_rate: 115.2, strategy_count: 6 },
  { id: 5, username: 'DiamondHands', profit_rate: 98.7, strategy_count: 10 },
  { id: 6, username: 'SmartTrader', profit_rate: 87.3, strategy_count: 7 }
])

const recentArticles = ref([
  { id: 1, title: '如何在震荡市场中稳定盈利', excerpt: '分享我在过去3个月震荡行情中的交易心得...', author: 'CryptoMaster', views: 1234, likes: 89, cover: null },
  { id: 2, title: '趋势跟踪策略完全指南', excerpt: '详细讲解趋势跟踪的核心原理和实战技巧...', author: 'TradeKing', views: 987, likes: 67, cover: null },
  { id: 3, title: '风险管理的10个黄金法则', excerpt: '保护本金是交易的第一要务，这里是我的经验...', author: 'BullRunner', views: 756, likes: 54, cover: null }
])

const articles = ref([
  { id: 1, title: '如何在震荡市场中稳定盈利', excerpt: '分享我在过去3个月震荡行情中的交易心得，包括仓位管理、止损设置等关键技巧...', author: 'CryptoMaster', views: 1234, likes: 89, cover: null },
  { id: 2, title: '趋势跟踪策略完全指南', excerpt: '详细讲解趋势跟踪的核心原理和实战技巧，从入场到出场的完整流程...', author: 'TradeKing', views: 987, likes: 67, cover: null },
  { id: 3, title: '风险管理的10个黄金法则', excerpt: '保护本金是交易的第一要务，这里是我总结的10条风险管理经验...', author: 'BullRunner', views: 756, likes: 54, cover: null },
  { id: 4, title: 'BTC突破策略实战分享', excerpt: '最近用突破策略在BTC上获得了不错的收益，分享一下我的交易思路...', author: 'MoonShot', views: 654, likes: 43, cover: null },
  { id: 5, title: '如何识别假突破', excerpt: '假突破是交易中最常见的陷阱，教你几招识别方法...', author: 'DiamondHands', views: 543, likes: 38, cover: null },
  { id: 6, title: '量化交易入门指南', excerpt: '从零开始学习量化交易，包括策略开发、回测、实盘等全流程...', author: 'SmartTrader', views: 432, likes: 29, cover: null }
])

const topStrategies = ref([
  { id: 1, name: 'BTC突破策略', user: { username: 'CryptoMaster' }, bot_type: 'signal', profit_rate: 45.6, copy_count: 234 },
  { id: 2, name: 'ETH趋势跟踪', user: { username: 'TradeKing' }, bot_type: 'trend', profit_rate: 38.2, copy_count: 189 },
  { id: 3, name: '主流币反转信号', user: { username: 'BullRunner' }, bot_type: 'signal', profit_rate: 32.8, copy_count: 156 }
])

const signalStrategies = ref([
  { id: 1, name: 'BTC突破策略', user: { username: 'CryptoMaster' }, profit_rate: 45.6, copy_count: 234 },
  { id: 2, name: 'ETH反转信号', user: { username: 'TradeKing' }, profit_rate: 38.2, copy_count: 189 },
  { id: 3, name: '主流币突破', user: { username: 'BullRunner' }, profit_rate: 32.8, copy_count: 156 }
])

const trendStrategies = ref([
  { id: 1, name: 'BTC趋势跟踪', user: { username: 'CryptoMaster' }, profit_rate: 52.3, copy_count: 278 },
  { id: 2, name: 'ETH长线持仓', user: { username: 'TradeKing' }, profit_rate: 41.7, copy_count: 203 },
  { id: 3, name: '主流币趋势', user: { username: 'BullRunner' }, profit_rate: 35.9, copy_count: 167 }
])

const popularTags = ref([
  { name: 'BTC', count: 234 },
  { name: 'ETH', count: 189 },
  { name: '突破', count: 156 },
  { name: '趋势', count: 134 },
  { name: '短线', count: 98 },
  { name: '波段', count: 87 },
  { name: '反转', count: 76 }
])

const categories = ref([
  { id: 'breakout', name: '突破策略', icon: '🚀', count: 156 },
  { id: 'trend', name: '趋势跟踪', icon: '📈', count: 134 },
  { id: 'reversal', name: '反转策略', icon: '🔄', count: 98 },
  { id: 'scalping', name: '超短线', icon: '⚡', count: 76 },
  { id: 'swing', name: '波段交易', icon: '🌊', count: 65 }
])

// 方法
const createContent = () => {
  // TODO: 打开创建内容对话框
  console.log('创建内容')
}

const viewStrategy = (strategy) => {
  // TODO: 实现策略详情页
  console.log('查看策略详情:', strategy)
}

const filterByTag = (tag) => {
  console.log('Filter by tag:', tag)
}

const filterByCategory = (categoryId) => {
  console.log('Filter by category:', categoryId)
}

onMounted(() => {
  // TODO: 加载真实数据
})
</script>


