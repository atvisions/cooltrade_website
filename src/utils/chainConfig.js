// 公链配置
export const chainConfig = {
  'Ethereum': {
    name: 'Ethereum',
    logo: '/chain_logos/eth.png',
    icon: 'Ξ',
    color: '#627EEA'
  },
  'BNB': {
    name: 'BNB Chain',
    logo: '/chain_logos/bnb.png',
    icon: '🟡',
    color: '#F3BA2F'
  },
  'Solana': {
    name: 'Solana',
    logo: '/chain_logos/solana.jpeg',
    icon: '◎',
    color: '#14F195'
  },
  'Avalanche': {
    name: 'Avalanche',
    logo: '/chain_logos/avax.png',
    icon: '🔺',
    color: '#E84142'
  },
  'Polygon': {
    name: 'Polygon',
    logo: '/chain_logos/polygon.jpeg',
    icon: '🟣',
    color: '#8247E5'
  },
  'Arbitrum': {
    name: 'Arbitrum',
    logo: '/chain_logos/arb.jpeg',
    icon: '🔵',
    color: '#28A0F0'
  },
  'Optimism': {
    name: 'Optimism',
    logo: '/chain_logos/op.png',
    icon: '🔴',
    color: '#FF0420'
  },
  'Base': {
    name: 'Base',
    logo: '/chain_logos/base.png',
    icon: '🔵',
    color: '#0052FF'
  },
  'Sui': {
    name: 'Sui',
    logo: '/chain_logos/sui.png',
    icon: '💧',
    color: '#6FBCF0'
  },
  'Fantom': {
    name: 'Fantom',
    logo: '/chain_logos/ftm.png',
    icon: '👻',
    color: '#1969FF'
  },
  'Cronos': {
    name: 'Cronos',
    logo: '/chain_logos/cro.jpeg',
    icon: '💎',
    color: '#002D74'
  },
  'Linea': {
    name: 'Linea',
    logo: '/chain_logos/linea.png',
    icon: '📏',
    color: '#121212'
  },
  'Manta': {
    name: 'Manta',
    logo: '/chain_logos/manta.jpeg',
    icon: '🦈',
    color: '#000000'
  },
  'zkSync': {
    name: 'zkSync',
    logo: '/chain_logos/zksync.jpeg',
    icon: '⚡',
    color: '#8C8DFC'
  },
  'Kadena': {
    name: 'Kadena',
    logo: '/chain_logos/kda.jpg',
    icon: '🔷',
    color: '#ED098F'
  },
  'Toncoin': {
    name: 'Toncoin',
    logo: '/chain_logos/ton.png',
    icon: '💎',
    color: '#0088CC'
  },
  'Hyperliquid': {
    name: 'Hyperliquid',
    logo: '/chain_logos/hyperliquid.png',
    icon: '🌊',
    color: '#00D4FF'
  },
  'IOST': {
    name: 'IOST',
    logo: '/chain_logos/iost.png',
    icon: '🔷',
    color: '#1C1C1C'
  }
}

// 交易所配置
export const exchangeConfig = {
  'binance': {
    name: 'Binance',
    logo: '/dex/binance.png',
    icon: '🟡',
    color: '#F3BA2F'
  },
  'okx': {
    name: 'OKX',
    logo: '/dex/okx.png',
    icon: '⚫',
    color: '#000000'
  },
  'bybit': {
    name: 'Bybit',
    logo: '/dex/bybit.png',
    icon: '🟡',
    color: '#F7A600'
  },
  'gate': {
    name: 'Gate.io',
    logo: '/dex/gate.png',
    icon: '🔵',
    color: '#2354E6'
  }
}

// 获取公链配置
export const getChainConfig = (chainName) => {
  return chainConfig[chainName] || {
    name: chainName,
    logo: null,
    icon: '🌐',
    color: '#6B7280'
  }
}

// 获取交易所配置
export const getExchangeConfig = (exchangeName) => {
  return exchangeConfig[exchangeName] || {
    name: exchangeName,
    logo: null,
    icon: '💱',
    color: '#6B7280'
  }
}

// 获取所有公链列表
export const getAllChains = () => {
  return Object.keys(chainConfig).map(key => ({
    value: key,
    ...chainConfig[key]
  }))
}

// 获取所有交易所列表
export const getAllExchanges = () => {
  return Object.keys(exchangeConfig).map(key => ({
    value: key,
    ...exchangeConfig[key]
  }))
}

