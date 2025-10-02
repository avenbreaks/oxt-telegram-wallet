import { useState } from 'react'
import './App.css'
import { WalletDashboard } from './components/WalletDashboard'

function App() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const toggleBalance = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  return (
    <WalletDashboard 
      balance="$0"
      isBalanceVisible={isBalanceVisible}
      onToggleBalance={toggleBalance}
    />
  )
}

export default App
