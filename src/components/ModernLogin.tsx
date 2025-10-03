import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Wallet,
  Key,
  Download,
  Plus,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';

interface ModernLoginProps {
  onLogin: (address: string, privateKey: string) => void;
}

export const ModernLogin: React.FC<ModernLoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'import'>('create');
  const [privateKey, setPrivateKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      // Import dynamically to avoid loading issues
      const { WalletService } = await import('../lib/wallet');
      const walletService = new WalletService();
      const newWallet = walletService.createWallet();
      
      // Store in localStorage
      localStorage.setItem('wallet_address', newWallet.address);
      localStorage.setItem('wallet_privateKey', newWallet.privateKey);
      localStorage.setItem('wallet_mnemonic', newWallet.mnemonic);
      
      onLogin(newWallet.address, newWallet.privateKey);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportWallet = async () => {
    if (!privateKey && !mnemonic) return;
    
    setIsLoading(true);
    try {
      const { WalletService } = await import('../lib/wallet');
      const walletService = new WalletService();
      
      let wallet;
      if (privateKey) {
        wallet = walletService.importFromPrivateKey(privateKey);
      } else {
        wallet = walletService.importFromMnemonic(mnemonic);
      }
      
      // Store in localStorage
      localStorage.setItem('wallet_address', wallet.address);
      localStorage.setItem('wallet_privateKey', wallet.privateKey);
      if ('mnemonic' in wallet) {
        localStorage.setItem('wallet_mnemonic', wallet.mnemonic);
      }
      
      onLogin(wallet.address, wallet.privateKey);
    } catch (error) {
      console.error('Failed to import wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div 
        className="glass rounded-3xl p-8 w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
          >
            <Wallet className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            OXT Wallet
          </motion.h1>
          <motion.p 
            className="text-gray-300 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Your gateway to Oorth Nexus
          </motion.p>
        </motion.div>

        {/* Tab Selection */}
        <motion.div 
          className="flex gap-2 mb-6 p-1 glass-dark rounded-2xl"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'create' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: activeTab === 'create' ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Create New
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'import' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: activeTab === 'import' ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Import
          </motion.button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div 
                className="text-center space-y-4"
                variants={itemVariants}
              >
                <div className="glass-dark rounded-2xl p-6">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Create New Wallet</h3>
                  <p className="text-gray-400 text-sm">
                    Generate a new wallet with a secure private key and recovery phrase.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-dark rounded-xl p-4 text-center">
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Instant Setup</p>
                  </div>
                  <div className="glass-dark rounded-xl p-4 text-center">
                    <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Secure by Default</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleCreateWallet}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-4 text-lg font-semibold rounded-2xl shadow-lg"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create Wallet
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="import"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-400" />
                  Private Key
                </label>
                <div className="relative">
                  <Input
                    type={showPrivateKey ? 'text' : 'password'}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="Enter your private key (0x...)"
                    className="glass border-white/20 pr-12 py-3"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <span className="text-gray-400 text-sm">or</span>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Recovery Phrase
                </label>
                <textarea
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  placeholder="Enter your 12-word recovery phrase"
                  rows={3}
                  className="w-full glass border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:border-white/40 focus:outline-none transition-colors"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleImportWallet}
                  disabled={isLoading || (!privateKey && !mnemonic)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-4 text-lg font-semibold rounded-2xl shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Import Wallet
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-400 leading-relaxed">
            By continuing, you agree to our terms of service and privacy policy.
            <br />
            Your keys are stored securely on your device.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};