import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  ArrowUpRight, 
  Repeat, 
  TrendingUp,
  Eye,
  EyeOff,
  Settings,
  Copy,
  QrCode,
  X,
  Wallet,
  Send,
  Download,
  Sparkles,
  Plus,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { WalletService } from '../lib/wallet';
import { OORTH_NEXUS_CONFIG } from '../lib/constants';

interface WalletDashboardProps {
  address: string;
  onLogout: () => void;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

export const ModernWalletDashboard: React.FC<WalletDashboardProps> = ({
  address,
  onLogout
}) => {
  const [balance, setBalance] = useState('0');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const walletService = new WalletService();
    const loadData = async () => {
      setIsLoading(true);
      try {
        const balanceResult = await walletService.getBalance(address);
        setBalance(balanceResult);
        
        const txHistory = await walletService.getTransactionHistory(address);
        setTransactions(txHistory);
      } catch (error) {
        console.error('Error loading wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      loadData();
    }
  }, [address]);

  const handleSend = async () => {
    if (!sendTo || !sendAmount) return;
    
    setIsSending(true);
    try {
      const walletService = new WalletService();
      const privateKey = localStorage.getItem('wallet_privateKey');
      if (!privateKey) throw new Error('Private key not found');
      
      await walletService.sendTransaction(privateKey, sendTo, sendAmount);
      setSendTo('');
      setSendAmount('');
      setShowSendModal(false);
      
      // Refresh balance
      const newBalance = await walletService.getBalance(address);
      setBalance(newBalance);
    } catch (error) {
      console.error('Send failed:', error);
    } finally {
      setIsSending(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  const actionButtons = [
    { 
      icon: Download, 
      label: 'Receive', 
      gradient: 'from-emerald-400 to-cyan-400',
      onClick: () => setShowReceiveModal(true)
    },
    { 
      icon: Send, 
      label: 'Send', 
      gradient: 'from-purple-400 to-pink-400',
      onClick: () => setShowSendModal(true)
    },
    { 
      icon: Repeat, 
      label: 'Swap', 
      gradient: 'from-blue-400 to-indigo-400',
      onClick: () => {}
    },
    { 
      icon: TrendingUp, 
      label: 'Earn', 
      gradient: 'from-yellow-400 to-orange-400',
      onClick: () => {}
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardHover = {
    scale: 1.02,
    transition: { type: "spring", stiffness: 300 }
  };

  return (
    <motion.div 
      className="min-h-screen text-white p-6 pb-28 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-10 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -15, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/3 w-40 h-40 bg-pink-500/20 rounded-full blur-xl"
          animate={{ 
            y: [0, -25, 0],
            x: [0, 20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-8 relative z-10"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Wallet className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              OXT Wallet
            </motion.h1>
            <motion.p 
              className="text-sm text-gray-300 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Globe className="w-4 h-4" />
              Oorth Nexus Network
            </motion.p>
          </div>
        </div>
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 glass rounded-2xl hover:bg-white/10 transition-all duration-300"
        >
          <Settings className="w-6 h-6 text-white" />
        </motion.button>
      </motion.div>

      {/* Balance Card */}
      <motion.div 
        className="glass rounded-3xl p-8 mb-8 relative overflow-hidden group"
        variants={itemVariants}
        whileHover={cardHover}
      >
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <span className="text-gray-300 text-lg font-medium">Total Balance</span>
            </div>
            <motion.button 
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isBalanceVisible ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isBalanceVisible ? 
                    <Eye className="w-6 h-6 text-gray-300" /> : 
                    <EyeOff className="w-6 h-6 text-gray-300" />
                  }
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
          
          <div className="flex items-baseline gap-3 mb-6">
            <motion.span 
              className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent"
              key={balance + isBalanceVisible}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {isLoading ? (
                <div className="shimmer w-32 h-12 bg-white/20 rounded-lg"></div>
              ) : (
                isBalanceVisible ? balance : '••••••'
              )}
            </motion.span>
            <span className="text-xl text-gray-400 font-medium">OXT</span>
          </div>
          
          <motion.div 
            className="flex items-center gap-3 text-xs text-gray-400 font-mono bg-black/30 rounded-xl px-4 py-3 border border-white/10"
            whileHover={{ borderColor: "rgba(255,255,255,0.3)" }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex-1">
              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'No wallet'}
            </span>
            <motion.button
              onClick={copyAddress}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 hover:bg-white/10 rounded"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-8"
        variants={itemVariants}
      >
        {actionButtons.map((action, index) => (
          <motion.button
            key={index}
            onClick={action.onClick}
            className="glass rounded-2xl p-6 flex flex-col items-center gap-4 relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -4,
              transition: { type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-20`}
              initial={false}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
            
            <motion.div 
              className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg relative z-10`}
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <action.icon className="w-7 h-7 text-white" />
            </motion.div>
            <span className="text-white font-semibold text-lg relative z-10">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="glass rounded-2xl p-6 mb-8"
        variants={itemVariants}
        whileHover={cardHover}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Zap className="w-6 h-6 text-yellow-400" />
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-dark rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Network</p>
            <p className="font-semibold text-white">Oorth Nexus</p>
          </div>
          <div className="glass-dark rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Chain ID</p>
            <p className="font-semibold text-white">982025</p>
          </div>
        </div>
      </motion.div>

      {/* Network Status */}
      <motion.div 
        className="glass rounded-2xl p-4 flex items-center justify-between mb-8"
        variants={itemVariants}
        whileHover={cardHover}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-4 h-4 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-medium">Network Connected</span>
        </div>
        <motion.div 
          className="flex items-center gap-2 text-sm text-gray-400"
          whileHover={{ scale: 1.05 }}
        >
          <Shield className="w-4 h-4" />
          <span>Secure</span>
        </motion.div>
      </motion.div>

      {/* Send Modal */}
      <AnimatePresence>
        {showSendModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSendModal(false)}
          >
            <motion.div
              className="glass rounded-3xl p-8 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Send OXT</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSendModal(false)}
                  className="hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">To Address</label>
                  <Input
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder="0x..."
                    className="glass border-white/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (OXT)</label>
                  <Input
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.0"
                    type="number"
                    className="glass border-white/20"
                  />
                </div>
                
                <Button
                  onClick={handleSend}
                  disabled={isSending || !sendTo || !sendAmount}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 text-lg font-semibold"
                >
                  {isSending ? 'Sending...' : 'Send Transaction'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receive Modal */}
      <AnimatePresence>
        {showReceiveModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReceiveModal(false)}
          >
            <motion.div
              className="glass rounded-3xl p-8 w-full max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Receive OXT</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowReceiveModal(false)}
                  className="hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="w-32 h-32 bg-white rounded-2xl mx-auto flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-800" />
                </div>
                
                <div>
                  <p className="text-gray-300 mb-2">Your Address</p>
                  <div className="glass-dark rounded-xl p-4 flex items-center gap-3">
                    <span className="flex-1 font-mono text-sm break-all">{address}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyAddress}
                      className="hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 backdrop-blur-xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
      >
        <div className="flex justify-around py-4 px-6">
          {[
            { icon: Wallet, label: 'Wallet', active: true },
            { icon: Repeat, label: 'Swap', active: false },
            { icon: TrendingUp, label: 'DeFi', active: false },
            { icon: Settings, label: 'Settings', active: false }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.active 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gray-700'
                }`}
                whileHover={item.active ? {} : { backgroundColor: 'rgb(55 65 81)' }}
              >
                <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-gray-400'}`} />
              </motion.div>
              <span className={`text-xs font-medium ${item.active ? 'text-white' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};