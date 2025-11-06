<template>
  <!-- 浮动侧边栏 -->
  <aside class="w-full bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24" style="overflow: visible;">
    <!-- 用户信息卡片 -->
    <div class="p-6 bg-blue-50 border-b border-gray-200 rounded-t-2xl">
      <div class="flex items-center space-x-4">
        <!-- 用户头像 -->
        <div class="w-16 h-16 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center flex-shrink-0 ring-4 ring-white">
          <img v-if="userStore.userAvatar.value" :src="userStore.userAvatar.value" :alt="userStore.username.value" class="w-full h-full object-cover" />
          <span v-else class="text-white font-bold text-xl">{{ userStore.userInitial.value }}</span>
        </div>

        <!-- 用户信息 -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 truncate">{{ userStore.username.value }}</h3>
          <p class="text-sm text-gray-600 truncate">{{ userStore.userEmail.value }}</p>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="p-4">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.id" class="relative">
          <!-- 主菜单项 -->
          <div>
            <router-link
              v-if="!item.children"
              :to="item.path"
              :class="[
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                isActive(item.id)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <!-- 左侧蓝色圆弧指示器 -->
              <div
                v-if="isActive(item.id)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"
              ></div>

              <component
                :is="item.icon"
                :class="[
                  'w-5 h-5 mr-3 flex-shrink-0',
                  isActive(item.id) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                ]"
              />
              <span>{{ item.name }}</span>

              <!-- 徽章 -->
              <span
                v-if="item.badge"
                :class="[
                  'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full',
                  isActive(item.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-red-100 text-red-600'
                ]"
              >
                {{ item.badge }}
              </span>
            </router-link>

            <!-- 有子菜单的项 -->
            <div v-else>
              <button
                @click="toggleSubmenu(item.id)"
                :class="[
                  'w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                  isActive(item.id) || isSubmenuActive(item)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <!-- 左侧蓝色圆弧指示器 -->
                <div
                  v-if="isActive(item.id) || isSubmenuActive(item)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"
                ></div>

                <component
                  :is="item.icon"
                  :class="[
                    'w-5 h-5 mr-3 flex-shrink-0',
                    isActive(item.id) || isSubmenuActive(item) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  ]"
                />
                <span>{{ item.name }}</span>

                <!-- 展开/收起图标 -->
                <svg
                  :class="[
                    'w-4 h-4 ml-auto transition-transform',
                    expandedMenus.includes(item.id) ? 'rotate-180' : ''
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- 子菜单 -->
              <ul
                v-show="expandedMenus.includes(item.id)"
                class="mt-1 ml-4 space-y-1"
              >
                <li v-for="child in item.children" :key="child.id">
                  <!-- 没有子菜单的二级菜单项 -->
                  <router-link
                    v-if="!child.children"
                    :to="child.path"
                    :class="[
                      'flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 relative',
                      isActive(child.id)
                        ? 'text-blue-600 font-medium bg-gradient-to-r from-blue-50 to-transparent border-l-2 border-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <component
                      v-if="child.icon"
                      :is="child.icon"
                      :class="[
                        'w-4 h-4 mr-3 flex-shrink-0',
                        isActive(child.id) ? 'text-blue-600' : 'text-gray-400'
                      ]"
                    />
                    <span v-else class="w-1.5 h-1.5 rounded-full bg-current mr-3"></span>
                    {{ child.name }}
                  </router-link>

                  <!-- 有子菜单的二级菜单项 -->
                  <div v-else>
                    <button
                      @click="toggleSubmenu(child.id)"
                      :class="[
                        'w-full flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 relative',
                        isActive(child.id) || isSubmenuActive(child)
                          ? 'text-blue-600 font-medium bg-gradient-to-r from-blue-50 to-transparent'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      ]"
                    >
                      <component
                        v-if="child.icon"
                        :is="child.icon"
                        :class="[
                          'w-4 h-4 mr-3 flex-shrink-0',
                          isActive(child.id) || isSubmenuActive(child) ? 'text-blue-600' : 'text-gray-400'
                        ]"
                      />
                      <span>{{ child.name }}</span>

                      <!-- 展开/收起图标 -->
                      <svg
                        :class="[
                          'w-3 h-3 ml-auto transition-transform',
                          expandedMenus.includes(child.id) ? 'rotate-180' : ''
                        ]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <!-- 三级菜单 -->
                    <ul
                      v-show="expandedMenus.includes(child.id)"
                      class="mt-1 ml-4 space-y-1"
                    >
                      <li v-for="grandchild in child.children" :key="grandchild.id">
                        <router-link
                          :to="grandchild.path"
                          :class="[
                            'flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 relative',
                            isActive(grandchild.id)
                              ? 'text-blue-600 font-medium bg-blue-50'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          ]"
                        >
                          <component
                            v-if="grandchild.icon"
                            :is="grandchild.icon"
                            :class="[
                              'w-3 h-3 mr-2 flex-shrink-0',
                              isActive(grandchild.id) ? 'text-blue-600' : 'text-gray-400'
                            ]"
                          />
                          <span v-else class="w-1 h-1 rounded-full bg-current mr-2"></span>
                          {{ grandchild.name }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>

    <!-- 我的积分 -->
    <div class="px-4 pb-4">
      <router-link
        to="/points"
        class="block px-4 py-3 rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-orange-100 hover:border-orange-200 hover:shadow-sm transition-all duration-200 group"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="relative">
              <!-- 金币图标 -->
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <!-- 闪光效果 -->
              <div class="absolute -top-0.5 -right-0.5 w-2 h-2">
                <SparklesIcon class="w-2 h-2 text-amber-400" />
              </div>
            </div>
            <span class="text-xs font-medium text-gray-600">我的积分</span>
          </div>
          <svg class="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
        <div class="flex items-baseline space-x-1">
          <span class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{{ userPoints }}</span>
          <span class="text-xs text-gray-500">积分</span>
        </div>
      </router-link>
    </div>

    <!-- 底部快捷操作 -->
    <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
      <a
        href="/profile/me"
        target="_blank"
        class="flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        查看我的主页
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../utils/userStore.js'
import { apiRequest, API_ENDPOINTS } from '../../utils/api.js'
import {
  HomeIcon,
  Cog6ToothIcon,
  BellIcon,
  ChartBarIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  BuildingLibraryIcon,
  CpuChipIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ScaleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

// Props
const props = defineProps({
  activeItem: {
    type: String,
    default: 'dashboard'
  }
})

// 使用全局用户状态
const userStore = useUserStore()

// 积分数据
const userPoints = ref(0)

// 展开的菜单
const expandedMenus = ref([]) // 默认收起所有子菜单

// 加载积分信息
const loadPoints = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.INVITATION_INFO, {
      method: 'GET'
    })

    if (response.status === 'success') {
      userPoints.value = response.data.points
    }
  } catch (error) {
    console.error('加载积分信息失败:', error)
  }
}

