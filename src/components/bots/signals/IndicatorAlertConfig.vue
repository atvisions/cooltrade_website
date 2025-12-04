<template>
  <Card variant="default" class="mb-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900">指标信号提醒设置</h2>
          <p class="text-sm text-slate-500">选择一个或多个技术指标组合生成信号</p>
        </div>
      </div>

      <!-- JSON 显示开关 -->
      <button
        type="button"
        @click="showJsonConfig = !showJsonConfig"
        :class="[
          'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all',
          showJsonConfig
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        {{ showJsonConfig ? '隐藏 JSON' : '显示 JSON' }}
      </button>
    </div>

    <!-- 策略快捷模板 -->
    <div class="mb-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
      <label class="block text-sm font-medium text-slate-700 mb-3">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>策略模板</span>
        </div>
        <span class="text-xs text-slate-500 block mt-1 ml-6">一键应用经典策略配置</span>
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          @click="applyStrategyTemplate('scalping')"
          :class="[
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            selectedTemplate === 'scalping'
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:border-blue-400 hover:shadow-sm'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          超短线抢帽子
        </button>
        <button
          type="button"
          @click="applyStrategyTemplate('day_trading')"
          :class="[
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            selectedTemplate === 'day_trading'
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:border-blue-400 hover:shadow-sm'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          日内交易
        </button>
        <button
          type="button"
          @click="applyStrategyTemplate('swing_trading')"
          :class="[
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            selectedTemplate === 'swing_trading'
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:border-blue-400 hover:shadow-sm'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          波段交易
        </button>
        <button
          type="button"
          @click="applyStrategyTemplate('trend_following')"
          :class="[
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            selectedTemplate === 'trend_following'
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:border-blue-400 hover:shadow-sm'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          趋势跟踪
        </button>
        <button
          type="button"
          @click="applyStrategyTemplate('reversal')"
          :class="[
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            selectedTemplate === 'reversal'
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:border-blue-400 hover:shadow-sm'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          反转捕捉
        </button>
        <button
          type="button"
          @click="applyStrategyTemplate('breakout')"
          :class="[
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
            selectedTemplate === 'breakout'
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:border-blue-400 hover:shadow-sm'
          ]"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          突破策略
        </button>
      </div>
    </div>

    <!-- JSON 配置显示/编辑 -->
    <div v-if="showJsonConfig" class="mb-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-slate-700">JSON 配置</label>
        <div class="flex items-center gap-2">
          <button
            v-if="!isEditingJson"
            type="button"
            @click="startEditingJson"
            class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-all"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑
          </button>
          <button
            v-if="isEditingJson"
            type="button"
            @click="applyJsonConfig"
            class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-all"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            应用
          </button>
          <button
            v-if="isEditingJson"
            type="button"
            @click="cancelEditingJson"
            class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded transition-all"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            取消
          </button>
          <button
            v-if="!isEditingJson"
            type="button"
            @click="copyJsonConfig"
            class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-all"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ jsonCopied ? '已复制' : '复制' }}
          </button>
        </div>
      </div>

      <!-- JSON 显示/编辑区域 -->
      <textarea
        v-if="isEditingJson"
        v-model="editingJsonText"
        class="w-full text-xs text-slate-700 bg-white rounded border border-slate-300 p-3 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows="20"
        placeholder="粘贴 JSON 配置..."
      ></textarea>
      <pre v-else class="text-xs text-slate-700 bg-white rounded border border-slate-200 p-3 overflow-x-auto max-h-96 overflow-y-auto font-mono">{{ formattedJsonConfig }}</pre>

      <!-- JSON 错误提示 -->
      <div v-if="jsonError" class="mt-2 p-3 bg-red-50 border border-red-200 rounded">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-semibold text-red-700 mb-1">配置验证失败</p>
            <pre class="text-xs text-red-600 whitespace-pre-wrap font-mono">{{ jsonError }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 指标配置表单（仅在不显示 JSON 时显示） -->
    <div v-else>
      <!-- 指标选择和组合逻辑（同一行） -->
      <div class="mb-6 grid grid-cols-2 gap-4">
        <!-- 指标多选下拉菜单 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            选择指标
            <span class="text-xs text-slate-500 block mt-1">可以选择多个指标进行组合</span>
          </label>
        <div class="relative">
          <button
            type="button"
            @click="showIndicatorDropdown = !showIndicatorDropdown"
            class="w-full px-4 py-2.5 text-left bg-white border-2 border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-blue-500 transition-all flex items-center justify-between"
          >
            <span class="text-sm text-slate-700">
              <span v-if="selectedIndicators.length === 0" class="text-slate-400">请选择指标...</span>
              <span v-else class="flex flex-wrap gap-1.5">
                <span
                  v-for="ind in selectedIndicators"
                  :key="ind"
                  class="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium"
                >
                  {{ getIndicatorLabel(ind) }}
                </span>
              </span>
            </span>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- 下拉菜单 -->
          <div
            v-if="showIndicatorDropdown"
            class="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg"
          >
            <div class="p-2 space-y-1">
              <label
                v-for="indicator in availableIndicators"
                :key="indicator.value"
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  :checked="selectedIndicators.includes(indicator.value)"
                  @change="toggleIndicator(indicator.value)"
                  class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div class="flex-1">
                  <div class="text-sm font-medium text-slate-900">{{ indicator.label }}</div>
                  <div class="text-xs text-slate-500">{{ indicator.description }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 组合逻辑选择 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          组合逻辑
          <span class="text-xs text-slate-500 block mt-1">多个指标如何组合</span>
        </label>
        <div class="flex gap-2">
          <button
            type="button"
            @click="emit('update:logic', 'AND')"
            :class="[
              'flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all',
              logic === 'AND'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            ]"
          >
            AND（全部满足）
          </button>
          <button
            type="button"
            @click="emit('update:logic', 'OR')"
            :class="[
              'flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all',
              logic === 'OR'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            ]"
          >
            OR（任一满足）
          </button>
        </div>
      </div>
    </div>

    <!-- 指标配置区域 -->
    <div v-if="selectedIndicators.length > 0" class="space-y-4">
      <!-- RSI 参数 -->
      <div v-if="selectedIndicators.includes('rsi')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">RSI（相对强弱指标）</h3>
              <p class="text-xs text-slate-500">衡量价格涨跌动能，判断超买超卖状态</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('rsi')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 快捷参数 -->
        <div class="mb-3 flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600">快捷:</label>
          <button
            type="button"
            @click="setRsiPreset('standard')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.rsi === 'standard'
                ? 'border-blue-500 bg-blue-500 text-white font-medium'
                : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'
            ]"
          >
            标准
          </button>
          <button
            type="button"
            @click="setRsiPreset('aggressive')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.rsi === 'aggressive'
                ? 'border-orange-500 bg-orange-500 text-white font-medium'
                : 'border-slate-200 hover:border-orange-500 hover:bg-orange-50'
            ]"
          >
            激进
          </button>
          <button
            type="button"
            @click="setRsiPreset('conservative')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.rsi === 'conservative'
                ? 'border-green-500 bg-green-500 text-white font-medium'
                : 'border-slate-200 hover:border-green-500 hover:bg-green-50'
            ]"
          >
            保守
          </button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              周期
              <span class="text-[10px] text-slate-500 block">计算窗口</span>
            </label>
            <select
              :value="indicatorsConfig.rsi?.params?.period || 14"
              @change="updateIndicatorParam('rsi', 'period', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.rsi" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              超买阈值
              <span class="text-[10px] text-slate-500 block">卖出信号</span>
            </label>
            <Input
              :model-value="indicatorsConfig.rsi?.params?.overbought || 70"
              @update:model-value="updateIndicatorParam('rsi', 'overbought', $event)"
              type="number"
              placeholder="70"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              超卖阈值
              <span class="text-[10px] text-slate-500 block">买入信号</span>
            </label>
            <Input
              :model-value="indicatorsConfig.rsi?.params?.oversold || 30"
              @update:model-value="updateIndicatorParam('rsi', 'oversold', $event)"
              type="number"
              placeholder="30"
              class="text-sm"
            />
          </div>
        </div>
      </div>

      <!-- MACD 参数 -->
      <div v-if="selectedIndicators.includes('macd')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">MACD（指数平滑异同移动平均线）</h3>
              <p class="text-xs text-slate-500">通过快慢均线交叉判断趋势变化</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('macd')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 快捷参数 -->
        <div class="mb-3 flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600">快捷:</label>
          <button
            type="button"
            @click="setMacdPreset('standard')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.macd === 'standard'
                ? 'border-blue-500 bg-blue-500 text-white font-medium'
                : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'
            ]"
          >
            标准
          </button>
          <button
            type="button"
            @click="setMacdPreset('fast')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.macd === 'fast'
                ? 'border-orange-500 bg-orange-500 text-white font-medium'
                : 'border-slate-200 hover:border-orange-500 hover:bg-orange-50'
            ]"
          >
            快速
          </button>
          <button
            type="button"
            @click="setMacdPreset('slow')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.macd === 'slow'
                ? 'border-green-500 bg-green-500 text-white font-medium'
                : 'border-slate-200 hover:border-green-500 hover:bg-green-50'
            ]"
          >
            慢速
          </button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              快线周期
              <span class="text-[10px] text-slate-500 block">短期EMA</span>
            </label>
            <select
              :value="indicatorsConfig.macd?.params?.fast || 12"
              @change="updateIndicatorParam('macd', 'fast', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.macd.fast" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              慢线周期
              <span class="text-[10px] text-slate-500 block">长期EMA</span>
            </label>
            <select
              :value="indicatorsConfig.macd?.params?.slow || 26"
              @change="updateIndicatorParam('macd', 'slow', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.macd.slow" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              信号线周期
              <span class="text-[10px] text-slate-500 block">MACD平滑</span>
            </label>
            <select
              :value="indicatorsConfig.macd?.params?.signal || 9"
              @change="updateIndicatorParam('macd', 'signal', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.macd.signal" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Phase 1: 零轴下方金叉 -->
        <div class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            :checked="indicatorsConfig.macd?.params?.below_zero_cross || false"
            @change="updateIndicatorParam('macd', 'below_zero_cross', $event.target.checked)"
            class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div class="flex-1">
            <label class="text-xs font-medium text-slate-700 cursor-pointer">
              要求零轴下方金叉
            </label>
            <p class="text-[10px] text-slate-500 mt-0.5">
              只在 MACD 值小于 0 时触发金叉信号（更强的反转信号）
            </p>
          </div>
        </div>
      </div>

      <!-- MA交叉 参数 -->
      <div v-if="selectedIndicators.includes('ma_crossover')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">MA交叉（移动平均线交叉）</h3>
              <p class="text-xs text-slate-500">通过快慢均线交叉判断趋势转折</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('ma_crossover')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 快捷参数 -->
        <div class="mb-3 flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600">快捷:</label>
          <button
            type="button"
            @click="setMaCrossPreset('short')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.ma_crossover === 'short'
                ? 'border-blue-500 bg-blue-500 text-white font-medium'
                : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'
            ]"
          >
            短线
          </button>
          <button
            type="button"
            @click="setMaCrossPreset('medium')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.ma_crossover === 'medium'
                ? 'border-orange-500 bg-orange-500 text-white font-medium'
                : 'border-slate-200 hover:border-orange-500 hover:bg-orange-50'
            ]"
          >
            中线
          </button>
          <button
            type="button"
            @click="setMaCrossPreset('long')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.ma_crossover === 'long'
                ? 'border-green-500 bg-green-500 text-white font-medium'
                : 'border-slate-200 hover:border-green-500 hover:bg-green-50'
            ]"
          >
            长线
          </button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              快线周期
              <span class="text-[10px] text-slate-500 block">短期均线</span>
            </label>
            <select
              :value="indicatorsConfig.ma_crossover?.params?.fast || 7"
              @change="updateIndicatorParam('ma_crossover', 'fast', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.ma_crossover.fast" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              慢线周期
              <span class="text-[10px] text-slate-500 block">长期均线</span>
            </label>
            <select
              :value="indicatorsConfig.ma_crossover?.params?.slow || 25"
              @change="updateIndicatorParam('ma_crossover', 'slow', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.ma_crossover.slow" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Phase 1: 价格突破快速均线 -->
        <div class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <input
            type="checkbox"
            :checked="indicatorsConfig.ma_crossover?.params?.break_fast_ma || false"
            @change="updateIndicatorParam('ma_crossover', 'break_fast_ma', $event.target.checked)"
            class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <div class="flex-1">
            <label class="text-xs font-medium text-slate-700 cursor-pointer">
              要求价格突破快速均线
            </label>
            <p class="text-[10px] text-slate-500 mt-0.5">
              只在价格高于快速均线时触发金叉信号（双重确认）
            </p>
          </div>
        </div>
      </div>

      <!-- ATR 参数 -->
      <div v-if="selectedIndicators.includes('atr')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">ATR（平均真实波幅）</h3>
              <p class="text-xs text-slate-500">衡量市场波动性的指标</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('atr')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 快捷参数 -->
        <div class="mb-3 flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600">快捷:</label>
          <button
            type="button"
            @click="setAtrPreset('tight')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.atr === 'tight'
                ? 'border-blue-500 bg-blue-500 text-white font-medium'
                : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'
            ]"
          >
            紧密
          </button>
          <button
            type="button"
            @click="setAtrPreset('standard')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.atr === 'standard'
                ? 'border-orange-500 bg-orange-500 text-white font-medium'
                : 'border-slate-200 hover:border-orange-500 hover:bg-orange-50'
            ]"
          >
            标准
          </button>
          <button
            type="button"
            @click="setAtrPreset('loose')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.atr === 'loose'
                ? 'border-green-500 bg-green-500 text-white font-medium'
                : 'border-slate-200 hover:border-green-500 hover:bg-green-50'
            ]"
          >
            宽松
          </button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              ATR 周期
              <span class="text-[10px] text-slate-500 block">计算窗口</span>
            </label>
            <select
              :value="indicatorsConfig.atr?.params?.period || 14"
              @change="updateIndicatorParam('atr', 'period', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.atr" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              波动阈值
              <span class="text-[10px] text-slate-500 block">变化倍数</span>
            </label>
            <select
              :value="indicatorsConfig.atr?.params?.threshold || 2.0"
              @change="updateIndicatorParam('atr', 'threshold', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in thresholdOptions.atr" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 成交量 参数 -->
      <div v-if="selectedIndicators.includes('volume')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">成交量（Volume）</h3>
              <p class="text-xs text-slate-500">检测成交量异常放大信号</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('volume')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 快捷参数 -->
        <div class="mb-3 flex items-center gap-2">
          <label class="text-xs font-medium text-slate-600">快捷:</label>
          <button
            type="button"
            @click="setVolumePreset('conservative')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.volume === 'conservative'
                ? 'border-blue-500 bg-blue-500 text-white font-medium'
                : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'
            ]"
          >
            保守
          </button>
          <button
            type="button"
            @click="setVolumePreset('standard')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.volume === 'standard'
                ? 'border-orange-500 bg-orange-500 text-white font-medium'
                : 'border-slate-200 hover:border-orange-500 hover:bg-orange-50'
            ]"
          >
            标准
          </button>
          <button
            type="button"
            @click="setVolumePreset('aggressive')"
            :class="[
              'px-2 py-1 text-xs border rounded transition-all',
              activePresets.volume === 'aggressive'
                ? 'border-green-500 bg-green-500 text-white font-medium'
                : 'border-slate-200 hover:border-green-500 hover:bg-green-50'
            ]"
          >
            激进
          </button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              成交量倍数
              <span class="text-[10px] text-slate-500 block">相对平均值</span>
            </label>
            <select
              :value="indicatorsConfig.volume?.params?.multiplier || 2.0"
              @change="updateIndicatorParam('volume', 'multiplier', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in thresholdOptions.volume" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              平均周期
              <span class="text-[10px] text-slate-500 block">K线数量</span>
            </label>
            <select
              :value="indicatorsConfig.volume?.params?.period || 20"
              @change="updateIndicatorParam('volume', 'period', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.volume" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Phase 1: 成交量激增 -->
        <div class="flex items-center gap-2 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
          <input
            type="checkbox"
            :checked="indicatorsConfig.volume?.params?.volume_surge !== false"
            @change="updateIndicatorParam('volume', 'volume_surge', $event.target.checked)"
            class="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
          />
          <div class="flex-1">
            <label class="text-xs font-medium text-slate-700 cursor-pointer">
              启用成交量激增检测
            </label>
            <p class="text-[10px] text-slate-500 mt-0.5">
              当成交量超过平均值的设定倍数时触发信号
            </p>
          </div>
        </div>
      </div>

      <!-- 布林带 参数 -->
      <div v-if="selectedIndicators.includes('bollinger')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">布林带（Bollinger Bands）</h3>
              <p class="text-xs text-slate-500">波动通道指标，检测挤压突破信号</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('bollinger')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              周期
              <span class="text-[10px] text-slate-500 block">MA周期</span>
            </label>
            <select
              :value="indicatorsConfig.bollinger?.params?.period || 20"
              @change="updateIndicatorParam('bollinger', 'period', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.bollinger" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              标准差倍数
              <span class="text-[10px] text-slate-500 block">带宽</span>
            </label>
            <select
              :value="indicatorsConfig.bollinger?.params?.std || 2"
              @change="updateIndicatorParam('bollinger', 'std', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in thresholdOptions.bollinger.std" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              挤压阈值
              <span class="text-[10px] text-slate-500 block">带宽%</span>
            </label>
            <select
              :value="indicatorsConfig.bollinger?.params?.squeeze_threshold || 0.03"
              @change="updateIndicatorParam('bollinger', 'squeeze_threshold', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in thresholdOptions.bollinger.squeeze" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 支点 参数 -->
      <div v-if="selectedIndicators.includes('pivot')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">支点（Pivot Points）</h3>
              <p class="text-xs text-slate-500">检测支撑阻力位，判断关键价位</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('pivot')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              左侧K线数
              <span class="text-[10px] text-slate-500 block">确认高低点</span>
            </label>
            <select
              :value="indicatorsConfig.pivot?.params?.pivot_left || 3"
              @change="updateIndicatorParam('pivot', 'pivot_left', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.pivot" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              右侧K线数
              <span class="text-[10px] text-slate-500 block">确认高低点</span>
            </label>
            <select
              :value="indicatorsConfig.pivot?.params?.pivot_right || 3"
              @change="updateIndicatorParam('pivot', 'pivot_right', Number($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="opt in periodOptions.pivot" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- K线形态 参数 -->
      <div v-if="selectedIndicators.includes('pattern')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">K线形态（Candlestick Patterns）</h3>
              <p class="text-xs text-slate-500">检测经典K线形态，预测价格反转</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('pattern')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <input
              type="checkbox"
              :checked="indicatorsConfig.pattern?.params?.pinbar !== false"
              @change="updateIndicatorParam('pattern', 'pinbar', $event.target.checked)"
              class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <div class="flex-1">
              <label class="text-xs font-medium text-slate-700 cursor-pointer">锤子线/倒锤子</label>
              <p class="text-[10px] text-slate-500">Pin Bar形态</p>
            </div>
          </div>
          <div class="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <input
              type="checkbox"
              :checked="indicatorsConfig.pattern?.params?.engulfing !== false"
              @change="updateIndicatorParam('pattern', 'engulfing', $event.target.checked)"
              class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <div class="flex-1">
              <label class="text-xs font-medium text-slate-700 cursor-pointer">吞没形态</label>
              <p class="text-[10px] text-slate-500">Engulfing Pattern</p>
            </div>
          </div>
          <div class="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <input
              type="checkbox"
              :checked="indicatorsConfig.pattern?.params?.double_top !== false"
              @change="updateIndicatorParam('pattern', 'double_top', $event.target.checked)"
              class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <div class="flex-1">
              <label class="text-xs font-medium text-slate-700 cursor-pointer">双顶</label>
              <p class="text-[10px] text-slate-500">Double Top</p>
            </div>
          </div>
          <div class="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <input
              type="checkbox"
              :checked="indicatorsConfig.pattern?.params?.double_bottom !== false"
              @change="updateIndicatorParam('pattern', 'double_bottom', $event.target.checked)"
              class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <div class="flex-1">
              <label class="text-xs font-medium text-slate-700 cursor-pointer">双底</label>
              <p class="text-[10px] text-slate-500">Double Bottom</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 背离 参数 -->
      <div v-if="selectedIndicators.includes('divergence')" class="border-2 border-slate-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900">背离（Divergence）</h3>
              <p class="text-xs text-slate-500">检测价格与指标背离，预测趋势反转</p>
            </div>
          </div>
          <button
            v-if="selectedIndicators.length > 1"
            type="button"
            @click="removeIndicator('divergence')"
            class="text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-3">
          <label class="block text-xs font-medium text-slate-700 mb-1.5">
            回看周期
            <span class="text-[10px] text-slate-500 block">检测背离的K线数量</span>
          </label>
          <select
            :value="indicatorsConfig.divergence?.params?.divergence_lookback || 5"
            @change="updateIndicatorParam('divergence', 'divergence_lookback', Number($event.target.value))"
            class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="opt in periodOptions.divergence" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <input
              type="checkbox"
              :checked="indicatorsConfig.divergence?.params?.use_rsi !== false"
              @change="updateIndicatorParam('divergence', 'use_rsi', $event.target.checked)"
              class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <div class="flex-1">
              <label class="text-xs font-medium text-slate-700 cursor-pointer">RSI背离</label>
              <p class="text-[10px] text-slate-500">价格与RSI背离</p>
            </div>
          </div>
          <div class="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <input
              type="checkbox"
              :checked="indicatorsConfig.divergence?.params?.use_macd !== false"
              @change="updateIndicatorParam('divergence', 'use_macd', $event.target.checked)"
              class="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <div class="flex-1">
              <label class="text-xs font-medium text-slate-700 cursor-pointer">MACD背离</label>
              <p class="text-[10px] text-slate-500">价格与MACD背离</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间周期配置 -->
    <div class="mt-6">
      <TimeframesConfig
        :timeframes-config="timeframesConfig"
        @update:primary="$emit('update:timeframes-primary', $event)"
        @toggle-confirm="$emit('toggle-confirm-timeframe', $event)"
        @update:require-all-confirm="$emit('update:timeframes-require-all', $event)"
        @update:min-confirm-count="$emit('update:timeframes-min-count', $event)"
      />
    </div>
    </div><!-- 关闭 v-else -->
  </Card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '../../common/ui/Card.vue'
