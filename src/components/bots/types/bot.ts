/**
 * 机器人类型定义
 */

export interface Bot {
  id: number
  user: number
  name: string
  bot_type: 'signal' | 'trend_following'
  description?: string
  token: Token
  exchange_api: ExchangeAPI
  trading_pair: string
  timeframe: string
  status: 'running' | 'paused' | 'stopped'
  is_active: boolean
  created_at: string
  updated_at: string
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_profit: number
  profit_rate: number
}

export interface SignalBot extends Bot {
  bot_type: 'signal'
  signal_type: string
  notify_email: boolean
  notify_app: boolean
  check_interval: number
}

export interface TrendFollowingBot extends Bot {
  bot_type: 'trend_following'
  max_position_size: number
  stop_loss_percentage: number
  take_profit_percentage?: number
  take_profit_targets?: number
  trailing_stop_enabled?: boolean
  trailing_stop_percentage?: number
  breakeven_enabled?: boolean
  breakeven_percentage?: number
  entry_order_type: string
  exit_order_type: string
  amount_type: string
  amount_value: number
}

export interface Token {
  id: number
  symbol: string
  name: string
  logo?: string
  market_cap?: number
  price?: number
}

export interface ExchangeAPI {
  id: number
  exchange: string
  exchange_display: string
  api_key: string
  api_secret: string
  is_active: boolean
}

export interface BotFilter {
  status?: 'all' | 'running' | 'paused' | 'stopped'
  exchange?: string
  search?: string
  bot_type?: 'all' | 'signal' | 'trend_following'
}

export interface BotStats {
  total_bots: number
  active_bots: number
  paused_bots: number
  stopped_bots: number
  total_trades: number
  winning_trades: number
  losing_trades: number
  win_rate: number
  total_profit: number
  profit_rate: number
}

export interface BotListResponse {
  count: number
  next?: string
  previous?: string
  results: Bot[]
}

export interface CreateBotPayload {
  name: string
  description?: string
  exchange_api: number
  token: number
  trading_pair: string
  timeframe: string
  bot_type: 'signal' | 'trend_following'
  // Signal Bot 特定字段
  signal_type?: string
  notify_email?: boolean
  notify_app?: boolean
  check_interval?: number
  // Trend Following Bot 特定字段
  max_position_size?: number
  stop_loss_percentage?: number
  take_profit_percentage?: number
  take_profit_targets?: number
  trailing_stop_enabled?: boolean
  trailing_stop_percentage?: number
  breakeven_enabled?: boolean
  breakeven_percentage?: number
  entry_order_type?: string
  exit_order_type?: string
  amount_type?: string
  amount_value?: number
}

export interface UpdateBotPayload extends Partial<CreateBotPayload> {
  id: number
}

