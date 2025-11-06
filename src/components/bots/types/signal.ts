/**
 * 信号类型定义
 */

export interface Signal {
  id: number
  bot: number
  bot_name: string
  token_symbol: string
  signal_type: 'buy' | 'sell' | 'price_alert' | 'rsi' | 'ma_crossover' | 'volume'
  price: number
  timestamp: string
  created_at: string
  is_sent: boolean
  sent_at?: string
  email_sent: boolean
  app_sent: boolean
  description?: string
}

export interface SignalListResponse {
  count: number
  next?: string
  previous?: string
  results: Signal[]
}

export interface SignalFilter {
  bot_id?: number
  signal_type?: string
  date_from?: string
  date_to?: string
  is_sent?: boolean
}

export interface SignalStats {
  total_signals: number
  today_signals: number
  sent_signals: number
  unsent_signals: number
  avg_response_time: number
  signal_type_distribution: Record<string, number>
}

export interface SignalNotification {
  id: number
  signal: number
  user: number
  notification_type: 'email' | 'app' | 'sms'
  is_sent: boolean
  sent_at?: string
  error_message?: string
}

export interface SignalAlert {
  id: number
  bot: number
  alert_type: 'price' | 'volume' | 'indicator'
  condition: string
  threshold: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SignalHistory {
  date: string
  signal_count: number
  sent_count: number
  failed_count: number
  avg_response_time: number
}

export interface SignalTypeDistribution {
  type: string
  count: number
  percentage: number
}

export interface SignalPerformance {
  signal_type: string
  total_signals: number
  successful_signals: number
  success_rate: number
  avg_profit: number
  max_profit: number
  min_profit: number
}

