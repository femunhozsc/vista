import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Search,
  ArrowRight,
  Star,
  Activity
} from 'lucide-react'
import SearchBar from '../components/SearchBar'

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const featuredAssets = [
    { ticker: 'PETR4.SA', name: 'Petrobras', price: 'R$ 30,90', change: '-1,09%', isPositive: false },
    { ticker: 'VALE3.SA', name: 'Vale', price: 'R$ 52,10', change: '-2,53%', isPositive: false },
    { ticker: 'ITUB4.SA', name: 'Itaú Unibanco', price: 'R$ 37,41', change: '-0,16%', isPositive: false },
    { ticker: 'BBDC4.SA', name: 'Banco Bradesco', price: 'R$ 16,20', change: '+0,75%', isPositive: true },
    { ticker: 'ABEV3.SA', name: 'Ambev', price: 'R$ 14,03', change: '-0,21%', isPositive: false },
    { ticker: 'WEGE3.SA', name: 'WEG', price: 'R$ 42,35', change: '-3,79%', isPositive: false },
  ]

  const marketHighlights = [
    { name: 'IBOVESPA', value: '129.847', change: '+0,85%', isPositive: true },
    { name: 'IFIX', value: '3.247', change: '-0,23%', isPositive: false },
    { name: 'USD/BRL', value: '5,45', change: '+0,12%', isPositive: true },
    { name: 'BTC-USD', value: '$67.234', change: '+2,34%', isPositive: true },
  ]

  const quickStats = [
    { 
      title: 'Ativos Monitorados', 
      value: '500+', 
      icon: BarChart3, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    { 
      title: 'Empresas B3', 
      value: '400+', 
      icon: TrendingUp, 
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    { 
      title: 'Criptomoedas', 
      value: '50+', 
      icon: DollarSign, 
      color: 'text-primary-400',
      bgColor: 'bg-primary-400/10'
    },
    { 
      title: 'Análises Diárias', 
      value: '1000+', 
      icon: Activity, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f59e0b" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Clearview Vista
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Plataforma moderna para análise de ativos financeiros da bolsa brasileira, 
                criptomoedas e mercado internacional
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/rankings"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-all duration-200 hover-lift"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Ver Rankings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/comparar"
                className="inline-flex items-center px-6 py-3 bg-dark-700 text-white font-medium rounded-lg hover:bg-dark-600 transition-all duration-200 hover-lift border border-dark-600"
              >
                <Search className="w-5 h-5 mr-2" />
                Comparar Ativos
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Status */}
      <section className="py-8 bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Destaques do Mercado</h2>
            <div className="text-sm text-gray-400">
              Atualizado em: {currentTime.toLocaleString('pt-BR')}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketHighlights.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors"
              >
                <h3 className="text-gray-400 text-sm font-medium mb-1">{item.name}</h3>
                <p className="text-white text-lg font-bold mb-1">{item.value}</p>
                <p className={`text-sm font-medium ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {item.isPositive ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                  {item.change}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Nossa Plataforma</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dados em tempo real, análise técnica avançada e ferramentas profissionais 
              para suas decisões de investimento
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.title}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Ativos em Destaque</h2>
            <Link
              to="/rankings"
              className="text-primary-400 hover:text-primary-300 font-medium flex items-center"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAssets.map((asset, index) => (
              <motion.div
                key={asset.ticker}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/ativo/${asset.ticker}`}
                  className="block bg-dark-700 rounded-lg p-6 hover:bg-dark-600 transition-all duration-200 hover-lift border border-dark-600 hover:border-primary-500/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{asset.ticker.replace('.SA', '')}</h3>
                        <p className="text-gray-400 text-sm">{asset.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-white">{asset.price}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium flex items-center ${asset.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {asset.change}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Comece sua análise agora
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Pesquise qualquer ativo e tenha acesso a análises completas, 
              gráficos interativos e dados fundamentalistas
            </p>
            <div className="max-w-md mx-auto">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home