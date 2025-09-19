import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GitCompare, 
  Plus, 
  X, 
  TrendingUp,
  Search,
  BarChart3,
  Info
} from 'lucide-react'
import SearchBar from '../components/SearchBar'

const Compare = () => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [showAddAsset, setShowAddAsset] = useState(false)

  const addAsset = (ticker: string) => {
    if (selectedAssets.length < 4 && !selectedAssets.includes(ticker)) {
      setSelectedAssets([...selectedAssets, ticker])
      setShowAddAsset(false)
    }
  }

  const removeAsset = (ticker: string) => {
    setSelectedAssets(selectedAssets.filter(asset => asset !== ticker))
  }

  const clearAll = () => {
    setSelectedAssets([])
  }

  // Dados de exemplo para demonstração
  const assetData = {
    'PETR4.SA': {
      name: 'Petrobras',
      price: 'R$ 30,90',
      change: '-1,09%',
      isPositive: false,
      marketCap: 'R$ 402,1 Bi',
      pe: '4,2',
      dividendYield: '8,5%'
    },
    'VALE3.SA': {
      name: 'Vale',
      price: 'R$ 52,10',
      change: '-2,53%',
      isPositive: false,
      marketCap: 'R$ 245,8 Bi',
      pe: '3,8',
      dividendYield: '12,3%'
    },
    'ITUB4.SA': {
      name: 'Itaú Unibanco',
      price: 'R$ 37,41',
      change: '-0,16%',
      isPositive: false,
      marketCap: 'R$ 178,3 Bi',
      pe: '9,2',
      dividendYield: '6,8%'
    },
    'BBDC4.SA': {
      name: 'Banco Bradesco',
      price: 'R$ 16,20',
      change: '+0,75%',
      isPositive: true,
      marketCap: 'R$ 156,7 Bi',
      pe: '8,9',
      dividendYield: '7,2%'
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <GitCompare className="w-8 h-8 mr-3 text-primary-400" />
            Comparar Ativos
          </h1>
          <p className="text-gray-400">
            Compare até 4 ativos lado a lado para tomar decisões mais informadas
          </p>
        </motion.div>

        {/* Asset Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">
                Ativos Selecionados ({selectedAssets.length}/4)
              </h2>
              <div className="flex space-x-3">
                {selectedAssets.length < 4 && (
                  <button
                    onClick={() => setShowAddAsset(true)}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Ativo
                  </button>
                )}
                {selectedAssets.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpar Todos
                  </button>
                )}
              </div>
            </div>

            {/* Add Asset Modal */}
            {showAddAsset && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-dark-700 rounded-lg border border-dark-600"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Adicionar Ativo</h3>
                  <button
                    onClick={() => setShowAddAsset(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="max-w-md">
                  <SearchBar />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Digite o nome ou código do ativo que deseja adicionar à comparação
                </p>
              </motion.div>
            )}

            {/* Selected Assets */}
            {selectedAssets.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Nenhum ativo selecionado
                </h3>
                <p className="text-gray-500">
                  Adicione ativos para começar a comparação
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedAssets.map((ticker, index) => {
                  const data = assetData[ticker as keyof typeof assetData]
                  return (
                    <motion.div
                      key={ticker}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-700 rounded-lg p-4 border border-dark-600 relative group"
                    >
                      <button
                        onClick={() => removeAsset(ticker)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{ticker.replace('.SA', '')}</h4>
                          <p className="text-gray-400 text-sm">{data?.name || 'Carregando...'}</p>
                        </div>
                      </div>
                      
                      {data && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Preço:</span>
                            <span className="text-white font-medium">{data.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Variação:</span>
                            <span className={`font-medium ${data.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {data.change}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Comparison Table */}
        {selectedAssets.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-dark-700">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary-400" />
                  Comparação Detalhada
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Métrica
                      </th>
                      {selectedAssets.map((ticker) => (
                        <th key={ticker} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {ticker.replace('.SA', '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                        Preço Atual
                      </td>
                      {selectedAssets.map((ticker) => {
                        const data = assetData[ticker as keyof typeof assetData]
                        return (
                          <td key={ticker} className="px-6 py-4 whitespace-nowrap text-white font-medium">
                            {data?.price || 'N/D'}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                        Variação Diária
                      </td>
                      {selectedAssets.map((ticker) => {
                        const data = assetData[ticker as keyof typeof assetData]
                        return (
                          <td key={ticker} className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-medium ${data?.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {data?.change || 'N/D'}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                        Valor de Mercado
                      </td>
                      {selectedAssets.map((ticker) => {
                        const data = assetData[ticker as keyof typeof assetData]
                        return (
                          <td key={ticker} className="px-6 py-4 whitespace-nowrap text-white font-medium">
                            {data?.marketCap || 'N/D'}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                        P/L
                      </td>
                      {selectedAssets.map((ticker) => {
                        const data = assetData[ticker as keyof typeof assetData]
                        return (
                          <td key={ticker} className="px-6 py-4 whitespace-nowrap text-white font-medium">
                            {data?.pe || 'N/D'}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 font-medium">
                        Dividend Yield
                      </td>
                      {selectedAssets.map((ticker) => {
                        const data = assetData[ticker as keyof typeof assetData]
                        return (
                          <td key={ticker} className="px-6 py-4 whitespace-nowrap text-white font-medium">
                            {data?.dividendYield || 'N/D'}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chart Placeholder */}
        {selectedAssets.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-400" />
                Gráfico Comparativo
              </h2>
              
              <div className="h-64 bg-dark-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">
                    Gráfico em Desenvolvimento
                  </h3>
                  <p className="text-gray-500">
                    O gráfico comparativo será implementado em breve
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-800 rounded-lg p-6 border border-dark-700"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-primary-400" />
            Como Usar a Comparação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">1. Adicionar Ativos</h4>
              <p className="text-sm">
                Clique em "Adicionar Ativo" e pesquise pelos ativos que deseja comparar. 
                Você pode adicionar até 4 ativos simultaneamente.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">2. Analisar Métricas</h4>
              <p className="text-sm">
                Compare preços, variações, valor de mercado, P/L e dividend yield 
                lado a lado para identificar oportunidades.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">3. Visualizar Gráficos</h4>
              <p className="text-sm">
                Use o gráfico comparativo para analisar o desempenho histórico 
                dos ativos em diferentes períodos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">4. Tomar Decisões</h4>
              <p className="text-sm">
                Com base na comparação, tome decisões mais informadas sobre 
                seus investimentos e estratégias de portfólio.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Compare