<template>
  <div class="space-y-6">
    <!-- 标签页切换 -->
    <div class="flex gap-2 mb-6 border-b border-slate-200">
      <button
        @click="activeTab = 'new'"
        :class="[
          'px-6 py-3 font-medium text-sm transition-all duration-300 relative',
          activeTab === 'new'
            ? 'text-slate-900'
            : 'text-slate-500 hover:text-slate-700'
        ]"
      >
        <span>新建回测</span>
        <div
          v-if="activeTab === 'new'"
          class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t"
        ></div>
      </button>
      <button
        @click="activeTab = 'history'"
        :class="[
          'px-6 py-3 font-medium text-sm transition-all duration-300 relative',
          activeTab === 'history'
            ? 'text-slate-900'
            : 'text-slate-500 hover:text-slate-700'
        ]"
      >
        <span>历史回测</span>
        <div
          v-if="activeTab === 'history'"
          class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t"
        ></div>
      </button>
    </div>

    <!-- 新建回测 TAB -->
    <div v-if="activeTab === 'new'">
    <!-- 回测配置卡片 -->
    <div class="bg-white rounded-xl p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        回测配置
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 机器人选择 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">选择机器人 *</label>
          <select
            v-model="config.bot_id"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">请选择机器人</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.name }} ({{ bot.token_symbol }})
            </option>
          </select>
        </div>

        <!-- 时间范围 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">回测时间范围 *</label>
          <select
            v-model="config.time_range"
            @change="updateDateRange"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="180d">最近180天</option>
            <option value="1y">最近1年</option>
            <option value="custom">自定义</option>
          </select>
        </div>

        <!-- 自定义开始日期 -->
        <div v-if="config.time_range === 'custom'">
          <label class="block text-sm font-medium text-slate-700 mb-2">开始日期 *</label>
          <input
            type="date"
            v-model="config.start_date"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- 自定义结束日期 -->
        <div v-if="config.time_range === 'custom'">
          <label class="block text-sm font-medium text-slate-700 mb-2">结束日期 *</label>
          <input
            type="date"
            v-model="config.end_date"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- 初始资金 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">初始资金 (USDT) *</label>
          <input
            type="number"
            v-model.number="config.initial_capital"
            min="100"
            step="100"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="10000"
            required
          />
        </div>

        <!-- 时间周期 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">时间周期 *</label>
          <select
            v-model="config.timeframe"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="1m">1分钟</option>
            <option value="5m">5分钟</option>
            <option value="15m">15分钟</option>
            <option value="1h">1小时</option>
            <option value="4h">4小时</option>
            <option value="1d">1天</option>
          </select>
        </div>

        <!-- 退出策略 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">退出策略 *</label>
          <select
            v-model="config.exit_strategy"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="fixed">固定止盈止损</option>
            <option value="time">时间限制</option>
            <option value="signal">反向信号</option>
          </select>
        </div>

        <!-- 止盈百分比 -->
        <div v-if="config.exit_strategy === 'fixed'">
          <label class="block text-sm font-medium text-slate-700 mb-2">止盈 (%)</label>
          <input
            type="number"
            v-model.number="config.take_profit_pct"
            min="0.1"
            max="100"
            step="0.1"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="5.0"
          />
        </div>

        <!-- 止损百分比 -->
        <div v-if="config.exit_strategy === 'fixed'">
          <label class="block text-sm font-medium text-slate-700 mb-2">止损 (%)</label>
          <input
            type="number"
            v-model.number="config.stop_loss_pct"
            min="0.1"
            max="100"
            step="0.1"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2.0"
          />
        </div>

        <!-- 最大持仓时间 -->
        <div v-if="config.exit_strategy === 'time'">
          <label class="block text-sm font-medium text-slate-700 mb-2">最大持仓时间 (小时)</label>
          <input
            type="number"
            v-model.number="config.max_holding_hours"
            min="1"
            max="720"
            step="1"
            class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="24"
          />
        </div>
      </div>

      <!-- 开始回测按钮 -->
      <div class="mt-6 flex gap-3">
        <button
          @click="startBacktest"
          :disabled="running || !config.bot_id"
          class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg v-if="!running" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div v-else class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          {{ running ? '回测中...' : '开始回测' }}
        </button>
        <button
          v-if="result"
          @click="clearResult"
          class="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
        >
          清除结果
        </button>
      </div>
    </div>

    <!-- 回测进度 -->
    <div v-if="running" class="bg-white rounded-xl p-6 border border-slate-200">
      <div class="flex items-center gap-4 mb-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div>
          <h3 class="text-lg font-semibold text-slate-900">正在回测...</h3>
          <p class="text-sm text-slate-600">请稍候，这可能需要几分钟时间</p>
        </div>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="text-sm text-slate-600 mt-2 text-center">{{ progress }}%</p>
    </div>

    <!-- 回测结果 -->
    <div v-if="result && !running" class="space-y-6">
      <!-- 指标类型切换 -->
      <div class="flex items-center gap-4 mb-4">
        <button
          @click="metricType = 'quality'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            metricType === 'quality'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          ✨ 信号质量指标
        </button>
        <button
          @click="metricType = 'trading'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            metricType === 'trading'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          💰 交易收益指标
        </button>
      </div>

      <!-- 说明文字 -->
      <div v-if="metricType === 'quality'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">💡 适用于纯通知型信号机器人</p>
            <p>这些指标评估信号本身的质量（准确率、假信号率等），而不是假设执行所有信号的收益。</p>
          </div>
        </div>
      </div>
      <div v-else class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="text-sm text-amber-800">
            <p class="font-medium mb-1">⚠️ 仅供参考</p>
            <p>这些指标假设每个信号都立即执行交易，使用固定止盈止损。实际收益取决于您的交易决策。</p>
          </div>
        </div>
      </div>

      <!-- 信号质量指标卡片 -->
      <div v-if="metricType === 'quality'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">信号准确率</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ (result.signal_accuracy || 0).toFixed(1) }}%</p>
          <p class="text-sm opacity-90 mt-1">价格按预期方向移动</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">假信号率</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ (result.false_signal_rate || 0).toFixed(1) }}%</p>
          <p class="text-sm opacity-90 mt-1">价格立即反向</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">平均信号间隔</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ (result.avg_signal_interval_hours || 0).toFixed(1) }}h</p>
          <p class="text-sm opacity-90 mt-1">信号频率</p>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">质量评分</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ result.signal_quality_score || 0 }}/100</p>
          <p class="text-sm opacity-90 mt-1">综合评分</p>
        </div>
      </div>

      <!-- 交易收益指标卡片 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">总收益</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">${{ result.total_profit.toFixed(2) }}</p>
          <p class="text-sm opacity-90 mt-1">{{ result.profit_rate.toFixed(2) }}%</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">胜率</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ result.win_rate.toFixed(1) }}%</p>
          <p class="text-sm opacity-90 mt-1">{{ result.winning_trades }}/{{ result.total_trades }} 笔</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">夏普比率</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ result.sharpe_ratio.toFixed(2) }}</p>
          <p class="text-sm opacity-90 mt-1">风险调整收益</p>
        </div>

        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">最大回撤</span>
            <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <p class="text-3xl font-bold">{{ result.max_drawdown.toFixed(2) }}%</p>
          <p class="text-sm opacity-90 mt-1">风险指标</p>
        </div>
      </div>

      <!-- 详细指标 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 交易统计 -->
        <div class="bg-white rounded-xl p-6 border border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">交易统计</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span class="text-sm text-slate-600">检测信号数</span>
              <span class="text-lg font-semibold text-slate-900">{{ result.total_signals }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-blue-600">执行交易数</span>
              <span class="text-lg font-semibold text-blue-700">{{ result.total_trades }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span class="text-sm text-amber-600">被忽略信号</span>
              <span class="text-lg font-semibold text-amber-700">{{ result.ignored_signals }} ({{ result.signal_ignored_rate }}%)</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span class="text-sm text-purple-600">信号执行率</span>
              <span class="text-lg font-semibold text-purple-700">{{ result.signal_execution_rate }}%</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span class="text-sm text-green-600">盈利交易</span>
              <span class="text-lg font-semibold text-green-700">{{ result.winning_trades }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span class="text-sm text-red-600">亏损交易</span>
              <span class="text-lg font-semibold text-red-700">{{ result.losing_trades }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-blue-600">平均持仓时间</span>
              <span class="text-lg font-semibold text-blue-700">{{ result.avg_holding_time }}h</span>
            </div>
          </div>
        </div>

        <!-- 收益统计 -->
        <div class="bg-white rounded-xl p-6 border border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">收益统计</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span class="text-sm text-slate-600">最终资金</span>
              <span class="text-lg font-semibold text-slate-900">${{ result.final_capital.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span class="text-sm text-green-600">最大单笔盈利</span>
              <span class="text-lg font-semibold text-green-700">${{ result.max_profit.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span class="text-sm text-red-600">最大单笔亏损</span>
              <span class="text-lg font-semibold text-red-700">${{ result.max_loss.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-blue-600">盈亏比</span>
              <span class="text-lg font-semibold text-blue-700">{{ result.profit_loss_ratio.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 收益曲线图占位符 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">收益曲线</h3>
        <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
          <p class="text-slate-500">图表功能开发中...</p>
        </div>
      </div>

      <!-- 交易记录 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">交易记录（前10笔）</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">方向</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">价格</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">数量</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase">盈亏</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(trade, index) in result.trades.slice(0, 10)" :key="index" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm text-slate-900">{{ trade.time }}</td>
                <td class="px-4 py-3">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    trade.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    {{ trade.side === 'buy' ? '买入' : '卖出' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-900">${{ trade.price.toFixed(2) }}</td>
                <td class="px-4 py-3 text-sm text-slate-900">{{ trade.quantity.toFixed(8) }}</td>
                <td class="px-4 py-3">
                  <span :class="[
                    'text-sm font-semibold',
                    trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    ${{ trade.profit.toFixed(2) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!result && !running" class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">开始回测</h3>
      <p class="text-slate-600">配置回测参数并点击"开始回测"按钮</p>
    </div>
    </div>

    <!-- 历史回测 TAB -->
    <div v-if="activeTab === 'history'">
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-900">历史回测记录</h3>
          <button
            @click="loadBacktestHistory"
            class="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新
          </button>
        </div>

        <!-- 加载中 -->
        <div v-if="loadingHistory" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- 历史记录列表 -->
        <div v-else-if="backtestHistory.length > 0" class="space-y-4">
          <div
            v-for="backtest in backtestHistory"
            :key="backtest.id"
            class="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h4 class="font-semibold text-slate-900">{{ backtest.signal_bot_name }}</h4>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded',
                      backtest.status === 'completed' ? 'bg-green-100 text-green-700' :
                      backtest.status === 'running' ? 'bg-blue-100 text-blue-700' :
                      backtest.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    ]"
                  >
                    {{ getStatusText(backtest.status) }}
                  </span>
                </div>
                <p class="text-sm text-slate-600">
                  {{ formatDate(backtest.start_date) }} ~ {{ formatDate(backtest.end_date) }}
                  · 初始资金: ${{ backtest.initial_capital }}
                  · 时间周期: {{ backtest.timeframe }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="backtest.status === 'completed'"
                  @click="viewBacktestDetail(backtest)"
                  class="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  查看详情
                </button>
                <button
                  @click="deleteBacktest(backtest.id)"
                  class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  删除
                </button>
              </div>
            </div>

            <!-- 回测结果摘要 -->
            <div v-if="backtest.status === 'completed'" class="space-y-3 pt-3 border-t border-slate-100">
              <!-- 第一行：核心指标 -->
              <div class="grid grid-cols-4 gap-4">
                <div>
                  <p class="text-xs text-slate-500 mb-1">总收益率</p>
                  <p :class="[
                    'text-sm font-semibold',
                    parseFloat(backtest.total_return || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ parseFloat(backtest.total_return || 0).toFixed(2) }}%
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 mb-1">胜率</p>
                  <p class="text-sm font-semibold text-slate-900">
                    {{ parseFloat(backtest.win_rate || 0).toFixed(1) }}%
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 mb-1">执行交易</p>
                  <p class="text-sm font-semibold text-slate-900">
                    {{ backtest.total_trades || 0 }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 mb-1">最大回撤</p>
                  <p class="text-sm font-semibold text-red-600">
                    {{ Math.abs(parseFloat(backtest.max_drawdown || 0)).toFixed(2) }}%
                  </p>
                </div>
              </div>

              <!-- 第二行：信号执行情况 -->
              <div class="grid grid-cols-3 gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <p class="text-xs text-slate-600 mb-1">检测信号</p>
                  <p class="text-sm font-semibold text-slate-900">
                    {{ backtest.total_signals || 0 }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-600 mb-1">被忽略信号</p>
                  <p class="text-sm font-semibold text-amber-600">
                    {{ backtest.ignored_signals || 0 }}
                    <span class="text-xs text-slate-500">({{ backtest.signal_ignored_rate || 0 }}%)</span>
                  </p>
                </div>
                <div>
                  <p class="text-xs text-slate-600 mb-1">执行率</p>
                  <p class="text-sm font-semibold text-blue-600">
                    {{ backtest.signal_execution_rate || 0 }}%
                  </p>
                </div>
              </div>

              <!-- 说明文字 -->
              <p class="text-xs text-slate-500 italic">
                💡 提示：检测信号 = 执行交易 + 被忽略信号。被忽略的信号是因为持仓中而无法执行的信号。
              </p>
            </div>

            <!-- 错误信息 -->
            <div v-if="backtest.status === 'failed' && backtest.error_message" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-700">{{ backtest.error_message }}</p>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-slate-600">暂无回测记录</p>
          <button
            @click="activeTab = 'new'"
            class="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            创建第一个回测
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'
import { formatDate, formatDateTime } from '../../../utils/timeUtils'

const activeTab = ref('new') // 'new' or 'history'
const running = ref(false)
const progress = ref(0)
const bots = ref([])
const result = ref(null)
const backtestId = ref(null)
const metricType = ref('quality') // 'quality' or 'trading'
const backtestHistory = ref([])
const loadingHistory = ref(false)

const config = ref({
  bot_id: '',
  time_range: '90d',
  start_date: '',
  end_date: '',
  initial_capital: 10000,
  timeframe: '4h',
  exit_strategy: 'fixed',
  take_profit_pct: 5.0,
  stop_loss_pct: 2.0,
  max_holding_hours: 24
})

// 更新日期范围
const updateDateRange = () => {
  if (config.value.time_range === 'custom') {
    return
  }

  const now = new Date()
  const end = now.toISOString().split('T')[0]
  let start = new Date()

  switch (config.value.time_range) {
    case '7d':
      start.setDate(now.getDate() - 7)
      break
    case '30d':
      start.setDate(now.getDate() - 30)
      break
    case '90d':
      start.setDate(now.getDate() - 90)
      break
    case '180d':
      start.setDate(now.getDate() - 180)
      break
    case '1y':
      start.setFullYear(now.getFullYear() - 1)
      break
  }

  config.value.start_date = start.toISOString().split('T')[0]
  config.value.end_date = end
}

// 加载机器人列表
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({ page_size: 100 })
    bots.value = response.results || response.data || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 开始回测
const startBacktest = async () => {
  if (!config.value.bot_id) {
    showError('请选择机器人')
    return
  }

  // 更新日期范围
  updateDateRange()

  running.value = true
  progress.value = 0
  result.value = null

  try {
    // 准备回测参数
    const backtestData = {
      signal_bot: config.value.bot_id,
      start_date: config.value.start_date,
      end_date: config.value.end_date,
      initial_capital: config.value.initial_capital,
      timeframe: config.value.timeframe,
      exit_strategy: config.value.exit_strategy
    }

    // 根据退出策略添加相应参数
    if (config.value.exit_strategy === 'fixed') {
      backtestData.take_profit_pct = config.value.take_profit_pct
      backtestData.stop_loss_pct = config.value.stop_loss_pct
    } else if (config.value.exit_strategy === 'time') {
      backtestData.max_holding_hours = config.value.max_holding_hours
    }

    console.log('创建回测:', backtestData)

    // 创建回测
    const response = await botAPI.createBacktest(backtestData)
    backtestId.value = response.id || response.data?.id

    console.log('回测已创建，ID:', backtestId.value)

    // 模拟进度（实际应该轮询后端状态）
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 10
      }
    }, 1000)

    // 轮询回测状态
    let attempts = 0
    const maxAttempts = 60  // 最多等待60秒

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000))

      try {
        const statusResponse = await botAPI.getBacktestDetail(backtestId.value)
        console.log('回测状态:', statusResponse.status)

        if (statusResponse.status === 'completed') {
          clearInterval(progressInterval)
          progress.value = 100

          // 获取完整结果
          result.value = {
            // 传统交易指标
            total_profit: parseFloat(statusResponse.total_return || 0) * config.value.initial_capital / 100,
            profit_rate: parseFloat(statusResponse.total_return || 0),
            win_rate: parseFloat(statusResponse.win_rate || 0),
            total_trades: statusResponse.total_trades || 0,
            winning_trades: statusResponse.winning_trades || 0,
            losing_trades: statusResponse.losing_trades || 0,
            sharpe_ratio: parseFloat(statusResponse.sharpe_ratio || 0) || 0,
            max_drawdown: Math.abs(parseFloat(statusResponse.max_drawdown) || 0),
            final_capital: config.value.initial_capital * (1 + parseFloat(statusResponse.total_return || 0) / 100),
            max_profit: parseFloat(statusResponse.max_profit || 0),
            max_loss: parseFloat(statusResponse.max_loss || 0),
            profit_loss_ratio: parseFloat(statusResponse.profit_factor || 0) || 0,
            avg_holding_time: parseFloat(statusResponse.avg_holding_time || 0) || 0,
            // 信号质量指标
            signal_accuracy: parseFloat(statusResponse.signal_accuracy || 0) || 0,
            false_signal_rate: parseFloat(statusResponse.false_signal_rate || 0) || 0,
            avg_signal_interval_hours: parseFloat(statusResponse.avg_signal_interval_hours || 0) || 0,
            signal_quality_score: parseInt(statusResponse.signal_quality_score || 0) || 0,
            // 信号统计
            total_signals: statusResponse.total_signals || 0,
            ignored_signals: statusResponse.ignored_signals || 0,
            signal_execution_rate: parseFloat(statusResponse.signal_execution_rate || 0) || 0,
            signal_ignored_rate: parseFloat(statusResponse.signal_ignored_rate || 0) || 0,
            trades: []
          }

          // 获取交易明细
          try {
            const tradesResponse = await botAPI.getBacktestTrades(backtestId.value)
            result.value.trades = (tradesResponse.results || tradesResponse.data || []).map(trade => ({
              time: new Date(trade.entry_time).toLocaleString(),
              side: trade.signal_type,
              price: parseFloat(trade.entry_price),
              quantity: 1,  // 简化显示
              profit: parseFloat(trade.profit_loss || 0)
            }))
          } catch (err) {
            console.error('获取交易明细失败:', err)
          }

          showSuccess('回测完成')
          break
        } else if (statusResponse.status === 'failed') {
          clearInterval(progressInterval)
          showError('回测失败: ' + (statusResponse.error_message || '未知错误'))
          break
        }
      } catch (err) {
        console.error('获取回测状态失败:', err)
      }

      attempts++
    }

    if (attempts >= maxAttempts) {
      clearInterval(progressInterval)
      showError('回测超时，请稍后查看结果')
    }
  } catch (error) {
    console.error('回测失败:', error)
    showError(error.message || '回测失败')
  } finally {
    running.value = false
  }
}

// 清除结果
const clearResult = () => {
  result.value = null
  progress.value = 0
}

// 加载回测历史
const loadBacktestHistory = async () => {
  loadingHistory.value = true
  try {
    const response = await botAPI.getBacktestList({ page_size: 50 })
    backtestHistory.value = response.results || response.data || []
    console.log('回测历史:', backtestHistory.value)
  } catch (error) {
    console.error('加载回测历史失败:', error)
    showError('加载回测历史失败')
  } finally {
    loadingHistory.value = false
  }
}

// 查看回测详情
const viewBacktestDetail = (backtest) => {
  // 切换到新建回测标签页，并显示该回测的结果
  activeTab.value = 'new'
  backtestId.value = backtest.id

  // 设置结果数据
  result.value = {
    // 传统交易指标
    total_profit: parseFloat(backtest.total_return || 0) * backtest.initial_capital / 100,
    profit_rate: parseFloat(backtest.total_return || 0),
    win_rate: parseFloat(backtest.win_rate || 0),
    total_signals: backtest.total_signals || 0,
    ignored_signals: backtest.ignored_signals || 0,
    total_trades: backtest.total_trades || 0,
    winning_trades: backtest.winning_trades || 0,
    losing_trades: backtest.losing_trades || 0,
    signal_execution_rate: parseFloat(backtest.signal_execution_rate || 0),
    signal_ignored_rate: parseFloat(backtest.signal_ignored_rate || 0),
    sharpe_ratio: parseFloat(backtest.sharpe_ratio || 0),
    max_drawdown: Math.abs(parseFloat(backtest.max_drawdown || 0)),
    final_capital: backtest.initial_capital * (1 + parseFloat(backtest.total_return || 0) / 100),
    max_profit: parseFloat(backtest.max_profit || 0),
    max_loss: parseFloat(backtest.max_loss || 0),

    // 信号质量指标
    signal_accuracy: parseFloat(backtest.signal_accuracy || 0),
    false_signal_rate: parseFloat(backtest.false_signal_rate || 0),
    avg_signal_interval_hours: parseFloat(backtest.avg_signal_interval_hours || 0),
    signal_quality_score: parseFloat(backtest.signal_quality_score || 0),

    trades: []
  }

  // 加载交易明细
  loadBacktestTrades(backtest.id)

  showSuccess('已加载回测结果')
}

// 加载回测交易明细
const loadBacktestTrades = async (backtestId) => {
  try {
    const tradesResponse = await botAPI.getBacktestTrades(backtestId)
    result.value.trades = (tradesResponse.results || tradesResponse.data || []).map(trade => ({
      time: new Date(trade.entry_time).toLocaleString(),
      side: trade.signal_type,
      price: parseFloat(trade.entry_price),
      quantity: 1,
      profit: parseFloat(trade.profit_loss || 0)
    }))
  } catch (err) {
    console.error('获取交易明细失败:', err)
  }
}

// 删除回测
const deleteBacktest = async (backtestId) => {
  if (!confirm('确定要删除这个回测记录吗？')) {
    return
  }

  try {
    await botAPI.deleteBacktest(backtestId)
    showSuccess('回测记录已删除')
    await loadBacktestHistory()
  } catch (error) {
    console.error('删除回测失败:', error)
    showError('删除回测失败')
  }
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    'pending': '待处理',
    'running': '运行中',
    'completed': '已完成',
    'failed': '失败'
  }
  return map[status] || status
}

onMounted(() => {
  loadBots()
  loadBacktestHistory()
})
</script>

