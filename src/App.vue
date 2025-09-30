<template>
  <div id="app">
    <router-view />
    <!-- 全局通知组件 -->
    <GlobalNotification />
  </div>
</template>

<script setup>
import GlobalNotification from './components/common/GlobalNotification.vue'
// 主应用组件，使用路由系统
</script>

<style>
/* 全局样式 */
</style>
