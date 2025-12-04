<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <main class="w-full">
          <!-- 页面头部 -->
          <div class="mb-10">
            <div class="flex items-start justify-between mb-8">
              <div>
                <h1 class="text-3xl font-bold text-slate-900">信号机器人</h1>
                <p class="text-slate-600 mt-2">监控和管理所有信号机器人</p>
              </div>
              <!-- 胶囊形状按钮设计 -->
              <button
                @click="handleCreateBot"
                class="group inline-flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span class="px-2">创建机器人</span>
                <div class="flex items-center justify-center w-8 h-8 bg-white rounded-full group-hover:bg-gray-50 transition-all duration-200">
                  <svg class="w-4 h-4 text-blue-600 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </button>
            </div>

            <!-- 关键指标卡片 - 商务设计 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <!-- 总机器人 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">总机器人</p>
                    <p class="text-4xl font-bold text-slate-900 mt-3">{{ statistics.total_bots }}</p>
                    <p class="text-xs text-slate-400 mt-2">全部机器人总数</p>
                  </div>
                  <div class="p-3">
                    <CpuChipIcon class="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>

              <!-- 运行中 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">运行中</p>
                    <p class="text-4xl font-bold text-green-600 mt-3">{{ statistics.running_bots }}</p>
                    <p class="text-xs text-slate-400 mt-2">正在运行的机器人</p>
                  </div>
                  <div class="p-3">
                    <PlayIcon class="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>

              <!-- 今日信号 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">今日信号</p>
                    <p class="text-4xl font-bold text-purple-600 mt-3">{{ todaySignals }}</p>
                    <p class="text-xs text-slate-400 mt-2">条信号</p>
                  </div>
                  <div class="p-3">
                    <BellIcon class="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>

              <!-- 总信号数 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">总信号数</p>
                    <p class="text-4xl font-bold text-amber-600 mt-3">{{ totalSignals }}</p>
                    <p class="text-xs text-slate-400 mt-2">条信号</p>
                  </div>
                  <div class="p-3">
                    <ChartBarIcon class="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 标签页 - 高级设计 -->
          <div class="mb-8">
            <!-- TAB 导航 -->
            <div class="flex gap-2 mb-6 border-b border-slate-200">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = index"
                :class="[
                  'px-6 py-3 font-medium text-sm transition-all duration-300 relative',
                  activeTab === index
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                ]"
              >
                <span class="flex items-center gap-2">
                  <i :class="`pi pi-${tab.icon}`"></i>
                  {{ tab.label }}
                </span>
                <div
                  v-if="activeTab === index"
                  class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t"
                ></div>
              </button>
            </div>

            <!-- TAB 1: 机器人列表 -->
            <div v-if="activeTab === 0">
              <!-- 筛选和搜索 - HeadlessUI 组件 -->
              <div class="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
                <div class="flex gap-4">
                  <!-- 状态筛选 -->
                  <div class="space-y-2 w-48">
                    <label class="block text-sm font-medium text-slate-700">状态</label>
                    <Listbox v-model="filters.status">
                      <div class="relative">
                        <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <span class="block truncate text-slate-700">
                            {{ statusOptionsWithAll.find(option => option.value === filters.status)?.label || '全部状态' }}
                          </span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="option in statusOptionsWithAll"
                              :key="option.value"
                              :value="option.value"
                              as="template"
                            >
                              <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                                <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <!-- 交易所筛选 -->
                  <div class="space-y-2 w-48">
                    <label class="block text-sm font-medium text-slate-700">交易所</label>
                    <Listbox v-model="filters.exchange">
                      <div class="relative">
                        <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <span class="block truncate text-slate-700">
                            {{ exchangeOptionsWithAll.find(option => option.value === filters.exchange)?.label || '选择交易所' }}
                          </span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="option in exchangeOptionsWithAll"
                              :key="option.value"
                              :value="option.value"
                              as="template"
                            >
                              <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                                <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <!-- 信号类型筛选 -->
                  <div class="space-y-2 w-48">
                    <label class="block text-sm font-medium text-slate-700">信号类型</label>
                    <Listbox v-model="filters.signalType">
                      <div class="relative">
                        <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <span class="block truncate text-slate-700">
                            {{ signalTypeOptionsWithAll.find(option => option.value === filters.signalType)?.label || '全部类型' }}
                          </span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="option in signalTypeOptionsWithAll"
                              :key="option.value"
                              :value="option.value"
                              as="template"
                            >
                              <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                                <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <!-- 市场类型筛选 -->
                  <div class="space-y-2 w-32">
                    <label class="block text-sm font-medium text-slate-700">市场类型</label>
                    <Listbox v-model="filters.marketType">
                      <div class="relative">
                        <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <span class="block truncate text-slate-700">
                            {{ marketTypeOptionsWithAll.find(option => option.value === filters.marketType)?.label || '全部' }}
                          </span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="option in marketTypeOptionsWithAll"
                              :key="option.value"
                              :value="option.value"
                              as="template"
                            >
                              <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                                <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <!-- 搜索框 -->
                  <div class="space-y-2 flex-1">
                    <label class="block text-sm font-medium text-slate-700">搜索</label>
                    <div class="relative">
                      <input
                        v-model="filters.search"
                        type="text"
                        placeholder="机器人名称或代币"
                        class="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <!-- 重置按钮 -->
                  <div class="flex items-end">
                    <button
                      @click="resetFilters"
                      class="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl px-6 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                      重置
                    </button>
                  </div>
                </div>
              </div>

              <!-- 机器人表格 - 高级设计 -->
              <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div v-if="loading" class="flex items-center justify-center py-12">
                  <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p class="text-slate-500">加载中...</p>
                  </div>
                </div>
                <div v-else-if="filteredBots.length === 0" class="text-center py-12">
                  <p class="text-slate-500">暂无机器人数据</p>
                </div>
                <div v-else>
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-slate-200 bg-slate-50">
                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider" style="width: 400px">机器人名称</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider" style="width: 80px">交易对</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider" style="width: 60px">市场</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider" style="width: 60px">状态</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider" style="width: 80px">信号类型</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider" style="width: 60px">信号数</th>
                        <th class="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider" style="width: 140px">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(bot, index) in filteredBots"
                        :key="bot.id"
                        :class="[
                          'border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200',
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        ]"
                      >
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-3">
                            <!-- 代币 Logo + 交易所徽章 -->
                            <div class="relative w-9 h-9 flex-shrink-0">
                              <!-- 代币 Logo -->
                              <img
                                v-if="bot.token_logo"
                                :src="bot.token_logo"
                                :alt="bot.token_symbol"
                                class="w-9 h-9 object-contain rounded-lg"
                                @error="(e) => e.target.style.display = 'none'"
                              />
                              <CpuChipIcon v-else class="w-9 h-9 text-slate-400" />

                              <!-- 交易所徽章（右下角） -->
                              <div
                                v-if="getExchangeLogo(bot.exchange_name)"
                                class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden"
                              >
                                <img
                                  :src="getExchangeLogo(bot.exchange_name)"
                                  :alt="bot.exchange_display || bot.exchange_name"
                                  class="w-3 h-3 object-contain"
                                  @error="(e) => e.target.parentElement.style.display = 'none'"
                                />
                              </div>
                            </div>

                            <div class="min-w-0 flex-1">
                              <p class="font-medium text-slate-900 truncate">{{ bot.name }}</p>
                              <p class="text-xs text-slate-500 truncate">
                                {{ bot.exchange_display || bot.exchange_name || '未知交易所' }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <!-- 交易对 -->
                        <td class="px-4 py-3" style="width: 100px">
                          <span class="font-medium text-slate-900 whitespace-nowrap text-sm">
                            {{ bot.token_symbol }}/{{ bot.trading_pair || 'USDT' }}
                          </span>
                        </td>
                        <!-- 市场类型 -->
                        <td class="px-4 py-3 text-center" style="width: 70px">
                          <span :class="[
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap',
                            bot.market_type === 'spot' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          ]">
                            {{ bot.market_type === 'spot' ? '现货' : '合约' }}
                          </span>
                        </td>
                        <!-- 状态 -->
                        <td class="px-4 py-3 text-center" style="width: 70px">
                          <span :class="[
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap',
                            bot.status === 'running'
                              ? 'bg-green-100 text-green-700'
                              : bot.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          ]">
                            {{ getStatusLabel(bot.status) }}
                          </span>
                        </td>
                        <!-- 信号类型 -->
                        <td class="px-4 py-3 text-center" style="width: 100px">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700 whitespace-nowrap">
                            {{ getSignalTypeLabel(bot.signal_type, bot.indicator_type) }}
                          </span>
                        </td>
                        <!-- 信号数 -->
                        <td class="px-4 py-3 text-center" style="width: 70px">
                          <span class="text-slate-900 font-medium whitespace-nowrap">
                            {{ bot.total_signals || 0 }}
                          </span>
                        </td>
                        <!-- 操作 -->
                        <td class="px-4 py-3 overflow-visible" style="width: 160px">
                          <div class="flex items-center justify-center gap-1 overflow-visible">
                            <!-- 启动/停止按钮 -->
                            <div class="relative">
                              <button
                                v-if="bot.status !== 'running'"
                                @click="handleStartBot(bot.id)"
                                @mouseenter="showTooltip(`start-${bot.id}`)"
                                @mouseleave="hideTooltip"
                                :disabled="loadingBotId === bot.id"
                                class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              >
                                <PlayIconSolid class="h-4 w-4" />
                              </button>
                              <button
                                v-else
                                @click="handleStopBot(bot.id)"
                                @mouseenter="showTooltip(`stop-${bot.id}`)"
                                @mouseleave="hideTooltip"
                                :disabled="loadingBotId === bot.id"
                                class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <StopIconSolid class="h-4 w-4" />
                              </button>
                              <div
                                v-if="hoveredButton === `start-${bot.id}` || hoveredButton === `stop-${bot.id}`"
                                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
                              >
                                {{ hoveredButton === `start-${bot.id}` ? '启动机器人' : '停止机器人' }}
                                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            <!-- 编辑按钮 -->
                            <div class="relative">
                              <button
                                @click="handleEditBot(bot.id)"
                                @mouseenter="showTooltip(`edit-${bot.id}`)"
                                @mouseleave="hideTooltip"
                                class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              >
                                <PencilIcon class="h-4 w-4" />
                              </button>
                              <div
                                v-if="hoveredButton === `edit-${bot.id}`"
                                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
                              >
                                编辑机器人
                                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            <!-- 分享按钮 -->
                            <div class="relative">
                              <button
                                @click="handleShareBot(bot)"
                                @mouseenter="showTooltip(`share-${bot.id}`)"
                                @mouseleave="hideTooltip"
                                class="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                              >
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>
                              <div
                                v-if="hoveredButton === `share-${bot.id}`"
                                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
                              >
                                分享机器人
                                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            <!-- 详情按钮 -->
                            <div class="relative">
                              <button
                                @click="handleViewBot(bot.id)"
                                @mouseenter="showTooltip(`view-${bot.id}`)"
                                @mouseleave="hideTooltip"
                                class="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                              >
                                <EyeIcon class="h-4 w-4" />
                              </button>
                              <div
                                v-if="hoveredButton === `view-${bot.id}`"
                                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
                              >
                                查看详情
                                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>

                            <!-- 删除按钮 -->
                            <div class="relative">
                              <button
                                @click="handleDeleteBot(bot.id)"
                                @mouseenter="showTooltip(`delete-${bot.id}`)"
                                @mouseleave="hideTooltip"
                                class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <TrashIcon class="h-4 w-4" />
                              </button>
                              <div
                                v-if="hoveredButton === `delete-${bot.id}`"
                                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none"
                              >
                                删除机器人
                                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB 2: 信号监控 -->
            <div v-if="activeTab === 1">
              <div class="space-y-6">
                <!-- 最近信号表格 -->
                <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 class="text-lg font-semibold text-slate-900">最近信号</h3>
                  </div>
                  <div v-if="loadingSignals" class="p-12 text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                    <p class="text-slate-500">加载中...</p>
                  </div>
                  <div v-else-if="recentSignals.length === 0" class="p-12 text-center">
                    <div class="inline-block p-4 bg-slate-100 rounded-full mb-4">
                      <i class="pi pi-inbox text-2xl text-slate-400"></i>
                    </div>
                    <p class="text-slate-500">暂无信号数据</p>
                  </div>
                  <table v-else class="w-full">
                    <thead>
                      <tr class="border-b border-slate-200 bg-slate-50">
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">机器人</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">信号类型</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">方向</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">价格</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">时间</th>
                        <th class="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(signal, index) in recentSignals.slice(0, 10)" :key="signal.id" :class="[
                        'border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200',
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      ]">
                        <td class="px-6 py-4">
                          <p class="font-medium text-slate-900">{{ signal.bot_name || signal.bot }}</p>
                        </td>
                        <td class="px-6 py-4">
                          <span :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                            signal.signal_type === 'buy'
                              ? 'bg-green-100 text-green-700'
                              : signal.signal_type === 'sell'
                              ? 'bg-red-100 text-red-700'
                              : signal.signal_type === 'alert'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-slate-100 text-slate-700'
                          ]">
                            {{ getSignalTypeDisplayLabel(signal.signal_type) }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <span :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                            signal.direction === 'long'
                              ? 'bg-blue-100 text-blue-700'
                              : signal.direction === 'short'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-700'
                          ]">
                            {{ getDirectionLabel(signal.direction) }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                          <p class="font-mono text-slate-900">${{ formatPrice(signal.price) }}</p>
                        </td>
                        <td class="px-6 py-4">
                          <p class="text-sm text-slate-600">{{ formatDate(signal.created_at) }}</p>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex items-center justify-center">
                            <button
                              @click="viewBotDetail(signal.bot)"
                              class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              查看详情
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB 3: 数据统计 -->
            <div v-if="activeTab === 2">
              <div class="space-y-6">
                <!-- 信号分布 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- 信号类型分布 -->
                  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <i class="pi pi-chart-pie text-blue-600"></i>
                      信号类型分布
                    </h3>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span class="text-sm text-slate-700">买入</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" style="width: 200px">
                            <div class="h-full bg-green-500 rounded-full" :style="{ width: `${totalSignals > 0 ? (signalTypeDistribution.buy / totalSignals * 100) : 0}%` }"></div>
                          </div>
                          <span class="text-sm font-semibold text-slate-900 w-12 text-right">{{ signalTypeDistribution.buy }}</span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span class="text-sm text-slate-700">卖出</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" style="width: 200px">
                            <div class="h-full bg-red-500 rounded-full" :style="{ width: `${totalSignals > 0 ? (signalTypeDistribution.sell / totalSignals * 100) : 0}%` }"></div>
                          </div>
                          <span class="text-sm font-semibold text-slate-900 w-12 text-right">{{ signalTypeDistribution.sell }}</span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span class="text-sm text-slate-700">提醒</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" style="width: 200px">
                            <div class="h-full bg-yellow-500 rounded-full" :style="{ width: `${totalSignals > 0 ? (signalTypeDistribution.alert / totalSignals * 100) : 0}%` }"></div>
                          </div>
                          <span class="text-sm font-semibold text-slate-900 w-12 text-right">{{ signalTypeDistribution.alert }}</span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-slate-500 rounded-full"></div>
                          <span class="text-sm text-slate-700">中性</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" style="width: 200px">
                            <div class="h-full bg-slate-500 rounded-full" :style="{ width: `${totalSignals > 0 ? (signalTypeDistribution.neutral / totalSignals * 100) : 0}%` }"></div>
                          </div>
                          <span class="text-sm font-semibold text-slate-900 w-12 text-right">{{ signalTypeDistribution.neutral }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 信号方向分布 -->
                  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <i class="pi pi-compass text-purple-600"></i>
                      信号方向分布
                    </h3>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span class="text-sm text-slate-700">做多</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" style="width: 200px">
                            <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${totalSignals > 0 ? (signalDirectionDistribution.long / totalSignals * 100) : 0}%` }"></div>
                          </div>
                          <span class="text-sm font-semibold text-slate-900 w-12 text-right">{{ signalDirectionDistribution.long }}</span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span class="text-sm text-slate-700">做空</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" style="width: 200px">
                            <div class="h-full bg-orange-500 rounded-full" :style="{ width: `${totalSignals > 0 ? (signalDirectionDistribution.short / totalSignals * 100) : 0}%` }"></div>
                          </div>
                          <span class="text-sm font-semibold text-slate-900 w-12 text-right">{{ signalDirectionDistribution.short }}</span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-slate-500 rounded-full"></div>
                          <span class="text-sm text-slate-700">中性</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden" style="width: 200px">
                            <div class="h-full bg-slate-500 rounded-full" :style="{ width: `${totalSignals > 0 ? (signalDirectionDistribution.neutral / totalSignals * 100) : 0}%` }"></div>
                          </div>
                          <span class="text-sm font-semibold text-slate-900 w-12 text-right">{{ signalDirectionDistribution.neutral }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 机器人排行榜和趋势图 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- 机器人排行榜 -->
                  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <i class="pi pi-trophy text-amber-600"></i>
                      信号最多的机器人 Top 5
                    </h3>
                    <div v-if="botRanking.length > 0" class="space-y-3">
                      <div
                        v-for="(bot, index) in botRanking"
                        :key="index"
                        class="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            :class="[
                              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                              index === 0 ? 'bg-amber-500 text-white' :
                              index === 1 ? 'bg-slate-400 text-white' :
                              index === 2 ? 'bg-orange-600 text-white' :
                              'bg-slate-300 text-slate-700'
                            ]"
                          >
                            {{ index + 1 }}
                          </div>
                          <span class="text-sm font-medium text-slate-900">{{ bot.name }}</span>
                        </div>
                        <span class="text-sm font-semibold text-slate-700">{{ bot.count }} 条</span>
                      </div>
                    </div>
                    <div v-else class="text-center py-8 text-slate-500">
                      暂无数据
                    </div>
                  </div>

                  <!-- 过去7天趋势 -->
                  <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <i class="pi pi-chart-line text-green-600"></i>
                      过去7天信号趋势
                    </h3>
                    <div v-if="last7DaysTrend.length > 0" class="space-y-2">
                      <div
                        v-for="(day, index) in last7DaysTrend"
                        :key="index"
                        class="flex items-center gap-3"
                      >
                        <span class="text-xs text-slate-600 w-12">{{ day.date }}</span>
                        <div class="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                          <div
                            class="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg transition-all duration-500"
                            :style="{ width: `${Math.max((day.count / Math.max(...last7DaysTrend.map(d => d.count)) * 100), 5)}%` }"
                          ></div>
                          <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-700">
                            {{ day.count }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-8 text-slate-500">
                      暂无数据
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 4: 集群回测 -->
            <div v-if="activeTab === 3">
              <BacktestPanel />
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 停止机器人确认对话框 -->
    <ConfirmModal
      v-if="showStopConfirm"
      type="warning"
      title="停止机器人"
      message="该机器人正在运行中。编辑运行中的机器人需要先停止它。是否停止机器人并继续编辑？"
      confirm-text="停止并编辑"
      cancel-text="取消"
      @confirm="handleConfirmStopAndEdit"
      @cancel="handleCancelStopAndEdit"
    />

    <!-- 删除机器人确认对话框 -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      type="danger"
      title="删除机器人"
      message="确定要删除这个机器人吗？此操作不可撤销，所有相关数据将被永久删除。"
      confirm-text="确认删除"
      cancel-text="取消"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />

    <!-- 分享弹窗 -->
    <ShareBotModal
      :is-open="showShareModal"
      :bot="selectedBot"
      :loading="loadingBotId !== null"
      @confirm="handleConfirmShare"
      @cancel="handleCancelShare"
    />

    <!-- 分享详情弹窗 -->
    <ShareStatsModal
      :is-open="showShareStatsModal"
      :bot-id="selectedBotId"
      @close="showShareStatsModal = false"
      @unshared="handleUnshared"
      @edit="handleEditShare"
    />

    <!-- 升级会员弹窗 -->
    <UpgradeMembershipModal
      ref="upgradeMembershipModal"
      title="信号机器人数量已达上限"
      message="您已达到当前会员等级的信号机器人数量限制，升级会员以创建更多机器人"
      :current-usage="membershipStatus.bot_usage?.signal_bots || 0"
      :limit-info="membershipStatus.bot_limits?.signal_bots === -1 ? '无限' : membershipStatus.bot_limits?.signal_bots || 0"
    />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import Header from '../../common/Header.vue'
import ShareBotModal from '../../common/ShareBotModal.vue'
import ShareStatsModal from '../../common/ShareStatsModal.vue'
import { CpuChipIcon, BellIcon, ChartBarIcon, PencilIcon, EyeIcon, TrashIcon, PlayIcon } from '@heroicons/vue/24/outline'
import { PlayIcon as PlayIconSolid, StopIcon as StopIconSolid } from '@heroicons/vue/24/solid'
import { botAPI, membershipAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'
import ConfirmModal from '../../common/ConfirmModal.vue'
import BacktestPanel from '../components/BacktestPanel.vue'
import UpgradeMembershipModal from '../../common/UpgradeMembershipModal.vue'

const router = useRouter()

// 升级会员弹窗
const upgradeMembershipModal = ref(null)

// 会员状态
const membershipStatus = ref({
  bot_limits: { signal_bots: 0, trading_bots: 0 },
  bot_usage: { signal_bots: 0, trading_bots: 0 },
  membership_tier: 'free'
})

// TAB 配置 - 从 localStorage 恢复上次选择的 TAB
const getInitialTab = () => {
  const savedTab = localStorage.getItem('signalBotListActiveTab')
  return savedTab ? parseInt(savedTab) : 0
}

const activeTab = ref(getInitialTab())  // 从 localStorage 恢复
const tabs = ref([
  { label: '机器人列表', icon: 'list' },
  { label: '信号监控', icon: 'bell' },
  { label: '数据统计', icon: 'chart-bar' },
  { label: '集群回测', icon: 'chart-line' }
])

// 监听 activeTab 变化，保存到 localStorage
watch(activeTab, (newTab) => {
  localStorage.setItem('signalBotListActiveTab', newTab.toString())
})

const loading = ref(false)
const loadingBotId = ref(null)
const loadingSignals = ref(false)
const bots = ref([])
const recentSignals = ref([])

// 确认对话框状态
const showStopConfirm = ref(false)
const pendingEditBotId = ref(null)
const showDeleteConfirm = ref(false)
const pendingDeleteBotId = ref(null)
const statistics = ref({
  total_bots: 0,
  running_bots: 0,
  paused_bots: 0,
  total_profit: 0,
  win_rate: 0
})

// Tooltip 状态
const hoveredButton = ref(null)

const filters = ref({
  status: '',
  bot_type: '',
  exchange: '',
  signalType: '',
  marketType: '',
  search: ''
})

const statusOptions = [
  { label: '运行中', value: 'running' },
  { label: '已暂停', value: 'paused' },
  { label: '已停止', value: 'stopped' },
  { label: '草稿', value: 'draft' }
]

const statusOptionsWithAll = [
  { label: '全部状态', value: '' },
  ...statusOptions
]

const signalTypeOptions = [
  { label: '指标信号提醒', value: 'indicator_alert' },
  { label: '价格提醒', value: 'price_alert' },
  { label: '成交量/持仓提醒', value: 'volume' },
  { label: '波动性提醒', value: 'volatility' }
]

const signalTypeOptionsWithAll = [
  { label: '全部类型', value: '' },
  ...signalTypeOptions
]

const marketTypeOptions = [
  { label: '现货', value: 'spot' },
  { label: '合约', value: 'futures' }
]

const marketTypeOptionsWithAll = [
  { label: '全部', value: '' },
  ...marketTypeOptions
]

const exchangeOptions = ref([])

const exchangeOptionsWithAll = computed(() => [
  { label: '选择交易所', value: '' },
  ...exchangeOptions.value.map(exchange => ({ label: exchange, value: exchange }))
])

const filteredBots = computed(() => {
  // 只显示信号机器人
  let result = bots.value.filter(bot => bot.bot_type === 'signal')

  if (filters.value.status && filters.value.status !== '') {
    result = result.filter(bot => bot.status === filters.value.status)
  }

  if (filters.value.exchange && filters.value.exchange !== '') {
    result = result.filter(bot => bot.exchange_name === filters.value.exchange)
  }

  if (filters.value.signalType && filters.value.signalType !== '') {
    result = result.filter(bot => {
      // 直接使用后端返回的 signal_type 字段
      if (!bot.signal_type) {
        return false
      }

      // 检查是否是策略模板筛选（格式：strategy:scalping）
      if (filters.value.signalType.startsWith('strategy:')) {
        const strategyType = filters.value.signalType.split(':')[1]
        // 检查机器人的配置是否匹配策略模板
        // 这里需要根据机器人的指标组合来判断
        if (bot.signal_type === 'indicator_alert' && bot.config?.indicator_alert) {
          const indicators = bot.config.indicator_alert.indicators || []
          return matchesStrategy(indicators, strategyType)
        }
        return false
      }

      // 检查是否是单指标筛选（格式：indicator:rsi）
      if (filters.value.signalType.startsWith('indicator:')) {
        const indicatorType = filters.value.signalType.split(':')[1]
        if (bot.signal_type === 'indicator_alert' && bot.config?.indicator_alert) {
          const indicators = bot.config.indicator_alert.indicators || []
          return indicators.some(ind => ind.type === indicatorType)
        }
        return false
      }

      // 如果选择的是 indicator_alert（不带子类型），显示所有指标信号提醒
      return bot.signal_type === filters.value.signalType
    })
  }

  if (filters.value.marketType && filters.value.marketType !== '') {
    result = result.filter(bot => bot.market_type === filters.value.marketType)
  }

  if (filters.value.search.trim()) {
    console.log('应用搜索过滤:', filters.value.search)
    const beforeCount = result.length
    const query = filters.value.search.toLowerCase()
    result = result.filter(bot =>
      bot.name.toLowerCase().includes(query) ||
      bot.token?.symbol?.toLowerCase().includes(query)
    )
    console.log(`搜索过滤: ${beforeCount} -> ${result.length}`)
  }

  return result
})

const loadBots = async () => {
  try {
    loading.value = true
    // 请求所有机器人，设置较大的 page_size
    const response = await botAPI.getBotList({ page_size: 100 })
    const data = response.results || response.data || response
    bots.value = Array.isArray(data) ? data : []

    // 调试：打印所有机器人数据
    console.log('📊 加载的机器人总数:', bots.value.length)
    console.log('📊 信号机器人数量:', bots.value.filter(b => b.bot_type === 'signal').length)
    console.log('📊 所有机器人:', bots.value.map(b => ({
      id: b.id,
      name: b.name,
      bot_type: b.bot_type,
      signal_type: b.signal_type,
      token_symbol: b.token_symbol,
      status: b.status
    })))

    updateExchangeOptions()
    updateStatistics()
  } catch (error) {
    console.error('加载机器人失败:', error)
    showError('加载机器人失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const updateExchangeOptions = () => {
  const exchanges = new Set()


  bots.value.forEach(bot => {
    if (bot.exchange_name) {
      exchanges.add(bot.exchange_name)
    }
  })

  // 如果没有找到交易所数据，使用临时的固定列表
  if (exchanges.size === 0) {
    console.log('未找到交易所数据，使用默认列表')
    exchangeOptions.value = ['Binance', 'Gate.io', 'OKX', 'Huobi']
  } else {
    exchangeOptions.value = Array.from(exchanges).sort()
  }
  console.log('交易所选项:', exchangeOptions.value)
}

const updateStatistics = () => {
  // 只统计信号机器人
  const signalBots = bots.value.filter(bot => bot.bot_type === 'signal')

  statistics.value = {
    total_bots: signalBots.length,
    running_bots: signalBots.filter(bot => bot.status === 'running').length,
    paused_bots: signalBots.filter(bot => bot.status === 'paused').length,
    total_profit: signalBots.reduce((sum, bot) => sum + (bot.total_profit || 0), 0),
    win_rate: signalBots.length > 0
      ? Math.round(signalBots.reduce((sum, bot) => sum + (bot.win_rate || 0), 0) / signalBots.length)
      : 0
  }
}

const resetFilters = () => {
  filters.value = { status: '', bot_type: '', exchange: '', signalType: '', marketType: '', search: '' }
}

const handleStartBot = async (botId) => {
  try {
    loadingBotId.value = botId
    await botAPI.startBot(botId)
    showSuccess('机器人已启动')

    // 只更新特定机器人的状态，而不是重新加载整个列表
    const botIndex = bots.value.findIndex(bot => bot.id === botId)
    if (botIndex !== -1) {
      bots.value[botIndex].status = 'running'
      bots.value[botIndex].is_active = true
    }
  } catch (error) {
    showError(error.message || '启动失败')
  } finally {
    loadingBotId.value = null
  }
}

const handleStopBot = async (botId) => {
  try {
    loadingBotId.value = botId
    await botAPI.stopBot(botId)
    showSuccess('机器人已停止')

    // 只更新特定机器人的状态，而不是重新加载整个列表
    const botIndex = bots.value.findIndex(bot => bot.id === botId)
    if (botIndex !== -1) {
      bots.value[botIndex].status = 'stopped'
      bots.value[botIndex].is_active = false
    }
  } catch (error) {
    showError(error.message || '停止失败')
  } finally {
    loadingBotId.value = null
  }
}

const handleEditBot = (botId) => {
  // 查找机器人
  const bot = bots.value.find(b => b.id === botId)

  // 如果机器人正在运行，显示确认对话框
  if (bot && bot.status === 'running') {
    pendingEditBotId.value = botId
    showStopConfirm.value = true
  } else {
    // 直接跳转到编辑页面
    router.push(`/bots/edit-signal/${botId}`)
  }
}

// 确认停止并编辑
const handleConfirmStopAndEdit = async () => {
  const botId = pendingEditBotId.value

  try {
    loadingBotId.value = botId
    await botAPI.stopBot(botId)

    // 更新本地状态
    const botIndex = bots.value.findIndex(b => b.id === botId)
    if (botIndex !== -1) {
      bots.value[botIndex].status = 'stopped'
      bots.value[botIndex].is_active = false
    }

    showSuccess('机器人已停止，现在可以编辑')

    // 关闭对话框
    showStopConfirm.value = false

    // 跳转到编辑页面
    router.push(`/bots/edit-signal/${botId}`)
  } catch (error) {
    showError('停止机器人失败: ' + (error.message || '未知错误'))
  } finally {
    loadingBotId.value = null
    pendingEditBotId.value = null
  }
}

// 取消停止并编辑
const handleCancelStopAndEdit = () => {
  showStopConfirm.value = false
  pendingEditBotId.value = null
}

const handleViewBot = (botId) => {
  // 跳转到信号机器人详情页
  router.push(`/signal-bots/${botId}`)
}

// 从信号列表查看机器人详情
const viewBotDetail = (botId) => {
  if (botId) {
    router.push(`/signal-bots/${botId}`)
  }
}

const handleDeleteBot = (botId) => {
  pendingDeleteBotId.value = botId
  showDeleteConfirm.value = true
}

// 确认删除
const handleConfirmDelete = async () => {
  const botId = pendingDeleteBotId.value

  try {
    loadingBotId.value = botId
    const response = await botAPI.deleteBot(botId)

    showSuccess('机器人已删除')

    // 从列表中移除已删除的机器人
    const botIndex = bots.value.findIndex(bot => bot.id === botId)
    if (botIndex !== -1) {
      bots.value.splice(botIndex, 1)
    }

    // 关闭对话框
    showDeleteConfirm.value = false
  } catch (error) {
    console.error('删除机器人失败:', error)

    // 检查是否是因为有关联的趋势跟踪机器人
    const errorMessage = error.message || error.error || '删除机器人失败'
    if (errorMessage.includes('趋势跟踪机器人正在使用')) {
      // 显示详细的错误信息，提示用户先删除关联的机器人
      showError(errorMessage)
    } else {
      showError(errorMessage)
    }
  } finally {
    loadingBotId.value = null
    pendingDeleteBotId.value = null
  }
}

// 取消删除
const handleCancelDelete = () => {
  showDeleteConfirm.value = false
  pendingDeleteBotId.value = null
}

// 分享弹窗状态
const showShareModal = ref(false)
const showShareStatsModal = ref(false)
const selectedBot = ref(null)
const selectedBotId = ref(null)

const handleShareBot = (bot) => {
  selectedBot.value = bot
  selectedBotId.value = bot.id

  // 如果已分享，显示详情弹窗；否则显示设置弹窗
  if (bot.visibility && bot.visibility !== 'private') {
    showShareStatsModal.value = true
  } else {
    showShareModal.value = true
  }
}

const handleConfirmShare = async (visibility) => {
  if (!selectedBot.value) return

  try {
    loadingBotId.value = selectedBot.value.id
    const response = await botAPI.updateBot(selectedBot.value.id, { visibility })

    // 更新本地数据
    const botIndex = bots.value.findIndex(b => b.id === selectedBot.value.id)
    if (botIndex !== -1) {
      bots.value[botIndex].visibility = visibility
      bots.value[botIndex].share_code = response.data.share_code
    }

    if (visibility === 'public') {
      const shareUrl = `${window.location.origin}/strategies?share_code=${response.data.share_code}`

      // 复制到剪贴板
      try {
        await navigator.clipboard.writeText(shareUrl)
        showSuccess(`已设置为公开！分享链接已复制到剪贴板`)
      } catch (err) {
        showSuccess(`已设置为公开！分享链接：${shareUrl}`)
      }
    } else if (visibility === 'followers_only') {
      showSuccess('已设置为仅关注者可见')
    }

    // 关闭弹窗
    showShareModal.value = false
    selectedBot.value = null
  } catch (error) {
    console.error('更新分享设置失败:', error)
    showError(error.response?.data?.message || '更新分享设置失败')
  } finally {
    loadingBotId.value = null
  }
}

const handleCancelShare = () => {
  showShareModal.value = false
  selectedBot.value = null
}

// 处理取消分享
const handleUnshared = async () => {
  // 重新加载机器人列表
  await loadBots()
  showSuccess('已取消分享')
}

// 处理编辑分享设置
const handleEditShare = () => {
  // 关闭详情弹窗，打开设置弹窗
  showShareStatsModal.value = false
  showShareModal.value = true
}

// 检查是否可以创建信号机器人
const canCreateSignalBot = computed(() => {
  const limit = membershipStatus.value.bot_limits?.signal_bots || 0
  const usage = membershipStatus.value.bot_usage?.signal_bots || 0

  // -1 表示无限制
  if (limit === -1) return true

  return usage < limit
})

// 获取限制文本
const botLimitText = (botType) => {
  const limit = membershipStatus.value.bot_limits?.[botType] || 0
  return limit === -1 ? '无限' : limit
}

const handleCreateBot = () => {
  if (!canCreateSignalBot.value) {
    // 显示升级会员弹窗
    if (upgradeMembershipModal.value) {
      upgradeMembershipModal.value.show()
    }
    return
  }
  router.push('/bots/create-signal')
}

// 获取会员状态
const fetchMembershipStatus = async () => {
  try {
    const response = await membershipAPI.getStatus()
    if (response.status === 'success') {
      membershipStatus.value = response.data
    }
  } catch (error) {
    console.error('获取会员状态失败:', error)
  }
}

const getStatusLabel = (status) => {
  const map = { running: '运行中', paused: '已暂停', stopped: '已停止', draft: '草稿' }
  return map[status] || status
}

// 获取信号类型标签（机器人配置的信号类型）
const getSignalTypeLabel = (signalType, indicatorType = null) => {
  // 如果是指标信号提醒，且有具体的指标类型，显示具体类型
  if (signalType === 'indicator_alert' && indicatorType) {
    const indicatorLabels = {
      'rsi': 'RSI',
      'macd': 'MACD',
      'ma_crossover': 'MA交叉',
      'atr': 'ATR',
      'bollinger': '布林带',
      'kdj': 'KDJ'
    }
    return indicatorLabels[indicatorType] || indicatorType
  }

  // 否则显示大类
  const labels = {
    'price_alert': '价格提醒',
    'indicator_alert': '指标信号提醒',
    'volatility': '波动性提醒',
    'volume': '成交量/持仓提醒',
    'custom': '自定义'
  }
  return labels[signalType] || signalType || '未知'
}

// 获取信号类型显示标签（信号记录的类型）
const getSignalTypeDisplayLabel = (signalType) => {
  const labels = {
    'buy': '买入',
    'sell': '卖出',
    'close': '平仓',
    'neutral': '中性',
    'alert': '提醒',
    'custom': '自定义'
  }
  return labels[signalType] || signalType || '未知'
}

// 获取方向标签
const getDirectionLabel = (direction) => {
  const labels = {
    'long': '做多',
    'short': '做空',
    'neutral': '中性'
  }
  return labels[direction] || direction || '未知'
}

// 智能格式化价格
const formatPrice = (price) => {
  const num = parseFloat(price || 0)
  if (num === 0) return '0.00'

  // 对于大于等于1的价格，显示2位小数
  if (num >= 1) {
    return num.toFixed(2)
  }

  // 对于小于1的价格，找到第一个非零数字，保留有效数字
  const absNum = Math.abs(num)
  if (absNum >= 0.01) {
    // 0.01 到 1 之间，显示4位小数
    return num.toFixed(4)
  } else if (absNum >= 0.0001) {
    // 0.0001 到 0.01 之间，显示6位小数
    return num.toFixed(6)
  } else {
    // 小于 0.0001，显示8位小数
    return num.toFixed(8)
  }
}

// 获取交易所 Logo URL（使用本地文件）
const getExchangeLogo = (exchangeName) => {
  const logos = {
    'binance': '/dex/binance.png',
    'okx': '/dex/okx.png',
    'bybit': '/dex/bybit.png',
    'gate': '/dex/gate.png'
  }
  return logos[exchangeName?.toLowerCase()] || ''
}

// Tooltip 显示和隐藏
const showTooltip = (buttonId) => {
  hoveredButton.value = buttonId
}

const hideTooltip = () => {
  hoveredButton.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 信号统计计算属性
const todaySignals = computed(() => {
  const today = new Date().toDateString()
  return recentSignals.value.filter(signal =>
    new Date(signal.created_at).toDateString() === today
  ).length
})

const totalSignals = computed(() => recentSignals.value.length)

// 信号类型分布
const signalTypeDistribution = computed(() => {
  const distribution = {
    buy: 0,
    sell: 0,
    neutral: 0,
    alert: 0
  }
  recentSignals.value.forEach(signal => {
    if (distribution.hasOwnProperty(signal.signal_type)) {
      distribution[signal.signal_type]++
    }
  })
  return distribution
})

// 信号方向分布
const signalDirectionDistribution = computed(() => {
  const distribution = {
    long: 0,
    short: 0,
    neutral: 0
  }
  recentSignals.value.forEach(signal => {
    if (distribution.hasOwnProperty(signal.direction)) {
      distribution[signal.direction]++
    }
  })
  return distribution
})

// 机器人排行（按信号数量）
const botRanking = computed(() => {
  const ranking = {}
  recentSignals.value.forEach(signal => {
    const botName = signal.bot_name || 'Unknown'
    ranking[botName] = (ranking[botName] || 0) + 1
  })
  return Object.entries(ranking)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

// 过去7天的信号趋势
const last7DaysTrend = computed(() => {
  const trend = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toDateString()

    const count = recentSignals.value.filter(signal =>
      new Date(signal.created_at).toDateString() === dateStr
    ).length

    trend.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      count
    })
  }

  return trend
})



// 策略匹配函数
const matchesStrategy = (indicators, strategyType) => {
  // 定义策略模板的指标组合
  const strategyTemplates = {
    scalping: ['rsi', 'macd', 'volume'],
    day_trading: ['rsi', 'macd', 'volume'],
    swing_trading: ['rsi', 'ma_crossover', 'volume'],
    trend_following: ['ma_crossover', 'macd'],
    reversal: ['rsi', 'macd', 'volume'],
    breakout: ['atr', 'volume', 'macd']
  }

  const templateIndicators = strategyTemplates[strategyType]
  if (!templateIndicators) return false

  // 检查机器人的指标是否包含模板的所有指标
  const botIndicatorTypes = indicators.map(ind => ind.type)
  return templateIndicators.every(type => botIndicatorTypes.includes(type))
}

// 加载信号数据
const loadSignals = async () => {
  try {
    loadingSignals.value = true
    let allSignals = []
    let nextUrl = null
    let page = 1

    // 循环获取所有分页数据
    do {
      const response = await botAPI.getSignalList({ page, page_size: 100 })

      const signals = response.results || response.data || response
      if (Array.isArray(signals)) {
        allSignals = allSignals.concat(signals)
      }

      nextUrl = response.next
      page++

      // 安全限制：最多加载10页，避免无限循环
      if (page > 10) break
    } while (nextUrl)

    recentSignals.value = allSignals
    console.log(`加载完成 - 总信号数: ${recentSignals.value.length}, 今日信号: ${todaySignals.value}`)
  } catch (error) {
    console.error('加载信号失败:', error)
    recentSignals.value = []
  } finally {
    loadingSignals.value = false
  }
}

// 定时刷新
let refreshInterval = null

onMounted(async () => {
  await fetchMembershipStatus()
  await loadBots()
  await loadSignals()

  // 每30秒自动刷新信号数据
  refreshInterval = setInterval(async () => {
    await loadSignals()
  }, 30000) // 30秒
})

onUnmounted(() => {
  // 清除定时器
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>



