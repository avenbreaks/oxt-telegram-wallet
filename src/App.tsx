import { useState, useEffect } from 'react'
import './App.css'
import { ModernWalletDashboard } from './components/ModernWalletDashboard'
import { ModernLogin } from './components/ModernLogin'

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if wallet already exists
    const storedAddress = localStorage.getItem('wallet_address')
    const storedPrivateKey = localStorage.getItem('wallet_privateKey')
    
    if (storedAddress && storedPrivateKey) {
      setWalletAddress(storedAddress)
    }
    setIsLoading(false)
  }, [])

  const handleWalletCreated = (address: string) => {
    setWalletAddress(address)
  }

  const handleLogout = () => {
    localStorage.removeItem('wallet_address')
    localStorage.removeItem('wallet_privateKey')
    localStorage.removeItem('wallet_mnemonic')
    setWalletAddress(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-white font-bold">🌀</span>
          </div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!walletAddress) {
    return <ModernLogin onLogin={handleWalletCreated} />
  }

  return (
    <ModernWalletDashboard 
      address={walletAddress}
      onLogout={handleLogout}
    />
  )
}

export default App
