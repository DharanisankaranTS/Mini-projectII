import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Simplified context that only provides what we need
interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  currentBlock: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// Create context with default values
const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  account: null,
  currentBlock: 12345678,
  connect: async () => {},
  disconnect: () => {}
});

// Custom hook to use the context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  // Initialize with connected state for better user experience
  const [isConnected, setIsConnected] = useState(true);
  const [account, setAccount] = useState<string | null>("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const [currentBlock, setCurrentBlock] = useState(12345678);
  const { toast } = useToast();
  
  // Auto-connect on application start - in a real app this would check for a real provider
  useEffect(() => {
    // Just verify our state is set
    if (!isConnected || !account) {
      const autoConnect = async () => {
        try {
          console.log("Auto-connecting to blockchain...");
          // Use a mock address
          const mockAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        
          // Update state
          setAccount(mockAddress);
          setIsConnected(true);
          
          console.log("Auto-connected successfully to", mockAddress);
        } catch (error) {
          console.error("Failed to auto-connect:", error);
        }
      };
      
      autoConnect();
    }
  }, [isConnected, account]);
  
  // Block number simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock(prev => prev + 1);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Connect wallet function - simplified for Replit
  const connect = async () => {
    try {
      console.log("Connecting wallet...");
      // Use a mock address
      const mockAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      
      // Update state
      setAccount(mockAddress);
      setIsConnected(true);
      
      // Show success toast
      toast({
        title: "Wallet Connected",
        description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(38)}`
      });
      
      console.log("Wallet connected successfully");
      return Promise.resolve();
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  // Disconnect wallet function
  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected."
    });
  };

  // Value object to be passed to consumers
  const value = {
    isConnected,
    account,
    currentBlock,
    connect,
    disconnect,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}