import Input from '../../common/ui/Input.vue'
import TimeframesConfig from './TimeframesConfig.vue'

const props = defineProps({
  // 新的多指标配置格式
  selectedIndicators: {
    type: Array,
    default: () => []
  },
  logic: {
    type: String,
    default: 'AND'
  },
  indicatorsConfig: {
    type: Object,
    default: () => ({})
  },
  timeframesConfig: {
    type: Object,
    default: () => ({
      primary: '1h',
      confirm: [],
      require_all_confirm: false,
      min_confirm_count: 1
    })
  },
  // 保留旧的单指标格式（向后兼容）
  indicatorType: {
    type: String,
    default: ''
  },
  rsiConfig: {
    type: Object,
    default: () => ({
      period: 14,
      overbought: 70,
      oversold: 30
    })
  },
  macdConfig: {
    type: Object,
    default: () => ({
      fast: 12,
      slow: 26,
      signal: 9
    })
  },
  maCrossConfig: {
    type: Object,
    default: () => ({
      fast: 7,
      slow: 25
    })
  },
  atrConfig: {
    type: Object,
    default: () => ({
      period: 14,
      threshold: 2.0
    })
  },
  volumeConfig: {
    type: Object,
    default: () => ({
      multiplier: 2.0,
      period: 20
    })
  }
})

