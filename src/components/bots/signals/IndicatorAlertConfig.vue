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
      <div v-if="jsonError" class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ jsonError }}</span>
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
          <button type="button" @click="setRsiPreset('standard')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-all">标准</button>
          <button type="button" @click="setRsiPreset('aggressive')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-orange-500 hover:bg-orange-50 transition-all">激进</button>
          <button type="button" @click="setRsiPreset('conservative')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-green-500 hover:bg-green-50 transition-all">保守</button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              周期
              <span class="text-[10px] text-slate-500 block">计算窗口</span>
            </label>
            <Input
              :model-value="indicatorsConfig.rsi?.params?.period || 14"
              @update:model-value="updateIndicatorParam('rsi', 'period', $event)"
              type="number"
              placeholder="14"
              class="text-sm"
            />
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
          <button type="button" @click="setMacdPreset('standard')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-all">标准</button>
          <button type="button" @click="setMacdPreset('fast')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-orange-500 hover:bg-orange-50 transition-all">快速</button>
          <button type="button" @click="setMacdPreset('slow')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-green-500 hover:bg-green-50 transition-all">慢速</button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              快线周期
              <span class="text-[10px] text-slate-500 block">短期EMA</span>
            </label>
            <Input
              :model-value="indicatorsConfig.macd?.params?.fast || 12"
              @update:model-value="updateIndicatorParam('macd', 'fast', $event)"
              type="number"
              placeholder="12"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              慢线周期
              <span class="text-[10px] text-slate-500 block">长期EMA</span>
            </label>
            <Input
              :model-value="indicatorsConfig.macd?.params?.slow || 26"
              @update:model-value="updateIndicatorParam('macd', 'slow', $event)"
              type="number"
              placeholder="26"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              信号线周期
              <span class="text-[10px] text-slate-500 block">MACD平滑</span>
            </label>
            <Input
              :model-value="indicatorsConfig.macd?.params?.signal || 9"
              @update:model-value="updateIndicatorParam('macd', 'signal', $event)"
              type="number"
              placeholder="9"
              class="text-sm"
            />
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
          <button type="button" @click="setMaCrossPreset('short')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-all">短线</button>
          <button type="button" @click="setMaCrossPreset('medium')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-orange-500 hover:bg-orange-50 transition-all">中线</button>
          <button type="button" @click="setMaCrossPreset('long')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-green-500 hover:bg-green-50 transition-all">长线</button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              快线周期
              <span class="text-[10px] text-slate-500 block">短期均线</span>
            </label>
            <Input
              :model-value="indicatorsConfig.ma_crossover?.params?.fast || 7"
              @update:model-value="updateIndicatorParam('ma_crossover', 'fast', $event)"
              type="number"
              placeholder="7"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              慢线周期
              <span class="text-[10px] text-slate-500 block">长期均线</span>
            </label>
            <Input
              :model-value="indicatorsConfig.ma_crossover?.params?.slow || 25"
              @update:model-value="updateIndicatorParam('ma_crossover', 'slow', $event)"
              type="number"
              placeholder="25"
              class="text-sm"
            />
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
          <button type="button" @click="setAtrPreset('tight')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-all">紧密</button>
          <button type="button" @click="setAtrPreset('standard')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-orange-500 hover:bg-orange-50 transition-all">标准</button>
          <button type="button" @click="setAtrPreset('loose')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-green-500 hover:bg-green-50 transition-all">宽松</button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              ATR 周期
              <span class="text-[10px] text-slate-500 block">计算窗口</span>
            </label>
            <Input
              :model-value="indicatorsConfig.atr?.params?.period || 14"
              @update:model-value="updateIndicatorParam('atr', 'period', $event)"
              type="number"
              placeholder="14"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              波动阈值
              <span class="text-[10px] text-slate-500 block">变化倍数</span>
            </label>
            <Input
              :model-value="indicatorsConfig.atr?.params?.threshold || 2.0"
              @update:model-value="updateIndicatorParam('atr', 'threshold', $event)"
              type="number"
              step="0.1"
              placeholder="2.0"
              class="text-sm"
            />
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
          <button type="button" @click="setVolumePreset('conservative')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-all">保守</button>
          <button type="button" @click="setVolumePreset('standard')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-orange-500 hover:bg-orange-50 transition-all">标准</button>
          <button type="button" @click="setVolumePreset('aggressive')" class="px-2 py-1 text-xs border border-slate-200 rounded hover:border-green-500 hover:bg-green-50 transition-all">激进</button>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              成交量倍数
              <span class="text-[10px] text-slate-500 block">相对平均值</span>
            </label>
            <Input
              :model-value="indicatorsConfig.volume?.params?.multiplier || 2.0"
              @update:model-value="updateIndicatorParam('volume', 'multiplier', $event)"
              type="number"
              step="0.1"
              placeholder="2.0"
              class="text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              平均周期
              <span class="text-[10px] text-slate-500 block">K线数量</span>
            </label>
            <Input
              :model-value="indicatorsConfig.volume?.params?.period || 20"
              @update:model-value="updateIndicatorParam('volume', 'period', $event)"
              type="number"
              placeholder="20"
              class="text-sm"
            />
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
  { label: '成交量', value: 'volume', description: '检测成交量异常放大' }
]

const showIndicatorDropdown = ref(false)
const showJsonConfig = ref(false)
const jsonCopied = ref(false)
const selectedTemplate = ref(null)
const isEditingJson = ref(false)
const editingJsonText = ref('')
const jsonError = ref('')

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

// 应用 JSON 配置
const applyJsonConfig = () => {
  try {
    // 解析 JSON
    const config = JSON.parse(editingJsonText.value)

    // 验证 JSON 格式
    if (!config.logic || !Array.isArray(config.indicators)) {
      jsonError.value = 'JSON 格式错误：必须包含 logic 和 indicators 字段'
      return
    }

    // 提取指标类型
    const indicatorTypes = config.indicators.map(ind => ind.type)

    // 构建指标配置对象
    const newIndicatorsConfig = {}
    config.indicators.forEach(ind => {
      newIndicatorsConfig[ind.type] = {
        type: ind.type,
        enabled: ind.enabled !== false,
        weight: ind.weight || 1,
        params: ind.params || {}
      }
    })

    // 更新配置
    emit('update:selectedIndicators', indicatorTypes)
    emit('update:logic', config.logic)
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


