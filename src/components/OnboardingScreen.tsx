import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { WalletService } from '../lib/wallet';
import { Wallet, Import, Key, Shield, ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onWalletCreated: (address: string) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onWalletCreated }) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'create' | 'import' | 'import-method'>('welcome');
  const [importMethod, setImportMethod] = useState<'private-key' | 'mnemonic'>('private-key');
  const [privateKey, setPrivateKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newWallet, setNewWallet] = useState<{ address: string; privateKey: string; mnemonic: string } | null>(null);

  const walletService = new WalletService();

  const handleCreateWallet = () => {
    setIsLoading(true);
    try {
      const wallet = walletService.createWallet();
      setNewWallet(wallet);
      setCurrentStep('create');
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWallet = () => {
    if (!newWallet || !password || password !== confirmPassword) {
      alert('Please enter matching passwords');
      return;
    }

    try {
      const encryptedKey = walletService.encryptPrivateKey(newWallet.privateKey, password);
      walletService.saveWallet(newWallet.address, encryptedKey);
      onWalletCreated(newWallet.address);
    } catch (error) {
      console.error('Error saving wallet:', error);
      alert('Error saving wallet');
    }
  };

  const handleImportWallet = () => {
    if (!password || password !== confirmPassword) {
      alert('Please enter matching passwords');
      return;
    }

    setIsLoading(true);
    try {
      let wallet;
      if (importMethod === 'private-key') {
        if (!privateKey) {
          alert('Please enter private key');
          return;
        }
        wallet = walletService.importFromPrivateKey(privateKey);
      } else {
        if (!mnemonic) {
          alert('Please enter mnemonic phrase');
          return;
        }
        wallet = walletService.importFromMnemonic(mnemonic);
      }

      const encryptedKey = walletService.encryptPrivateKey(wallet.privateKey, password);
      walletService.saveWallet(wallet.address, encryptedKey);
      onWalletCreated(wallet.address);
    } catch (error) {
      console.error('Error importing wallet:', error);
      alert('Error importing wallet. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Oorth Nexus Wallet</h1>
            <p className="text-gray-400">Your gateway to the Oorth Nexus blockchain</p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 space-y-4">
              <Button 
                onClick={handleCreateWallet}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Create New Wallet
              </Button>
              
              <Button 
                onClick={() => setCurrentStep('import-method')}
                variant="outline"
                className="w-full h-12 border-gray-600 hover:bg-gray-700"
              >
                <Import className="w-5 h-5 mr-2" />
                Import Existing Wallet
              </Button>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center text-yellow-400 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Your keys are stored securely on your device
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'import-method') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center">Import Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => {
                  setImportMethod('private-key');
                  setCurrentStep('import');
                }}
                variant="outline"
                className="w-full h-12 border-gray-600 hover:bg-gray-700"
              >
                <Key className="w-5 h-5 mr-2" />
                Import with Private Key
              </Button>
              
              <Button
                onClick={() => {
                  setImportMethod('mnemonic');
                  setCurrentStep('import');
                }}
                variant="outline"
                className="w-full h-12 border-gray-600 hover:bg-gray-700"
              >
                <Shield className="w-5 h-5 mr-2" />
                Import with Seed Phrase
              </Button>

              <Button
                onClick={() => setCurrentStep('welcome')}
                variant="ghost"
                className="w-full"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'create' && newWallet) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center">Secure Your Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400 mb-2">⚠️ Important: Save your recovery phrase</p>
                <div className="bg-gray-900 p-3 rounded text-xs font-mono break-all">
                  {newWallet.mnemonic}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Create Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>

              <Button
                onClick={handleSaveWallet}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!password || password !== confirmPassword}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Secure Wallet
              </Button>

              <Button
                onClick={() => setCurrentStep('welcome')}
                variant="ghost"
                className="w-full"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'import') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center">
                Import with {importMethod === 'private-key' ? 'Private Key' : 'Seed Phrase'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {importMethod === 'private-key' ? (
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Private Key</label>
                  <Input
                    type="password"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="Enter your private key"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Seed Phrase (12-24 words)</label>
                  <textarea
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    placeholder="Enter your seed phrase"
                    className="w-full h-24 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Create Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>

              <Button
                onClick={handleImportWallet}
                disabled={isLoading || !password || password !== confirmPassword}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Importing...' : 'Import Wallet'}
              </Button>

              <Button
                onClick={() => setCurrentStep('import-method')}
                variant="ghost"
                className="w-full"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};