const emit = defineEmits([
  'update:selectedIndicators',
  'update:logic',
  'update:indicatorsConfig',
  // 时间周期配置事件
  'update:timeframes-primary',
  'toggle-confirm-timeframe',
  'update:timeframes-require-all',
  'update:timeframes-min-count',
  // 保留旧的事件（向后兼容）
  'update:indicatorType',
  'update:rsiConfig',
  'update:macdConfig',
  'update:maCrossConfig',
  'update:atrConfig',
  'update:volumeConfig'
])

const availableIndicators = [
  { label: 'RSI', value: 'rsi', description: '相对强弱指标，判断超买超卖' },
  { label: 'MACD', value: 'macd', description: '趋势动量指标，捕捉金叉死叉' },
  { label: 'MA交叉', value: 'ma_crossover', description: '均线交叉，判断趋势转折' },
  { label: 'ATR', value: 'atr', description: '波动性指标，衡量市场活跃度' },
  { label: '成交量', value: 'volume', description: '检测成交量异常放大' },
  { label: '布林带', value: 'bollinger', description: '波动通道，检测挤压突破' },
  { label: '支点', value: 'pivot', description: '支撑阻力位，检测关键价位' },
  { label: 'K线形态', value: 'pattern', description: '锤子线、吞没等经典形态' },
  { label: '背离', value: 'divergence', description: 'RSI/MACD背离，预测反转' }
]

