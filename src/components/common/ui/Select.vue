<template>
  <div class="w-full">
    <!-- 标签 -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- HeadlessUI Listbox -->
    <Listbox
      :model-value="modelValue"
      @update:model-value="handleChange"
      :disabled="disabled || loading"
    >
      <div class="relative">
        <ListboxButton
          :class="[
            'relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border transition-colors',
            error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500',
            disabled || loading ? 'bg-slate-50 cursor-not-allowed' : 'hover:border-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            customClass
          ]"
        >
          <span v-if="loading" class="block truncate text-slate-500">
            加载中...
          </span>
          <span v-else-if="selectedOption" class="block truncate text-slate-900">
            {{ selectedOption[optionLabel] }}
          </span>
          <span v-else class="block truncate text-slate-500">
            {{ placeholder || '请选择' }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <ListboxOption
              v-for="option in options"
              :key="option[optionValue]"
              :value="option[optionValue]"
              v-slot="{ active, selected }"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-blue-50 text-blue-900' : 'text-slate-900',
                  'relative cursor-pointer select-none py-2.5 pl-10 pr-4'
                ]"
              >
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                  {{ option[optionLabel] }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>

    <!-- 错误提示 -->
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>

    <!-- 帮助文本 -->
    <p v-if="hint && !error" class="mt-1 text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  // 绑定值
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  // 选项列表
  options: {
    type: Array,
    default: () => []
  },
  // 选项标签字段
  optionLabel: {
    type: String,
    default: 'label'
  },
  // 选项值字段
  optionValue: {
    type: String,
    default: 'value'
  },
  // 标签
  label: String,
  // 占位符
  placeholder: String,
  // 禁用
  disabled: Boolean,
  // 加载中
  loading: Boolean,
  // 必填
  required: Boolean,
  // 错误信息
  error: String,
  // 帮助文本
  hint: String,
  // 可搜索（暂不支持）
  filterable: Boolean,
  // 可清除（暂不支持）
  clearable: Boolean,
  // 自定义类名
  customClass: String,
  // ID
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substring(2, 11)}`
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

// 当前选中的选项
const selectedOption = computed(() => {
  return props.options.find(option => option[props.optionValue] === props.modelValue)
})

// 处理值变化
const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
