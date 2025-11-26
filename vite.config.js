import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  define: {
    // Vue feature flags
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 生产环境关闭 sourcemap
    rollupOptions: {
      output: {
        // 代码分割优化
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'axios'],
          'ui': ['primevue'],
          'charts': ['chart.js', 'vue-chartjs', 'lightweight-charts']
        }
      }
    },
    // 使用 esbuild 压缩（更快）
    minify: 'esbuild',
    target: 'es2020'
  },
  // CloudFront 使用根路径
  base: '/',
})