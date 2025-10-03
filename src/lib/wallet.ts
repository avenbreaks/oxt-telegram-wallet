import { ethers } from 'ethers';
import { OORTH_NEXUS_CONFIG, STORAGE_KEYS } from './constants';

export class WalletService {
  private provider: ethers.JsonRpcProvider;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(OORTH_NEXUS_CONFIG.rpcUrl);
  }

  // Create new wallet
  createWallet(): { address: string; privateKey: string; mnemonic: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || ''
    };
  }

  // Import wallet from private key
  importFromPrivateKey(privateKey: string): { address: string; privateKey: string } {
    try {
      const wallet = new ethers.Wallet(privateKey);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch {
      throw new Error('Invalid private key');
    }
  }

  // Import wallet from mnemonic
  importFromMnemonic(mnemonic: string): { address: string; privateKey: string; mnemonic: string } {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase || ''
      };
    } catch {
      throw new Error('Invalid mnemonic phrase');
    }
  }

  // Get balance
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Send transaction
  async sendTransaction(
    privateKey: string, 
    to: string, 
    amount: string
  ): Promise<string> {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount)
      });
      return tx.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  // Get transaction history (simplified)
  async getTransactionHistory(address: string): Promise<Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
  }>> {
    try {
      // This is a simplified version. In a real app, you'd use a more comprehensive API
      const latestBlock = await this.provider.getBlockNumber();
      const transactions = [];
      
      // Check last 100 blocks for transactions
      for (let i = Math.max(0, latestBlock - 100); i <= latestBlock; i++) {
        try {
          const block = await this.provider.getBlock(i, true);
          if (block && block.transactions) {
            for (const txHash of block.transactions) {
              if (typeof txHash === 'string') {
                try {
                  const tx = await this.provider.getTransaction(txHash);
                  if (tx && (tx.to === address || tx.from === address)) {
                    transactions.push({
                      hash: tx.hash,
                      from: tx.from,
                      to: tx.to || '',
                      value: ethers.formatEther(tx.value || '0'),
                      timestamp: block.timestamp || 0
                    });
                  }
                } catch {
                  // Skip transaction if error
                  continue;
                }
              }
            }
          }
        } catch {
          // Skip block if error
          continue;
        }
      }
      
      return transactions.slice(0, 10); // Return last 10 transactions
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  // Storage helpers
  saveWallet(address: string, encryptedPrivateKey: string): void {
    localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_PRIVATE_KEY, encryptedPrivateKey);
    localStorage.setItem(STORAGE_KEYS.IS_WALLET_CREATED, 'true');
  }

  getStoredWallet(): { address: string; encryptedPrivateKey: string } | null {
    const address = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    const encryptedPrivateKey = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_PRIVATE_KEY);
    
    if (address && encryptedPrivateKey) {
      return { address, encryptedPrivateKey };
    }
    
    return null;
  }

  isWalletCreated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_WALLET_CREATED) === 'true';
  }

  clearWallet(): void {
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_PRIVATE_KEY);
    localStorage.removeItem(STORAGE_KEYS.IS_WALLET_CREATED);
  }

  // Simple encryption (in production, use more secure methods)
  encryptPrivateKey(privateKey: string, password: string): string {
    // This is a very basic encryption. In production, use proper encryption libraries
    return btoa(privateKey + '|' + password);
  }

  decryptPrivateKey(encryptedKey: string, password: string): string {
    try {
      const decoded = atob(encryptedKey);
      const [privateKey, storedPassword] = decoded.split('|');
      if (storedPassword === password) {
        return privateKey;
      }
      throw new Error('Invalid password');
    } catch {
      throw new Error('Failed to decrypt private key');
    }
  }
}