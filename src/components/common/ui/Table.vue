<template>
  <div class="w-full overflow-x-auto">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- 表格 -->
    <table v-else :class="['min-w-full divide-y divide-gray-200', customClass]">
      <thead class="bg-gray-50">
        <tr>
          <!-- 复选框列 -->
          <th v-if="selectable" scope="col" class="w-12 px-6 py-3">
            <input
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              @change="toggleSelectAll"
            />
          </th>

          <!-- 数据列 -->
          <th
            v-for="col in columns"
            :key="col.field"
            scope="col"
            :class="[
              'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            ]"
            :style="{ width: col.width }"
            @click="col.sortable && handleSort(col.field)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ col.header }}</span>
              <span v-if="col.sortable" class="text-gray-400">
                ↕
              </span>
            </div>
          </th>

          <!-- 操作列 -->
          <th v-if="$slots['col-actions']" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            操作
          </th>
        </tr>
      </thead>

      <tbody :class="['bg-white divide-y divide-gray-200', striped ? 'divide-y-0' : '']">
        <tr
          v-for="(row, index) in data"
          :key="index"
          :class="[
            hover ? 'hover:bg-gray-50 transition-colors' : '',
            striped && index % 2 === 1 ? 'bg-gray-50' : ''
          ]"
        >
          <!-- 复选框列 -->
          <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
            <input
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :checked="selectedRows.includes(row)"
              @change="toggleRow(row)"
            />
          </td>

          <!-- 数据列 -->
          <td
            v-for="col in columns"
            :key="col.field"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot :name="`col-${col.field}`" :row="row" :value="row[col.field]">
              {{ row[col.field] }}
            </slot>
          </td>

          <!-- 操作列 -->
          <td v-if="$slots['col-actions']" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <slot name="col-actions" :row="row"></slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 空状态 -->
    <div v-if="!loading && (!data || data.length === 0)" class="text-center py-12">
      <p class="text-gray-500">暂无数据</p>
    </div>

    <!-- 分页 -->
    <div v-if="paginator && data && data.length > 0" class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
      <div class="text-sm text-gray-700">
        显示 {{ (currentPage - 1) * rows + 1 }} 到 {{ Math.min(currentPage * rows, totalRecords) }} 条，共 {{ totalRecords }} 条
      </div>
      <div class="flex space-x-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= Math.ceil(totalRecords / rows)"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    default: () => []
  },
  // 是否分页
  paginator: Boolean,
  // 每页行数
  rows: {
    type: Number,
    default: 10
  },
  // 总记录数
  totalRecords: {
    type: Number,
    default: 0
  },
  // 加载状态
  loading: Boolean,
  // 条纹行
  striped: {
    type: Boolean,
    default: true
  },
  // 悬停高亮
  hover: {
    type: Boolean,
    default: true
  },
  // 可选择
  selectable: Boolean,
  // 自定义类名
  customClass: String
})

const emit = defineEmits(['page', 'rows', 'select', 'sort'])

// 当前页码
const currentPage = ref(1)

// 选中的行
const selectedRows = ref([])

// 切换全选
const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedRows.value = [...props.data]
  } else {
    selectedRows.value = []
  }
  emit('select', selectedRows.value)
}

// 切换单行选择
const toggleRow = (row) => {
  const index = selectedRows.value.indexOf(row)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(row)
  }
  emit('select', selectedRows.value)
}

// 排序处理
const handleSort = (field) => {
  emit('sort', field)
}

// 翻页
const goToPage = (page) => {
  if (page >= 1 && page <= Math.ceil(props.totalRecords / props.rows)) {
    currentPage.value = page
    emit('page', (page - 1) * props.rows)
  }
}
</script>
