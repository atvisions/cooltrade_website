<template>
  <div class="w-full">
    <TabGroup :selected-index="activeIndex" @change="$emit('update:activeIndex', $event)">
      <TabList :class="['flex space-x-1 rounded-xl bg-slate-100 p-1', customClass]">
        <Tab
          v-for="(tab, index) in tabs"
          :key="index"
          v-slot="{ selected }"
          as="template"
        >
          <button
            :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-100',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-slate-600 hover:bg-white/[0.5] hover:text-slate-900'
            ]"
          >
            {{ tab.label }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-4">
        <TabPanel
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'rounded-xl bg-white p-4',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          ]"
        >
          <slot :name="`tab-${index}`" :tab="tab">
            {{ tab.content }}
          </slot>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

const props = defineProps({
  // 标签页列表
  tabs: {
    type: Array,
    default: () => []
  },
  // 活跃标签页索引
  activeIndex: {
    type: Number,
    default: 0
  },
  // 自定义类名
  customClass: String
})

defineEmits(['update:activeIndex'])
</script>
