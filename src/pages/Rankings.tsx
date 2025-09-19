import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Star,
  Filter,
  ArrowUpDown
} from 'lucide-react'

const Rankings = () => {
  const [selectedCategory, setSelectedCategory] = useState('dividend-yield')
  const [selectedAssetType, setSelectedAssetType] = useState('all')

  const categories = [
    { id: 'dividend-yield', name: 'Maiores Dividend Yield', icon: DollarSign },
    { id: 'market-cap', name: 'Maiores Valor de Mercado', icon: BarChart3 },
    { id: 'revenue', name: 'Maiores Receitas', icon: TrendingUp },
    { id: 'most-searched', name: 'Mais Procurados', icon: Star },
  ]

  const assetTypes = [
    { id: 'all', name: 'Todos' },
    { id: 'stocks', name: 'Ações' },
    { id: 'fiis', name: 'FIIs' },
    { id: 'etfs', name: 'ETFs' },
    { id: 'crypto', name: 'Criptomoedas' },
  ]

  // Dados de exemplo baseados no CSV fornecido
  const rankingData = {
    'dividend-yield': [
      { ticker: 'TAEE11.SA', name: 'Taesa', value: '12,5%', price: 'R$ 35,38', change: '-0,31%', isPositive: false },
      { ticker: 'EGIE3.SA', name: 'Engie', value: '11,8%', price: 'R$ 41,06', change: '-1,89%', isPositive: false },
      { ticker: 'CPFE3.SA', name: 'CPFL Energia', value: '10,9%', price: 'R$ 40,49', change: '-1,75%', isPositive: false },
      { ticker: 'EQTL3.SA', name: 'Equatorial', value: '10,2%', price: 'R$ 36,65', change: '-1,08%', isPositive: false },
      { ticker: 'CPLE6.SA', name: 'Copel', value: '9,8%', price: 'R$ 12,67', change: '-0,86%', isPositive: false },
    ],
    'market-cap': [
      { ticker: 'PETR4.SA', name: 'Petrobras', value: 'R$ 402,1 Bi', price: 'R$ 30,90', change: '-1,09%', isPositive: false },
      { ticker: 'VALE3.SA', name: 'Vale', value: 'R$ 245,8 Bi', price: 'R$ 52,10', change: '-2,53%', isPositive: false },
      { ticker: 'ITUB4.SA', name: 'Itaú Unibanco', value: 'R$ 178,3 Bi', price: 'R$ 37,41', change: '-0,16%', isPositive: false },
      { ticker: 'BBDC4.SA', name: 'Banco Bradesco', value: 'R$ 156,7 Bi', price: 'R$ 16,20', change: '+0,75%', isPositive: true },
      { ticker: 'ABEV3.SA', name: 'Ambev', value: 'R$ 134,2 Bi', price: 'R$ 14,03', change: '-0,21%', isPositive: false },
    ],
    'revenue': [
      { ticker: 'PETR4.SA', name: 'Petrobras', value: 'R$ 456,8 Bi', price: 'R$ 30,90', change: '-1,09%', isPositive: false },
      { ticker: 'VALE3.SA', name: 'Vale', value: 'R$ 198,7 Bi', price: 'R$ 52,10', change: '-2,53%', isPositive: false },
      { ticker: 'JBSS3.SA', name: 'JBS', value: 'R$ 187,3 Bi', price: 'R$ 40,12', change: '-1,40%', isPositive: false },
      { ticker: 'ITUB4.SA', name: 'Itaú Unibanco', value: 'R$ 156,9 Bi', price: 'R$ 37,41', change: '-0,16%', isPositive: false },
      { ticker: 'BBDC4.SA', name: 'Banco Bradesco', value: 'R$ 134,5 Bi', price: 'R$ 16,20', change: '+0,75%', isPositive: true },
    ],
    'most-searched': [
      { ticker: 'COGN3.SA', name: 'Cogna', value: '100,9M neg.', price: 'R$ 2,97', change: '+2,77%', isPositive: true },
      { ticker: 'ENEV3.SA', name: 'Eneva', value: '100,1M neg.', price: 'R$ 13,97', change: '-1,96%', isPositive: false },
      { ticker: 'AZUL4.SA', name: 'Azul', value: '93,5M neg.', price: 'R$ 0,90', change: '-6,25%', isPositive: false },
      { ticker: 'B3SA3.SA', name: 'B3', value: '82,2M neg.', price: 'R$ 13,95', change: '-1,06%', isPositive: false },
      { ticker: 'HAPV3.SA', name: 'Hapvida', value: '59,0M neg.', price: 'R$ 2,86', change: '+0,35%', isPositive: true },
    ],
  }

  const currentData = rankingData[selectedCategory as keyof typeof rankingData] || []

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Rankings de Ativos</h1>
          <p className="text-gray-400">
            Acompanhe os principais ativos do mercado brasileiro organizados por diferentes métricas
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Categorias */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Categoria:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tipos de Ativo */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm font-medium">Tipo:</span>
                </div>
                <select
                  value={selectedAssetType}
                  onChange={(e) => setSelectedAssetType(e.target.value)}
                  className="bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {assetTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ranking Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-dark-700">
            <h2 className="text-xl font-bold text-white">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ativo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Variação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {currentData.map((item, index) => (
                  <motion.tr
                    key={item.ticker}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-dark-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-yellow-600 text-white' :
                          'bg-dark-600 text-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/ativo/${item.ticker}`}
                        className="flex items-center space-x-3 group"
                      >
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center group-hover:bg-primary-400 transition-colors">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                            {item.ticker.replace('.SA', '')}
                          </div>
                          <div className="text-gray-400 text-sm">{item.name}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{item.value}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{item.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center font-medium ${
                        item.isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.isPositive ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {item.change}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Informações Adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-dark-800 rounded-lg p-6 border border-dark-700"
        >
          <h3 className="text-lg font-bold text-white mb-4">Sobre os Rankings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Dividend Yield</h4>
              <p className="text-sm">
                Representa o percentual de dividendos pagos em relação ao preço da ação. 
                Indica o retorno em dividendos que o investidor recebe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Valor de Mercado</h4>
              <p className="text-sm">
                Valor total da empresa no mercado, calculado multiplicando o preço da ação 
                pelo número total de ações em circulação.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Receita</h4>
              <p className="text-sm">
                Receita total da empresa nos últimos 12 meses. Indica o tamanho 
                e a capacidade de geração de receita da empresa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Mais Procurados</h4>
              <p className="text-sm">
                Ativos com maior volume de negociação e interesse dos investidores, 
                baseado no número de negócios realizados.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Rankings