import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Calendar,
  Info,
  Activity,
  PieChart,
  Loader
} from 'lucide-react'
import { getAssetData, getAssetChart, formatCurrency, formatPercentage, formatNumber, getVariationColor, getAssetTypeInPortuguese } from '../services/api'
import type { AssetData } from '../services/api'

const AssetDetails = () => {
  const { ticker } = useParams<{ ticker: string }>()
  const [assetData, setAssetData] = useState<AssetData | null>(null)
  const [chartData, setChartData] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('1y')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const periods = [
    { value: '5d', label: '5D' },
    { value: '1m', label: '1M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1A' },
    { value: '5y', label: '5A' },
    { value: 'max', label: 'Máx' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (!ticker) return

      setLoading(true)
      setError(null)

      try {
        const [data, chart] = await Promise.all([
          getAssetData(ticker),
          getAssetChart(ticker, selectedPeriod)
        ])

        if (!data) {
          setError('Ativo não encontrado')
          return
        }

        setAssetData(data)
        setChartData(chart?.imagem || null)
      } catch (err) {
        setError('Erro ao carregar dados do ativo')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ticker, selectedPeriod])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando dados do ativo...</p>
        </div>
      </div>
    )
  }

  if (error || !assetData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar ativo</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  const { info } = assetData
  const assetName = info.longName || info.shortName || 'Nome não disponível'
  const currentPrice = info.regularMarketPrice
  const change = info.regularMarketChange
  const changePercent = info.regularMarketChangePercent
  const currency = info.currency || 'BRL'
  const assetType = getAssetTypeInPortuguese(info.quoteType)

  // Calcular variação percentual se não estiver disponível
  const calculatedChangePercent = changePercent || (change && info.previousClose ? (change / info.previousClose) * 100 : undefined)

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {ticker?.replace('.SA', '')} - {assetName}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{assetType}</span>
                <span>•</span>
                <span>{info.sector || 'Setor não disponível'}</span>
                {info.industry && (
                  <>
                    <span>•</span>
                    <span>{info.industry}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-white">
                {formatCurrency(currentPrice, currency)}
              </div>
              <div className={`text-lg font-medium flex items-center justify-end ${getVariationColor(calculatedChangePercent)}`}>
                {calculatedChangePercent && calculatedChangePercent >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-1" />
                )}
                {formatPercentage(calculatedChangePercent)} ({formatCurrency(change, currency)})
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">Histórico de Preços</h2>
                <div className="flex flex-wrap gap-2">
                  {periods.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setSelectedPeriod(period.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {chartData ? (
                <div className="w-full">
                  <img
                    src={chartData}
                    alt={`Gráfico de ${ticker}`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-dark-700 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">Gráfico não disponível</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Informações do Dia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-400" />
                Informações do Dia
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Abertura:</span>
                  <span className="text-white font-medium">{formatCurrency(info.open, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mínima:</span>
                  <span className="text-white font-medium">{formatCurrency(info.dayLow, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Máxima:</span>
                  <span className="text-white font-medium">{formatCurrency(info.dayHigh, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fech. anterior:</span>
                  <span className="text-white font-medium">{formatCurrency(info.previousClose, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-white font-medium">{formatNumber(info.volume)}</span>
                </div>
              </div>
            </div>

            {/* Indicadores Fundamentalistas (apenas para ações) */}
            {info.quoteType === 'EQUITY' && (
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-primary-400" />
                  Indicadores
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">P/L:</span>
                    <span className="text-white font-medium">{formatNumber(info.trailingPE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">P/VP:</span>
                    <span className="text-white font-medium">{formatNumber(info.priceToBook)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dividend Yield:</span>
                    <span className="text-white font-medium">
                      {formatPercentage(info.dividendYield ? info.dividendYield * 100 : undefined)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROE:</span>
                    <span className="text-white font-medium">
                      {formatPercentage(info.returnOnEquity ? info.returnOnEquity * 100 : undefined)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROA:</span>
                    <span className="text-white font-medium">
                      {formatPercentage(info.returnOnAssets ? info.returnOnAssets * 100 : undefined)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Valuation */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-primary-400" />
                Valuation
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor de Mercado:</span>
                  <span className="text-white font-medium">{formatCurrency(info.marketCap, currency)}</span>
                </div>
                {info.enterpriseValue && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Enterprise Value:</span>
                    <span className="text-white font-medium">{formatCurrency(info.enterpriseValue, currency)}</span>
                  </div>
                )}
                {info.totalRevenue && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Receita Total:</span>
                    <span className="text-white font-medium">{formatCurrency(info.totalRevenue, currency)}</span>
                  </div>
                )}
                {info.totalCash && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Caixa Total:</span>
                    <span className="text-white font-medium">{formatCurrency(info.totalCash, currency)}</span>
                  </div>
                )}
                {info.totalDebt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dívida Total:</span>
                    <span className="text-white font-medium">{formatCurrency(info.totalDebt, currency)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Descrição da Empresa */}
        {info.longBusinessSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary-400" />
                Sobre a Empresa
              </h3>
              <p className="text-gray-300 leading-relaxed">{info.longBusinessSummary}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AssetDetails