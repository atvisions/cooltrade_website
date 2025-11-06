<template>
  <div class="relative" ref="dropdownRef">
    <!-- 触发按钮 -->
    <button
      type="button"
      @click="toggleDropdown"
      :class="[
        'w-full px-4 py-3 text-left border rounded-lg transition-all flex items-center justify-between text-base',
        isOpen
          ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
          : 'border-gray-300 hover:border-gray-400',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'
      ]"
      :disabled="disabled"
    >
      <span :class="selectedOption ? 'text-gray-900 font-medium' : 'text-gray-500'">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <svg
        :class="['w-5 h-5 text-gray-400 transition-transform', isOpen ? 'rotate-180' : '']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
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
        v-if="isOpen"
        :class="[
          'absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto',
          dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        ]"
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          :class="[
            'px-4 py-3 cursor-pointer transition-colors flex items-center border-b border-gray-100 last:border-b-0',
            option.value === modelValue
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-900 hover:bg-gray-50'
          ]"
        >
          <!-- 选中标记 -->
          <svg
            v-if="option.value === modelValue"
            class="w-5 h-5 mr-2 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span :class="option.value === modelValue ? 'font-semibold' : 'font-normal'">
            {{ option.label }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    // 格式: [{ value: 'USDT', label: 'USDT' }, ...]
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)
const dropdownPosition = ref('bottom') // 'top' or 'bottom'

// 当前选中的选项
const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

// 计算下拉菜单应该向上还是向下展开
const calculateDropdownPosition = () => {
  if (!dropdownRef.value) return

  const rect = dropdownRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = 256 + 16 // max-h-64 (256px) + margin (16px)

  // 如果下方空间不足且上方空间更多，则向上展开
  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdownPosition.value = 'top'
  } else {
    dropdownPosition.value = 'bottom'
  }
}

// 切换下拉菜单
const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      // 下一帧计算位置，确保DOM已更新
      setTimeout(calculateDropdownPosition, 0)
    }
  }
}

// 选择选项
const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

