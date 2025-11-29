/**
 * WebSocket 实时数据管理工具
 * 用于连接后端 WebSocket 服务，接收实时市场数据
 */

// WebSocket 连接状态
export const WebSocketState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}

/**
 * WebSocket 管理类
 */
class WebSocketManager {
  constructor() {
    this.connections = new Map() // symbol -> WebSocket
    this.callbacks = new Map()   // symbol -> Set<callback>
    this.reconnectTimers = new Map() // symbol -> timer
    this.reconnectAttempts = new Map() // symbol -> count
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000 // 3秒
  }

  /**
   * 获取 WebSocket URL
   */
  getWebSocketURL(symbol) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.hostname
    const port = import.meta.env.VITE_WS_PORT || '8001'
    return `${protocol}//${host}:${port}/ws/market/${symbol}/`
  }

  /**
   * 连接到指定代币的 WebSocket
   */
  connect(symbol, callback) {
    // 如果已经连接，直接添加回调
    if (this.connections.has(symbol)) {
      this.addCallback(symbol, callback)
      return
    }

    const url = this.getWebSocketURL(symbol)
    console.log(`🔌 连接 WebSocket: ${symbol} -> ${url}`)

    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log(`✅ WebSocket 已连接: ${symbol}`)
        this.reconnectAttempts.set(symbol, 0)
        
        // 发送心跳
        this.startHeartbeat(symbol, ws)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(symbol, data)
        } catch (err) {
          console.error(`❌ 解析 WebSocket 消息失败:`, err)
        }
      }

      ws.onerror = (error) => {
        console.error(`❌ WebSocket 错误 (${symbol}):`, error)
      }

      ws.onclose = () => {
        console.log(`🔌 WebSocket 已断开: ${symbol}`)
        this.connections.delete(symbol)
        
        // 尝试重连
        this.reconnect(symbol)
      }

      this.connections.set(symbol, ws)
      this.addCallback(symbol, callback)

    } catch (err) {
      console.error(`❌ 创建 WebSocket 连接失败 (${symbol}):`, err)
    }
  }

  /**
   * 断开连接
   */
  disconnect(symbol, callback = null) {
    // 如果指定了回调，只移除该回调
    if (callback) {
      this.removeCallback(symbol, callback)
      
      // 如果还有其他回调，不断开连接
      const callbacks = this.callbacks.get(symbol)
      if (callbacks && callbacks.size > 0) {
        return
      }
    }

    // 清除重连定时器
    const timer = this.reconnectTimers.get(symbol)
    if (timer) {
      clearTimeout(timer)
      this.reconnectTimers.delete(symbol)
    }

    // 断开 WebSocket
    const ws = this.connections.get(symbol)
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(`🔌 断开 WebSocket: ${symbol}`)
      ws.close()
    }

    this.connections.delete(symbol)
    this.callbacks.delete(symbol)
    this.reconnectAttempts.delete(symbol)
  }

  /**
   * 添加回调函数
   */
  addCallback(symbol, callback) {
    if (!this.callbacks.has(symbol)) {
      this.callbacks.set(symbol, new Set())
    }
    this.callbacks.get(symbol).add(callback)
  }

  /**
   * 移除回调函数
   */
  removeCallback(symbol, callback) {
    const callbacks = this.callbacks.get(symbol)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  /**
   * 处理接收到的消息
   */
  handleMessage(symbol, data) {
    const callbacks = this.callbacks.get(symbol)
    if (!callbacks) return

    // 调用所有回调函数
    callbacks.forEach(callback => {
      try {
        callback(data)
      } catch (err) {
        console.error(`❌ 回调函数执行失败:`, err)
      }
    })
  }

  /**
   * 启动心跳
   */
  startHeartbeat(symbol, ws) {
    const heartbeatInterval = 30000 // 30秒

    const sendHeartbeat = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
        setTimeout(sendHeartbeat, heartbeatInterval)
      }
    }

    setTimeout(sendHeartbeat, heartbeatInterval)
  }

  /**
   * 重连
   */
  reconnect(symbol) {
    const attempts = this.reconnectAttempts.get(symbol) || 0

    if (attempts >= this.maxReconnectAttempts) {
      console.log(`❌ WebSocket 重连失败，已达到最大重试次数: ${symbol}`)
      return
    }

    console.log(`🔄 WebSocket 将在 ${this.reconnectDelay}ms 后重连 (${attempts + 1}/${this.maxReconnectAttempts}): ${symbol}`)

    const timer = setTimeout(() => {
      this.reconnectAttempts.set(symbol, attempts + 1)

      // 获取所有回调
      const callbacks = this.callbacks.get(symbol)
      if (callbacks && callbacks.size > 0) {
        // 重新连接
        const firstCallback = callbacks.values().next().value
        this.connect(symbol, firstCallback)
      }
    }, this.reconnectDelay)

    this.reconnectTimers.set(symbol, timer)
  }

  /**
   * 断开所有连接
   */
  disconnectAll() {
    console.log('🔌 断开所有 WebSocket 连接')
    this.connections.forEach((ws, symbol) => {
      this.disconnect(symbol)
    })
  }
}

// 创建全局单例
const wsManager = new WebSocketManager()

// 导出管理器
export default wsManager

/**
 * Vue 组合式 API Hook
 * 用于在 Vue 组件中使用 WebSocket
 */
export function useWebSocket(symbol, onMessage) {
  const connect = () => {
    wsManager.connect(symbol, onMessage)
  }

  const disconnect = () => {
    wsManager.disconnect(symbol, onMessage)
  }

  return {
    connect,
    disconnect
  }
}