// 周期选项 - 专业交易员常用参数
const periodOptions = {
  rsi: [
    { value: 6, label: '6 (超短线)' },
    { value: 7, label: '7 (短线)' },
    { value: 14, label: '14 (标准)' },
    { value: 21, label: '21 (中线)' },
    { value: 28, label: '28 (长线)' }
  ],
  macd: {
    fast: [
      { value: 8, label: '8 (快速)' },
      { value: 12, label: '12 (标准)' },
      { value: 17, label: '17 (慢速)' }
    ],
    slow: [
      { value: 17, label: '17 (快速)' },
      { value: 26, label: '26 (标准)' },
      { value: 36, label: '36 (慢速)' }
    ],
    signal: [
      { value: 7, label: '7 (快速)' },
      { value: 9, label: '9 (标准)' },
      { value: 12, label: '12 (慢速)' }
    ]
  },
  ma_crossover: {
    fast: [
      { value: 5, label: '5 (超短)' },
      { value: 7, label: '7 (短线)' },
      { value: 10, label: '10 (日内)' },
      { value: 20, label: '20 (波段)' }
    ],
    slow: [
      { value: 20, label: '20 (短期)' },
      { value: 25, label: '25 (中短)' },
      { value: 50, label: '50 (中期)' },
      { value: 100, label: '100 (长期)' },
      { value: 200, label: '200 (超长)' }
    ]
  },
  atr: [
    { value: 7, label: '7 (短线)' },
    { value: 14, label: '14 (标准)' },
    { value: 21, label: '21 (长线)' }
  ],
  volume: [
    { value: 10, label: '10 (短期)' },
    { value: 20, label: '20 (标准)' },
    { value: 50, label: '50 (长期)' }
  ],
  bollinger: [
    { value: 10, label: '10 (短期)' },
    { value: 20, label: '20 (标准)' },
    { value: 50, label: '50 (长期)' }
  ],
  pivot: [
    { value: 2, label: '2 (敏感)' },
    { value: 3, label: '3 (标准)' },
    { value: 5, label: '5 (稳定)' }
  ],
  divergence: [
    { value: 3, label: '3 (短期)' },
    { value: 5, label: '5 (标准)' },
    { value: 10, label: '10 (长期)' }
  ]
}

