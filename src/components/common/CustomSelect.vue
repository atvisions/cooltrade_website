<template>
  <div class="relative" ref="selectRef">
    <!-- 选择框 -->
    <button
      @click="toggleDropdown"
      :class="[
        'w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-lg text-sm transition-all',
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-100'
          : 'border-gray-200 hover:border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      :disabled="disabled"
    >
      <span class="flex items-center">
        <!-- 图标 -->
        <component
          v-if="selectedOption?.icon"
          :is="selectedOption.icon"
          class="w-4 h-4 mr-2 text-gray-500"
        />
        <!-- 文本 -->
        <span :class="selectedOption ? 'text-gray-900' : 'text-gray-500'">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>
      </span>
      <!-- 箭头 -->
      <svg
        :class="[
          'w-4 h-4 text-gray-400 transition-transform',
          isOpen ? 'rotate-180' : ''
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      >
        <!-- 搜索框 (可选) -->
        <div v-if="searchable" class="p-2 border-b border-gray-100">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索..."
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click.stop
          />
        </div>

        <!-- 选项列表 -->
        <div class="max-h-60 overflow-y-auto">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            @click="selectOption(option)"
            :class="[
              'w-full flex items-center px-4 py-2.5 text-sm text-left transition-colors',
              option.value === modelValue
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <!-- 选中标记 -->
            <span class="w-5 h-5 mr-2 flex items-center justify-center">
              <svg
                v-if="option.value === modelValue"
                class="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>

            <!-- 图标 -->
            <component
              v-if="option.icon"
              :is="option.icon"
              class="w-4 h-4 mr-2 text-gray-500"
            />

            <!-- 文本 -->
            <span>{{ option.label }}</span>

            <!-- 描述 (可选) -->
            <span v-if="option.description" class="ml-auto text-xs text-gray-400">
              {{ option.description }}
            </span>
          </button>

          <!-- 空状态 -->
          <div
            v-if="filteredOptions.length === 0"
            class="px-4 py-8 text-center text-sm text-gray-500"
          >
            {{ searchQuery ? '没有找到匹配的选项' : '暂无选项' }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    // options: [{ value: 'xxx', label: 'XXX', icon: Component, description: 'xxx' }]
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  searchable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// 状态
const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref(null)

// 当前选中的选项
const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options
  }
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query) ||
    (option.description && option.description.toLowerCase().includes(query))
  )
})

// 切换下拉菜单
const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

// 选择选项
const selectOption = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

// 点击外部关闭
const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

