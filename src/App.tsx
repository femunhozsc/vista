import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import AssetDetails from './pages/AssetDetails'
import Rankings from './pages/Rankings'
import Compare from './pages/Compare'

function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ativo/:ticker" element={<AssetDetails />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/comparar" element={<Compare />} />
        </Routes>
      </motion.main>

      <Footer />
    </div>
  )
}

export default App