// 阈值选项
const thresholdOptions = {
  atr: [
    { value: 1.0, label: '1.0x (低波动)' },
    { value: 1.5, label: '1.5x (中低)' },
    { value: 2.0, label: '2.0x (标准)' },
    { value: 2.5, label: '2.5x (中高)' },
    { value: 3.0, label: '3.0x (高波动)' }
  ],
  volume: [
    { value: 1.5, label: '1.5x (低量)' },
    { value: 2.0, label: '2.0x (标准)' },
    { value: 2.5, label: '2.5x (放量)' },
    { value: 3.0, label: '3.0x (巨量)' },
    { value: 4.0, label: '4.0x (异常)' }
  ],
  bollinger: {
    std: [
      { value: 1.5, label: '1.5 (窄带)' },
      { value: 2.0, label: '2.0 (标准)' },
      { value: 2.5, label: '2.5 (宽带)' }
    ],
    squeeze: [
      { value: 0.02, label: '2% (敏感)' },
      { value: 0.03, label: '3% (标准)' },
      { value: 0.05, label: '5% (宽松)' }
    ]
  }
}

const showIndicatorDropdown = ref(false)
const showJsonConfig = ref(false)
const jsonCopied = ref(false)
const selectedTemplate = ref(null)
const isEditingJson = ref(false)
const editingJsonText = ref('')
const jsonError = ref('')

// 追踪当前选中的预设（用于高亮显示）
const activePresets = ref({
  rsi: null,
  macd: null,
  ma_crossover: null,
  atr: null,
  volume: null,
  bollinger: null,
  pivot: null,
  pattern: null,
  divergence: null
})

// 获取指标标签
const getIndicatorLabel = (value) => {
  const indicator = availableIndicators.find(ind => ind.value === value)
  return indicator ? indicator.label : value
}

// 格式化 JSON 配置
const formattedJsonConfig = computed(() => {
  const config = {
    logic: props.logic,
    indicators: props.selectedIndicators.map(type => {
      const indicatorConfig = props.indicatorsConfig[type]
      return {
        type: type,
        enabled: indicatorConfig?.enabled !== false,
        weight: indicatorConfig?.weight || 1,
        params: indicatorConfig?.params || {}
      }
    }),
    timeframes: {
      primary: props.timeframesConfig.primary,
      confirm: props.timeframesConfig.confirm,
      require_all_confirm: props.timeframesConfig.require_all_confirm,
      min_confirm_count: props.timeframesConfig.min_confirm_count
    }
  }
  return JSON.stringify(config, null, 2)
})

