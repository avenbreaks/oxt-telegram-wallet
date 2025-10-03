import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Plus, 
  ArrowUpRight, 
  Repeat, 
  TrendingUp,
  Eye,
  EyeOff,
  Settings,
  Copy,
  QrCode,
  X
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

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
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
        const [walletBalance, txHistory] = await Promise.all([
          walletService.getBalance(address),
          walletService.getTransactionHistory(address)
        ]);
        
        setBalance(walletBalance);
        setTransactions(txHistory as Transaction[]);
      } catch (error) {
        console.error('Error loading wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [address]);

  const loadWalletData = async () => {
    const walletService = new WalletService();
    setIsLoading(true);
    try {
      const [walletBalance, txHistory] = await Promise.all([
        walletService.getBalance(address),
        walletService.getTransactionHistory(address)
      ]);
      
      setBalance(walletBalance);
      setTransactions(txHistory as Transaction[]);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!sendTo || !sendAmount) {
      alert('Please fill all fields');
      return;
    }

    setIsSending(true);
    try {
      const walletService = new WalletService();
      // In a real app, you'd need to unlock the wallet with password first
      const storedWallet = walletService.getStoredWallet();
      if (!storedWallet) {
        alert('Wallet not found');
        return;
      }

      // For demo purposes, we'll skip the password verification
      // In production, you'd need to decrypt the private key
      alert('Send functionality requires password authentication (not implemented in demo)');
      
    } catch (error) {
      console.error('Error sending transaction:', error);
      alert('Error sending transaction');
    } finally {
      setIsSending(false);
      setShowSendModal(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const actionButtons = [
    { 
      icon: Plus, 
      label: 'Receive', 
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => setShowReceiveModal(true)
    },
    { 
      icon: ArrowUpRight, 
      label: 'Send', 
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setShowSendModal(true)
    },
    { 
      icon: Repeat, 
      label: 'Refresh', 
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: loadWalletData
    },
    { 
      icon: TrendingUp, 
      label: 'Explorer', 
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => window.open(`${OORTH_NEXUS_CONFIG.explorer}/address/${address}`, '_blank')
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">ON</span>
          </div>
          <div>
            <span className="text-white font-medium">Oorth Nexus</span>
            <div className="text-xs text-gray-400">{formatAddress(address)}</div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onLogout}
          className="text-gray-400 hover:text-white"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-400 text-sm font-normal">
              Total Balance
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-gray-400 hover:text-white"
            >
              {isBalanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">
              {isBalanceVisible ? `${balance} ${OORTH_NEXUS_CONFIG.symbol}` : '••••'}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={loadWalletData}
              className="text-gray-400 hover:text-white"
            >
              ⟳
            </Button>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Network: {OORTH_NEXUS_CONFIG.name}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {actionButtons.map((action, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <Button
              size="lg"
              onClick={action.onClick}
              className={`w-16 h-16 rounded-2xl ${action.color} p-0`}
            >
              <action.icon className="w-6 h-6 text-white" />
            </Button>
            <span className="text-sm text-gray-300">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-lg">Recent transactions</CardTitle>
            <Button 
              variant="link" 
              className="text-blue-400 p-0"
              onClick={() => window.open(`${OORTH_NEXUS_CONFIG.explorer}/address/${address}`, '_blank')}
            >
              View all →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-400 text-center py-4">Loading...</p>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.hash} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">
                      {tx.from.toLowerCase() === address.toLowerCase() ? 'Sent' : 'Received'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {tx.from.toLowerCase() === address.toLowerCase() ? `To: ${formatAddress(tx.to)}` : `From: ${formatAddress(tx.from)}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${tx.from.toLowerCase() === address.toLowerCase() ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.from.toLowerCase() === address.toLowerCase() ? '-' : '+'}{tx.value} {OORTH_NEXUS_CONFIG.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(tx.timestamp * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No transactions yet</p>
          )}
        </CardContent>
      </Card>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Send {OORTH_NEXUS_CONFIG.symbol}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSendModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">To Address</label>
                <Input
                  value={sendTo}
                  onChange={(e) => setSendTo(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Amount</label>
                <Input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.0"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Balance: {balance} {OORTH_NEXUS_CONFIG.symbol}
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={isSending || !sendTo || !sendAmount}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? 'Sending...' : 'Send'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Receive {OORTH_NEXUS_CONFIG.symbol}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowReceiveModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>
                <p className="text-sm text-gray-400 mb-4">Your wallet address:</p>
                <div className="bg-gray-700 p-3 rounded-lg break-all text-sm font-mono">
                  {address}
                </div>
                <Button
                  onClick={copyAddress}
                  variant="outline"
                  className="mt-4 w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 text-blue-500">🏠</div>
            <span className="text-xs text-white">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Repeat className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Swaps</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 text-gray-400">🌐</div>
            <span className="text-xs text-gray-400">Apps</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 text-gray-400">📋</div>
            <span className="text-xs text-gray-400">Missions</span>
          </div>
        </div>
      </div>
    </div>
  );
};