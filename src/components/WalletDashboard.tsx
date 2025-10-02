import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Plus, 
  ArrowUpRight, 
  Repeat, 
  TrendingUp,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';

interface WalletDashboardProps {
  balance: string;
  isBalanceVisible: boolean;
  onToggleBalance: () => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({
  balance,
  isBalanceVisible,
  onToggleBalance
}) => {
  const actionButtons = [
    { icon: Plus, label: 'Deposit', color: 'bg-yellow-500' },
    { icon: Repeat, label: 'Bridge', color: 'bg-gray-600' },
    { icon: TrendingUp, label: 'Earn', color: 'bg-gray-600' },
    { icon: ArrowUpRight, label: 'Transfer', color: 'bg-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">🦊</span>
          </div>
          <span className="text-white font-medium">joy_avenlabs</span>
        </div>
        <Settings className="w-6 h-6 text-gray-400" />
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
              onClick={onToggleBalance}
              className="text-gray-400 hover:text-white"
            >
              {isBalanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">
              {isBalanceVisible ? balance : '••••'}
            </span>
            <span className="text-gray-400">
              ⟳
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {actionButtons.map((action, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <Button
              size="lg"
              className={`w-16 h-16 rounded-2xl ${action.color} hover:opacity-80 p-0`}
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
            <Button variant="link" className="text-blue-400 p-0">
              See all →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">
            Go to full page to refresh
          </p>
        </CardContent>
      </Card>

      {/* Save Recovery Key Banner */}
      <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">Save your recovery key</h3>
              <p className="text-gray-300 text-sm">Backup your wallet to keep it safe</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
          <Button className="mt-3 bg-white text-black hover:bg-gray-100">
            Go to settings
          </Button>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 text-yellow-500">🏠</div>
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