// 复制 JSON 配置
const copyJsonConfig = async () => {
  try {
    await navigator.clipboard.writeText(formattedJsonConfig.value)
    jsonCopied.value = true
    setTimeout(() => {
      jsonCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 开始编辑 JSON
const startEditingJson = () => {
  isEditingJson.value = true
  editingJsonText.value = formattedJsonConfig.value
  jsonError.value = ''
}

// 取消编辑 JSON
const cancelEditingJson = () => {
  isEditingJson.value = false
  editingJsonText.value = ''
  jsonError.value = ''
}

// 验证指标配置
const validateIndicatorConfig = (indicator) => {
  const errors = []

  // 验证指标类型（支持别名）
  const validTypes = availableIndicators.map(ind => ind.value)
  const typeAliases = {
    'ma_crossover': 'ma_cross',  // 别名支持
    'ma_cross': 'ma_crossover',  // 反向别名支持
  }

  const normalizedType = typeAliases[indicator.type] || indicator.type

  // 检查原始类型或规范化类型是否有效
  const isValidType = validTypes.includes(indicator.type) ||
                      validTypes.includes(normalizedType) ||
                      Object.keys(typeAliases).includes(indicator.type)

  if (!isValidType) {
    errors.push(`不支持的指标类型: ${indicator.type}。支持的类型: ${validTypes.join(', ')}, ma_cross`)
    return errors
  }

  // 验证权重
  if (indicator.weight !== undefined) {
    if (typeof indicator.weight !== 'number' || indicator.weight < 0 || indicator.weight > 100) {
      errors.push(`${indicator.type}: 权重必须是 0-100 之间的数字`)
    }
  }

  // 验证参数（使用规范化后的类型）
  const params = indicator.params || {}

  switch (normalizedType) {
    case 'rsi':
      if (params.period !== undefined && (typeof params.period !== 'number' || params.period < 2 || params.period > 100)) {
        errors.push(`RSI: period 必须是 2-100 之间的数字`)
      }
      // 支持两种字段名：oversold_threshold（新）和 oversold（旧）
      const oversoldValue = params.oversold_threshold ?? params.oversold
      if (oversoldValue !== undefined && (typeof oversoldValue !== 'number' || oversoldValue < 0 || oversoldValue > 100)) {
        errors.push(`RSI: oversold/oversold_threshold 必须是 0-100 之间的数字`)
      }
      const overboughtValue = params.overbought_threshold ?? params.overbought
      if (overboughtValue !== undefined && (typeof overboughtValue !== 'number' || overboughtValue < 0 || overboughtValue > 100)) {
        errors.push(`RSI: overbought/overbought_threshold 必须是 0-100 之间的数字`)
      }
      // Phase 2: 反转强度
      if (params.reversal_strength !== undefined && (typeof params.reversal_strength !== 'number' || params.reversal_strength < 0 || params.reversal_strength > 50)) {
        errors.push(`RSI: reversal_strength 必须是 0-50 之间的数字`)
      }
      break

    case 'macd':
      if (params.fast !== undefined && (typeof params.fast !== 'number' || params.fast < 2 || params.fast > 100)) {
        errors.push(`MACD: fast 必须是 2-100 之间的数字`)
      }
      if (params.slow !== undefined && (typeof params.slow !== 'number' || params.slow < 2 || params.slow > 100)) {
        errors.push(`MACD: slow 必须是 2-100 之间的数字`)
      }
      if (params.signal !== undefined && (typeof params.signal !== 'number' || params.signal < 2 || params.signal > 100)) {
        errors.push(`MACD: signal 必须是 2-100 之间的数字`)
      }
      if (params.signal_cross !== undefined && !['bullish', 'bearish'].includes(params.signal_cross)) {
        errors.push(`MACD: signal_cross 必须是 'bullish' 或 'bearish'`)
      }
      // Phase 1: 零轴下方金叉（兼容多种布尔值表示）
      if (params.below_zero_cross !== undefined && params.below_zero_cross !== null) {
        const val = params.below_zero_cross
        const isBooleanLike = typeof val === 'boolean' ||
                              val === 'true' || val === 'false' ||
                              val === true || val === false ||
                              val === 1 || val === 0 ||
                              val === '1' || val === '0'
        if (!isBooleanLike) {
          errors.push(`MACD: below_zero_cross 必须是布尔值（true/false/1/0），当前值: ${val}（类型: ${typeof val}）`)
        }
      }
      // Phase 1: 金叉信号（兼容多种布尔值表示）
      if (params.golden_cross !== undefined && params.golden_cross !== null) {
        const val = params.golden_cross
        const isBooleanLike = typeof val === 'boolean' ||
                              val === 'true' || val === 'false' ||
                              val === true || val === false ||
                              val === 1 || val === 0 ||
                              val === '1' || val === '0'
        if (!isBooleanLike) {
          errors.push(`MACD: golden_cross 必须是布尔值（true/false/1/0），当前值: ${val}`)
        }
      }
      // Phase 2: 绿柱缩短
      if (params.green_shrink !== undefined && (typeof params.green_shrink !== 'number' || params.green_shrink < 1 || params.green_shrink > 10)) {
        errors.push(`MACD: green_shrink 必须是 1-10 之间的数字`)
      }
      break

    case 'ma_cross':
    case 'ma_crossover':  // 兼容旧字段名
      if (params.fast_period !== undefined && (typeof params.fast_period !== 'number' || params.fast_period < 2 || params.fast_period > 500)) {
        errors.push(`MA交叉: fast_period 必须是 2-500 之间的数字`)
      }
      // 支持两种字段名：fast_period（新）和 fast（旧）
      if (params.fast !== undefined && (typeof params.fast !== 'number' || params.fast < 2 || params.fast > 500)) {
        errors.push(`MA交叉: fast 必须是 2-500 之间的数字`)
      }
      if (params.slow_period !== undefined && (typeof params.slow_period !== 'number' || params.slow_period < 2 || params.slow_period > 500)) {
        errors.push(`MA交叉: slow_period 必须是 2-500 之间的数字`)
      }
      // 支持两种字段名：slow_period（新）和 slow（旧）
      if (params.slow !== undefined && (typeof params.slow !== 'number' || params.slow < 2 || params.slow > 500)) {
        errors.push(`MA交叉: slow 必须是 2-500 之间的数字`)
      }
      if (params.ma_type !== undefined && !['sma', 'ema'].includes(params.ma_type)) {
        errors.push(`MA交叉: ma_type 必须是 'sma' 或 'ema'`)
      }
      if (params.cross_direction !== undefined && !['golden', 'death'].includes(params.cross_direction)) {
        errors.push(`MA交叉: cross_direction 必须是 'golden' 或 'death'`)
      }
      // Phase 1: 价格突破快速均线（兼容多种布尔值表示）
      if (params.break_fast_ma !== undefined && params.break_fast_ma !== null) {
        const val = params.break_fast_ma
        const isBooleanLike = typeof val === 'boolean' ||
                              val === 'true' || val === 'false' ||
                              val === true || val === false ||
                              val === 1 || val === 0 ||
                              val === '1' || val === '0'
        if (!isBooleanLike) {
          errors.push(`MA交叉: break_fast_ma 必须是布尔值（true/false/1/0），当前值: ${val}（类型: ${typeof val}）`)
        }
      }
      break

    case 'bollinger':
      if (params.period !== undefined && (typeof params.period !== 'number' || params.period < 2 || params.period > 100)) {
        errors.push(`布林带: period 必须是 2-100 之间的数字`)
      }
      if (params.std_dev !== undefined && (typeof params.std_dev !== 'number' || params.std_dev < 0.5 || params.std_dev > 5)) {
        errors.push(`布林带: std_dev 必须是 0.5-5 之间的数字`)
      }
      if (params.position !== undefined && !['upper', 'lower', 'middle'].includes(params.position)) {
        errors.push(`布林带: position 必须是 'upper', 'lower' 或 'middle'`)
      }
      break

    case 'volume':
      if (params.volume_threshold !== undefined && (typeof params.volume_threshold !== 'number' || params.volume_threshold < 0)) {
        errors.push(`成交量: volume_threshold 必须是大于 0 的数字`)
      }
      if (params.volume_ma_period !== undefined && (typeof params.volume_ma_period !== 'number' || params.volume_ma_period < 2 || params.volume_ma_period > 100)) {
        errors.push(`成交量: volume_ma_period 必须是 2-100 之间的数字`)
      }
      // Phase 1: 成交量相对倍数
      if (params.period !== undefined && (typeof params.period !== 'number' || params.period < 2 || params.period > 100)) {
        errors.push(`成交量: period 必须是 2-100 之间的数字`)
      }
      if (params.multiplier !== undefined && (typeof params.multiplier !== 'number' || params.multiplier < 0.1 || params.multiplier > 10)) {
        errors.push(`成交量: multiplier 必须是 0.1-10 之间的数字`)
      }
      // Phase 1: 成交量激增（兼容布尔值和字符串）
      if (params.volume_surge !== undefined) {
        const val = params.volume_surge
        if (typeof val !== 'boolean' && val !== 'true' && val !== 'false' && val !== true && val !== false) {
          errors.push(`成交量: volume_surge 必须是布尔值（true/false）`)
        }
      }
      break

    case 'atr':
      if (params.period !== undefined && (typeof params.period !== 'number' || params.period < 2 || params.period > 100)) {
        errors.push(`ATR: period 必须是 2-100 之间的数字`)
      }
      if (params.threshold !== undefined && (typeof params.threshold !== 'number' || params.threshold < 0)) {
        errors.push(`ATR: threshold 必须是大于 0 的数字`)
      }
      // Phase 2: ATR 激增（兼容布尔值和字符串）
      if (params.atr_surge !== undefined) {
        const val = params.atr_surge
        if (typeof val !== 'boolean' && val !== 'true' && val !== 'false' && val !== true && val !== false) {
          errors.push(`ATR: atr_surge 必须是布尔值（true/false）`)
        }
      }
      break
  }

  return errors
}

// 应用 JSON 配置
const applyJsonConfig = () => {
  try {
    // 解析 JSON
    const config = JSON.parse(editingJsonText.value)

    // 1. 验证顶层结构
    if (!config.logic || !Array.isArray(config.indicators)) {
      jsonError.value = 'JSON 格式错误：必须包含 logic 和 indicators 字段'
      return
    }

    // 2. 验证 logic 值（兼容大小写）
    const normalizedLogic = config.logic.toLowerCase()
    if (!['and', 'or'].includes(normalizedLogic)) {
      jsonError.value = `logic 必须是 'and'/'AND' 或 'or'/'OR'，当前值: ${config.logic}`
      return
    }

    // 3. 验证 indicators 数组
    if (config.indicators.length === 0) {
      jsonError.value = '至少需要配置一个指标'
      return
    }

    // 4. 验证每个指标
    const allErrors = []
    config.indicators.forEach((indicator, index) => {
      if (!indicator.type) {
        allErrors.push(`指标 #${index + 1}: 缺少 type 字段`)
        return
      }

      const errors = validateIndicatorConfig(indicator)
      allErrors.push(...errors)
    })

    if (allErrors.length > 0) {
      jsonError.value = '配置验证失败：\n' + allErrors.join('\n')
      return
    }

    // 5. 验证时间周期配置（如果存在）
    if (config.timeframes) {
      const validTimeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w']
      if (config.timeframes.primary && !validTimeframes.includes(config.timeframes.primary)) {
        jsonError.value = `无效的主时间周期: ${config.timeframes.primary}。支持: ${validTimeframes.join(', ')}`
        return
      }
      if (config.timeframes.confirm && !Array.isArray(config.timeframes.confirm)) {
        jsonError.value = 'timeframes.confirm 必须是数组'
        return
      }
      if (config.timeframes.confirm) {
        const invalidTimeframes = config.timeframes.confirm.filter(tf => !validTimeframes.includes(tf))
        if (invalidTimeframes.length > 0) {
          jsonError.value = `无效的确认时间周期: ${invalidTimeframes.join(', ')}`
          return
        }
      }
    }

    // 6. 所有验证通过，应用配置
    // 规范化指标类型（处理别名）
    const typeAliases = {
      'ma_cross': 'ma_crossover',
    }

    const normalizedIndicators = config.indicators.map(ind => {
      const normalizedType = typeAliases[ind.type] || ind.type
      const normalizedParams = { ...ind.params }

      // 规范化布尔值（将字符串 "true"/"false" 转换为布尔值）
      Object.keys(normalizedParams).forEach(key => {
        const val = normalizedParams[key]
        if (val === 'true') normalizedParams[key] = true
        if (val === 'false') normalizedParams[key] = false
      })

      return {
        ...ind,
        type: normalizedType,
        params: normalizedParams
      }
    })

    // 提取指标类型
    const indicatorTypes = normalizedIndicators.map(ind => ind.type)

    // 构建指标配置对象
    const newIndicatorsConfig = {}
    normalizedIndicators.forEach(ind => {
      newIndicatorsConfig[ind.type] = {
        type: ind.type,
        enabled: ind.enabled !== false,
        weight: ind.weight || 33,
        params: ind.params || {}
      }
    })

    // 更新配置（统一转换为小写）
    emit('update:selectedIndicators', indicatorTypes)
    emit('update:logic', normalizedLogic.toUpperCase())  // 前端使用大写 AND/OR
    emit('update:indicatorsConfig', newIndicatorsConfig)

    // 如果有时间周期配置，也更新
    if (config.timeframes) {
      emit('update:timeframes-primary', config.timeframes.primary)
      emit('update:timeframes-require-all', config.timeframes.require_all_confirm)
      emit('update:timeframes-min-count', config.timeframes.min_confirm_count)

      // 更新确认周期
      if (Array.isArray(config.timeframes.confirm)) {
        // 清空现有的确认周期
        const currentConfirm = props.timeframesConfig.confirm || []
        currentConfirm.forEach(tf => {
          emit('toggle-confirm-timeframe', tf)
        })
        // 添加新的确认周期
        config.timeframes.confirm.forEach(tf => {
          emit('toggle-confirm-timeframe', tf)
        })
      }
    }

    // 关闭编辑模式
    isEditingJson.value = false
    editingJsonText.value = ''
    jsonError.value = ''

  } catch (err) {
    jsonError.value = `JSON 解析错误：${err.message}`
    console.error('JSON 解析失败:', err)
  }
}

// 切换指标选择
const toggleIndicator = (value) => {
  const selected = [...props.selectedIndicators]
  const index = selected.indexOf(value)

  if (index > -1) {
    // 取消选择
    selected.splice(index, 1)
  } else {
    // 添加选择
    selected.push(value)

    // 初始化该指标的配置
    const newConfig = { ...props.indicatorsConfig }
    if (!newConfig[value]) {
      newConfig[value] = {
        type: value,
        enabled: true,
        weight: 1,
        params: getDefaultParams(value)
      }
      emit('update:indicatorsConfig', newConfig)
    }
  }

  emit('update:selectedIndicators', selected)
}

// 移除指标
const removeIndicator = (value) => {
  const selected = props.selectedIndicators.filter(ind => ind !== value)
  emit('update:selectedIndicators', selected)

  // 移除配置
  const newConfig = { ...props.indicatorsConfig }
  delete newConfig[value]
  emit('update:indicatorsConfig', newConfig)
}

// 获取默认参数
const getDefaultParams = (indicatorType) => {
  const defaults = {
    rsi: { period: 14, overbought: 70, oversold: 30 },
    macd: { fast: 12, slow: 26, signal: 9 },
    ma_crossover: { fast: 7, slow: 25 },
    atr: { period: 14, threshold: 2.0 },
    volume: { multiplier: 2.0, period: 20 }
  }
  return defaults[indicatorType] || {}
}

// 更新指标参数
const updateIndicatorParam = (indicatorType, paramKey, value) => {
  const newConfig = { ...props.indicatorsConfig }

  if (!newConfig[indicatorType]) {
    newConfig[indicatorType] = {
      type: indicatorType,
      enabled: true,
      weight: 1,
      params: {}
    }
  }

  if (!newConfig[indicatorType].params) {
    newConfig[indicatorType].params = {}
  }

  newConfig[indicatorType].params[paramKey] = Number(value)
  emit('update:indicatorsConfig', newConfig)
}

// RSI 预设
const setRsiPreset = (preset) => {
  const presets = {
    standard: { period: 14, overbought: 70, oversold: 30 },
    aggressive: { period: 14, overbought: 80, oversold: 20 },
    conservative: { period: 14, overbought: 65, oversold: 35 }
  }

  const newConfig = { ...props.indicatorsConfig }
  if (!newConfig.rsi) {
    newConfig.rsi = { type: 'rsi', enabled: true, weight: 1, params: {} }
  }
  newConfig.rsi.params = presets[preset]
  emit('update:indicatorsConfig', newConfig)

  // 更新高亮状态
  activePresets.value.rsi = preset
}

// MACD 预设
const setMacdPreset = (preset) => {
  const presets = {
    standard: { fast: 12, slow: 26, signal: 9 },
    fast: { fast: 5, slow: 13, signal: 5 },
    slow: { fast: 19, slow: 39, signal: 9 }
  }

  const newConfig = { ...props.indicatorsConfig }
  if (!newConfig.macd) {
    newConfig.macd = { type: 'macd', enabled: true, weight: 1, params: {} }
  }
  newConfig.macd.params = presets[preset]
  emit('update:indicatorsConfig', newConfig)

  // 更新高亮状态
  activePresets.value.macd = preset
}

// MA交叉 预设
const setMaCrossPreset = (preset) => {
  const presets = {
    short: { fast: 7, slow: 25 },
    medium: { fast: 20, slow: 50 },
    long: { fast: 50, slow: 200 }
  }

  const newConfig = { ...props.indicatorsConfig }
  if (!newConfig.ma_crossover) {
    newConfig.ma_crossover = { type: 'ma_crossover', enabled: true, weight: 1, params: {} }
  }
  newConfig.ma_crossover.params = presets[preset]
  emit('update:indicatorsConfig', newConfig)

  // 更新高亮状态
  activePresets.value.ma_crossover = preset
}

// ATR 预设
const setAtrPreset = (preset) => {
  const presets = {
    tight: { period: 14, threshold: 1.5 },
    standard: { period: 14, threshold: 2.0 },
    loose: { period: 14, threshold: 3.0 }
  }

  const newConfig = { ...props.indicatorsConfig }
  if (!newConfig.atr) {
    newConfig.atr = { type: 'atr', enabled: true, weight: 1, params: {} }
  }
  newConfig.atr.params = presets[preset]
  emit('update:indicatorsConfig', newConfig)

  // 更新高亮状态
  activePresets.value.atr = preset
}

// 成交量 预设
const setVolumePreset = (preset) => {
  const presets = {
    conservative: { multiplier: 3.0, period: 20 },
    standard: { multiplier: 2.0, period: 20 },
    aggressive: { multiplier: 1.5, period: 20 }
  }

  const newConfig = { ...props.indicatorsConfig }
  if (!newConfig.volume) {
    newConfig.volume = { type: 'volume', enabled: true, weight: 1, params: {} }
  }
  newConfig.volume.params = presets[preset]
  emit('update:indicatorsConfig', newConfig)

  // 更新高亮状态
  activePresets.value.volume = preset
}

// 应用策略模板
const applyStrategyTemplate = (template) => {
  const templates = {
    // 超短线抢帽子（5分钟-15分钟）
    scalping: {
      logic: 'AND',
      indicators: ['rsi', 'macd', 'volume'],
      config: {
        rsi: { type: 'rsi', enabled: true, weight: 1, params: { period: 14, overbought: 80, oversold: 20 } },
        macd: { type: 'macd', enabled: true, weight: 1, params: { fast: 5, slow: 13, signal: 5 } },
        volume: { type: 'volume', enabled: true, weight: 1, params: { multiplier: 1.5, period: 20 } }
      }
    },
    // 日内交易（15分钟-1小时）
    day_trading: {
      logic: 'AND',
      indicators: ['rsi', 'macd', 'volume'],
      config: {
        rsi: { type: 'rsi', enabled: true, weight: 1, params: { period: 14, overbought: 70, oversold: 30 } },
        macd: { type: 'macd', enabled: true, weight: 1, params: { fast: 12, slow: 26, signal: 9 } },
        volume: { type: 'volume', enabled: true, weight: 1, params: { multiplier: 2.0, period: 20 } }
      }
    },
    // 波段交易（4小时-1天）
    swing_trading: {
      logic: 'AND',
      indicators: ['rsi', 'ma_crossover', 'volume'],
      config: {
        rsi: { type: 'rsi', enabled: true, weight: 1, params: { period: 14, overbought: 65, oversold: 35 } },
        ma_crossover: { type: 'ma_crossover', enabled: true, weight: 1, params: { fast: 20, slow: 50 } },
        volume: { type: 'volume', enabled: true, weight: 1, params: { multiplier: 2.0, period: 20 } }
      }
    },
    // 趋势跟踪（1天-1周）
    trend_following: {
      logic: 'AND',
      indicators: ['ma_crossover', 'macd'],
      config: {
        ma_crossover: { type: 'ma_crossover', enabled: true, weight: 1, params: { fast: 50, slow: 200 } },
        macd: { type: 'macd', enabled: true, weight: 1, params: { fast: 19, slow: 39, signal: 9 } }
      }
    },
    // 反转捕捉
    reversal: {
      logic: 'AND',
      indicators: ['rsi', 'macd', 'volume'],
      config: {
        rsi: { type: 'rsi', enabled: true, weight: 1, params: { period: 14, overbought: 75, oversold: 25 } },
        macd: { type: 'macd', enabled: true, weight: 1, params: { fast: 12, slow: 26, signal: 9 } },
        volume: { type: 'volume', enabled: true, weight: 1, params: { multiplier: 2.5, period: 20 } }
      }
    },
    // 突破策略
    breakout: {
      logic: 'AND',
      indicators: ['atr', 'volume', 'macd'],
      config: {
        atr: { type: 'atr', enabled: true, weight: 1, params: { period: 14, threshold: 2.0 } },
        volume: { type: 'volume', enabled: true, weight: 1, params: { multiplier: 2.0, period: 20 } },
        macd: { type: 'macd', enabled: true, weight: 1, params: { fast: 12, slow: 26, signal: 9 } }
      }
    }
  }

  const templateConfig = templates[template]
  if (templateConfig) {
    selectedTemplate.value = template
    emit('update:selectedIndicators', templateConfig.indicators)
    emit('update:logic', templateConfig.logic)
    emit('update:indicatorsConfig', templateConfig.config)
  }
}

// 点击外部关闭下拉菜单
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showIndicatorDropdown.value = false
    }
  })
})
</script>


