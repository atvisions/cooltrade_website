<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">累计盈亏</h3>
          <p class="text-sm text-gray-500 mt-1">账户净值变化趋势</p>
        </div>
        <div class="flex items-center space-x-6">
          <!-- 时间选择器 -->
          <div class="flex items-center space-x-2 text-sm">
            <button class="px-3 py-1 text-gray-500 hover:text-gray-700">按天</button>
            <button class="px-3 py-1 text-gray-500 hover:text-gray-700">按周</button>
            <button class="px-3 py-1 text-gray-500 hover:text-gray-700">按月</button>
            <button class="px-3 py-1 text-gray-500 hover:text-gray-700">按年</button>
            <button class="px-3 py-1 bg-gray-100 text-gray-900 rounded">全部</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      <!-- 左侧：账户净值信息 -->
      <div class="lg:col-span-1">
        <div class="space-y-4">
          <div>
            <div class="text-sm text-gray-500 mb-1">账户净值</div>
            <div class="text-2xl font-bold text-gray-900">125,000 USDT</div>
            <div class="text-sm text-success-500 mt-1">+25.0%</div>
          </div>

          <!-- 累计收益率卡片 -->
          <div class="bg-success-50 rounded-lg p-4">
            <div class="text-sm text-success-700 mb-1">累计收益率</div>
            <div class="text-3xl font-bold text-success-600">25%</div>
            <div class="text-sm text-success-600 mt-1">+25,000 USDT</div>
          </div>

          <!-- 交易指标 -->
          <div class="space-y-3">
            <div class="text-sm font-medium text-gray-700 mb-2">交易指标</div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">夏普比率</span>
              <span class="text-sm font-semibold text-gray-900">1.82</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">最大回撤</span>
              <span class="text-sm font-semibold text-danger-600">-12.50%</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">胜率</span>
              <span class="text-sm font-semibold text-gray-900">68%</span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">盈亏比</span>
              <span class="text-sm font-semibold text-gray-900">2.5:1</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：图表区域 -->
      <div class="lg:col-span-3">
        <!-- 图表容器 -->
        <div class="h-72 mb-4 bg-gray-50 rounded-lg p-4">
          <Line :data="chartData" :options="chartOptions" />
        </div>

        <!-- 每日盈亏柱状图区域 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm font-medium text-gray-700">每日盈亏</div>
            <div class="flex items-center space-x-4 text-xs">
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-success-500 rounded-sm"></div>
                <span class="text-gray-600">盈利</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-danger-500 rounded-sm"></div>
                <span class="text-gray-600">亏损</span>
              </div>
            </div>
          </div>
          <div class="h-20 bg-white rounded flex items-end justify-center space-x-1 p-2">
            <p class="text-xs text-gray-400">每日盈亏柱状图开发中...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { ArrowUpIcon } from '@heroicons/vue/24/outline';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const chartData = {
  labels: ['09-08', '09-15', '09-22', '09-29', '10-06', '10-13', '10-20', '10-27'],
  datasets: [
    {
      label: '净值',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderColor: '#0ea5e9',
      data: [100000, 105000, 108000, 106500, 112000, 118000, 122000, 125000],
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#0ea5e9',
      pointBorderColor: '#0ea5e9',
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#6b7280',
      borderColor: '#e5e7eb',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(229, 231, 235, 0.8)',
        display: true,
      },
      ticks: {
        color: '#9ca3af',
      },
    },
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(229, 231, 235, 0.8)',
        display: true,
      },
      ticks: {
        color: '#9ca3af',
        callback: function(value) {
          return '$' + value.toLocaleString();
        },
      },
    },
  },
};
</script>

