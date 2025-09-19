const API_BASE_URL = '/api'

export interface AssetInfo {
  regularMarketPrice?: number
  regularMarketChange?: number
  regularMarketChangePercent?: number
  previousClose?: number
  open?: number
  dayHigh?: number
  dayLow?: number
  volume?: number
  marketCap?: number
  trailingPE?: number
  priceToBook?: number
  dividendYield?: number
  trailingEps?: number
  bookValue?: number
  enterpriseToEbitda?: number
  pegRatio?: number
  returnOnEquity?: number
  returnOnAssets?: number
  profitMargins?: number
  debtToEquity?: number
  currentRatio?: number
  quickRatio?: number
  enterpriseValue?: number
  totalCash?: number
  totalDebt?: number
  totalRevenue?: number
  longName?: string
  shortName?: string
  currency?: string
  quoteType?: string
  sector?: string
  industry?: string
  longBusinessSummary?: string
  trailingAnnualDividendRate?: number
}

export interface AssetData {
  info: AssetInfo
  historico: any[]
}

export interface ChartData {
  imagem: string
}

// Buscar ativos por nome ou ticker
export const searchAssets = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pesquisar/${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('Erro na busca')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar ativos:', error)
    return []
  }
}

// Obter dados completos de um ativo
export const getAssetData = async (ticker: string): Promise<AssetData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dados/${encodeURIComponent(ticker)}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Erro ao obter dados do ativo')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao obter dados do ativo:', error)
    return null
  }
}

// Gerar gráfico de um ativo
export const getAssetChart = async (ticker: string, period: string = '1y'): Promise<ChartData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/grafico/${encodeURIComponent(ticker)}?periodo=${period}`)
    if (!response.ok) {
      throw new Error('Erro ao gerar gráfico')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao gerar gráfico:', error)
    return null
  }
}

// Formatar valores monetários
export const formatCurrency = (value: number | undefined, currency: string = 'BRL'): string => {
  if (value === undefined || value === null) return 'N/D'
  
  const currencyMap: { [key: string]: string } = {
    'BRL': 'R$',
    'USD': 'US$',
    'EUR': '€'
  }
  
  const symbol = currencyMap[currency] || currency
  
  if (Math.abs(value) >= 1e12) {
    return `${symbol} ${(value / 1e12).toFixed(2)} Tri`
  }
  if (Math.abs(value) >= 1e9) {
    return `${symbol} ${(value / 1e9).toFixed(2)} Bi`
  }
  if (Math.abs(value) >= 1e6) {
    return `${symbol} ${(value / 1e6).toFixed(2)} Mi`
  }
  
  return `${symbol} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Formatar percentuais
export const formatPercentage = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'N/D'
  return `${value.toFixed(2)}%`
}

// Formatar números grandes
export const formatNumber = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'N/D'
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Determinar cor da variação
export const getVariationColor = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'text-gray-400'
  return value >= 0 ? 'text-green-400' : 'text-red-400'
}

// Obter tipo de ativo em português
export const getAssetTypeInPortuguese = (quoteType: string | undefined): string => {
  const types: { [key: string]: string } = {
    'EQUITY': 'Ação',
    'CRYPTOCURRENCY': 'Criptomoeda',
    'CURRENCY': 'Moeda',
    'ETF': 'ETF',
    'INDEX': 'Índice',
    'MUTUALFUND': 'Fundo'
  }
  
  return types[quoteType || ''] || quoteType || 'N/D'
}