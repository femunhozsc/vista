import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Github, Mail, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Clearview Vista</h3>
                <p className="text-xs text-gray-400">Análise Financeira</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Plataforma moderna para análise de ativos financeiros da bolsa brasileira, 
              criptomoedas e mercado internacional. Dados em tempo real e análise técnica avançada.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@clearviewvista.com"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Rankings
                </Link>
              </li>
              <li>
                <Link to="/comparar" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Comparar Ativos
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Ações Brasileiras</span>
              </li>
              <li>
                <span className="text-gray-400">Criptomoedas</span>
              </li>
              <li>
                <span className="text-gray-400">Moedas</span>
              </li>
              <li>
                <span className="text-gray-400">ETFs</span>
              </li>
              <li>
                <span className="text-gray-400">Análise Técnica</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Clearview Vista. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Dados fornecidos por</span>
            <a
              href="https://finance.yahoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors text-sm flex items-center space-x-1"
            >
              <span>Yahoo Finance</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer