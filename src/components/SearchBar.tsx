import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp, X } from 'lucide-react'
import { searchAssets } from '../services/api'

interface SearchResult {
  ticker: string
  name: string
  type: string
}

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchAsset = async () => {
      if (query.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const searchResults = await searchAssets(query)
        setResults(searchResults)
        setIsOpen(searchResults.length > 0)
      } catch (error) {
        console.error('Erro na busca:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchAsset, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelectAsset = (ticker: string) => {
    setQuery('')
    setIsOpen(false)
    navigate(`/ativo/${ticker}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      handleSelectAsset(results[0])
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ativo (ex: PETR4, Petrobras, BTC-USD)..."
            className="w-full pl-10 pr-10 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="spinner mx-auto"></div>
                <p className="text-gray-400 mt-2">Buscando...</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((ticker, index) => (
                  <motion.button
                    key={ticker}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectAsset(ticker)}
                    className="w-full px-4 py-3 text-left hover:bg-dark-700 transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center group-hover:bg-primary-400 transition-colors">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{ticker.replace('.SA', '')}</p>
                      <p className="text-gray-400 text-sm">Clique para ver detalhes</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar