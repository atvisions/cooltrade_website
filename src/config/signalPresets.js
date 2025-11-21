/**
 * 信号机器人快捷模式预设
 * 为小白用户提供专业的预设策略
 */

export const SIGNAL_PRESETS = {
  trend_following: {
    id: 'trend_following',
    name: '趋势跟踪',
    description: '适合捕捉中长期趋势，信号稳定但较少',
    icon: '📈',
    difficulty: 'beginner',
    indicators_config: {
      indicators: [
        {
          type: 'ema_cross',
          enabled: true,
          weight: 40,
          params: { fast: 9, slow: 21 }
        },
        {
          type: 'macd',
          enabled: true,
          weight: 30,
          params: { fast: 12, slow: 26, signal: 9 }
        },
        {
          type: 'adx',
          enabled: true,
          weight: 30,
          params: { period: 14, threshold: 25 }
        }
      ],
      trigger_threshold: 70,
      require_all: false
    },
    timeframes_config: {
      primary: '4h',
      confirm: ['1d'],
      require_all_confirm: false,
      min_confirm_count: 1
    },
    signal_confirmation_bars: 2,
    signal_expiration_hours: 48,
    signal_strength_threshold: 65
  },

  reversal: {
    id: 'reversal',
    name: '反转交易',
    description: '适合捕捉超买超卖反转，信号频繁但风险较高',
    icon: '🔄',
    difficulty: 'advanced',
    indicators_config: {
      indicators: [
        {
          type: 'rsi',
          enabled: true,
          weight: 40,
          params: { period: 14, overbought: 70, oversold: 30 }
        },
        {
          type: 'bollinger',
          enabled: true,
          weight: 30,
          params: { period: 20, std_dev: 2 }
        },
        {
          type: 'stochastic',
          enabled: true,
          weight: 30,
          params: { period: 14, overbought: 80, oversold: 20 }
        }
      ],
      trigger_threshold: 65,
      require_all: false
    },
    timeframes_config: {
      primary: '1h',
      confirm: ['4h'],
      require_all_confirm: false,
      min_confirm_count: 1
    },
    signal_confirmation_bars: 1,
    signal_expiration_hours: 12,
    signal_strength_threshold: 60
  },

  breakout: {
    id: 'breakout',
    name: '突破交易',
    description: '适合捕捉价格突破，平衡信号质量和频率',
    icon: '🚀',
    difficulty: 'intermediate',
    indicators_config: {
      indicators: [
        {
          type: 'bollinger',
          enabled: true,
          weight: 35,
          params: { period: 20, std_dev: 2 }
        },
        {
          type: 'volume',
          enabled: true,
          weight: 35,
          params: { threshold: 1.5 }
        },
        {
          type: 'rsi',
          enabled: true,
          weight: 30,
          params: { period: 14, overbought: 70, oversold: 30 }
        }
      ],
      trigger_threshold: 70,
      require_all: false
    },
    timeframes_config: {
      primary: '1h',
      confirm: ['4h'],
      require_all_confirm: false,
      min_confirm_count: 1
    },
    signal_confirmation_bars: 2,
    signal_expiration_hours: 24,
    signal_strength_threshold: 65
  },

  conservative: {
    id: 'conservative',
    name: '稳健模式',
    description: '多重确认，信号质量高但数量少',
    icon: '🛡️',
    difficulty: 'beginner',
    indicators_config: {
      indicators: [
        {
          type: 'ema_cross',
          enabled: true,
          weight: 25,
          params: { fast: 9, slow: 21 }
        },
        {
          type: 'macd',
          enabled: true,
          weight: 25,
          params: { fast: 12, slow: 26, signal: 9 }
        },
        {
          type: 'rsi',
          enabled: true,
          weight: 25,
          params: { period: 14, overbought: 70, oversold: 30 }
        },
        {
          type: 'volume',
          enabled: true,
          weight: 25,
          params: { threshold: 1.3 }
        }
      ],
      trigger_threshold: 80,
      require_all: false
    },
    timeframes_config: {
      primary: '4h',
      confirm: ['1d', '1w'],
      require_all_confirm: true,
      min_confirm_count: 2
    },
    signal_confirmation_bars: 3,
    signal_expiration_hours: 72,
    signal_strength_threshold: 75
  }
}

export const DIFFICULTY_LABELS = {
  beginner: '新手推荐',
  intermediate: '进阶',
  advanced: '高级'
}