// 页面加载时获取积分
onMounted(() => {
  loadPoints()
})

// 菜单项配置
const menuItems = ref([
  {
    id: 'dashboard',
    name: '仪表板',
    path: '/dashboard',
    icon: HomeIcon,
    badge: null
  },
  {
    id: 'exchanges',
    name: '我的交易所',
    path: '/exchanges',
    icon: BuildingLibraryIcon,
    badge: null
  },
  {
    id: 'signal-bots',
    name: '信号机器人',
    path: '/signal-bots',
    icon: BellIcon,
    badge: null
  },
  {
    id: 'bots',
    name: '趋势跟踪机器人',
    path: '/bots',
    icon: ArrowTrendingUpIcon,
    badge: null
  },
  {
    id: 'ai-strategy',
    name: '策略生成器',
    path: '/ai-strategy',
    icon: SparklesIcon,
    badge: null
  },
  {
    id: 'trading',
    name: '交易中心',
    path: '/trading',
    icon: ChartBarIcon,
    badge: null
  },
  {
    id: 'membership',
    name: '会员中心',
    path: '/membership',
    icon: StarIcon,
    badge: null
  },
  {
    id: 'notifications',
    name: '通知',
    path: '/notifications',
    icon: BellIcon,
    badge: '8'
  },
  {
    id: 'settings',
    name: '设置',
    path: '/settings',
    icon: Cog6ToothIcon,
    badge: null
  }
])

// 切换子菜单展开/收起
const toggleSubmenu = (itemId) => {
  const index = expandedMenus.value.indexOf(itemId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(itemId)
  }
}

// 判断子菜单是否有激活项
const isSubmenuActive = (item) => {
  if (!item.children) return false
  return item.children.some(child => isActive(child.id))
}

// 判断是否激活
const isActive = (itemId) => {
  // 优先使用props传入的activeItem
  if (props.activeItem) {
    return props.activeItem === itemId
  }

  // 否则根据路由判断
  const currentPath = route.path
  const currentQuery = route.query

  // 查找主菜单项
  let item = menuItems.value.find(i => i.id === itemId)

  // 如果没找到，在子菜单中查找
  if (!item) {
    for (const menuItem of menuItems.value) {
      if (menuItem.children) {
        item = menuItem.children.find(child => child.id === itemId)
        if (item) break
      }
    }
  }

  if (!item) return false

  // 精确匹配路径
  const itemPath = item.path.split('?')[0]
  if (currentPath !== itemPath) return false

  // 如果菜单项有查询参数，需要匹配
  if (item.path.includes('?')) {
    const queryString = item.path.split('?')[1]
    const params = new URLSearchParams(queryString)
    for (const [key, value] of params) {
      if (currentQuery[key] !== value) return false
    }
    return true
  }

  // 如果菜单项没有查询参数，但当前路由有查询参数，则不匹配
  // 这样可以避免 /bots 和 /bots?type=signal 都高亮
  if (Object.keys(currentQuery).length > 0) {
    return false
  }

  return true
}

// 检查并自动展开包含激活项的子菜单
const checkAndExpandActiveSubmenu = () => {
  menuItems.value.forEach(item => {
    if (item.children && isSubmenuActive(item)) {
      // 如果子菜单中有激活项，且当前未展开，则展开
      if (!expandedMenus.value.includes(item.id)) {
        expandedMenus.value.push(item.id)
      }
    }
  })
}

onMounted(() => {
  // 初始化时加载用户信息
  userStore.loadUserFromStorage()
  // 检查并展开包含激活项的子菜单
  checkAndExpandActiveSubmenu()
})

// 监听路由变化，自动展开包含激活项的子菜单
watch(() => route.path, () => {
  checkAndExpandActiveSubmenu()
})
</script>

<style scoped>
/* 侧边栏样式 */
aside {
  position: sticky;
  top: 5rem;
}
</style>

