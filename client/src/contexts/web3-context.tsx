import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock Web3 implementation for Replit environment
class MockWeb3 {
  eth: any;

  constructor() {
    this.eth = {
      getBlockNumber: async () => 12345678,
      getAccounts: async () => [],
      Contract: function(abi: any, address: string) {
        return {
          methods: {
            registerDonor: () => ({
              send: async () => ({ transactionHash: "0x123..." })
            }),
            registerRecipient: () => ({
              send: async () => ({ transactionHash: "0x456..." })
            }),
            createMatch: () => ({
              send: async () => ({ transactionHash: "0x789..." })
            })
          }
        };
      }
    };
  }
}

// Mock window.ethereum for Replit environment
const mockEthereum = {
  request: async ({ method }: { method: string }) => {
    if (method === "eth_requestAccounts") {
      return ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];
    }
    return null;
  },
  on: (event: string, callback: Function) => {},
  removeAllListeners: (event: string) => {}
};

// Contract address
const CONTRACT_ADDRESS = "0x72F8Fc3d1289e7325gA82F0f24eB38B203b53f2D";

interface Web3ContextProps {
  web3: any | null;
  account: string | null;
  contract: any | null;
  isConnected: boolean;
  isContractVerified: boolean;
  currentBlock: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextProps>({
  web3: null,
  account: null,
  contract: null,
  isConnected: false,
  isContractVerified: false,
  currentBlock: null,
  connect: async () => {},
  disconnect: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [web3, setWeb3] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isContractVerified, setIsContractVerified] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const { toast } = useToast();

  // Initialize Web3
  useEffect(() => {
    const init = async () => {
      try {
        // Create mock Web3 instance for Replit environment
        const web3Instance = new MockWeb3();
        setWeb3(web3Instance);

        // Set mock block number
        setCurrentBlock(12345678);

        // Set up mock contract
        const contractInstance = new web3Instance.eth.Contract(
          [], // Mock ABI
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
        setIsContractVerified(true);
        
        console.log("Mock Web3 initialized successfully");
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    };

    init();
    
  }, [toast]);

  // Mock block number updates
  useEffect(() => {
    if (!web3) return;

    const interval = setInterval(() => {
      setCurrentBlock((prev) => (prev || 12345678) + 1);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [web3]);

  // Connect wallet function
  const connect = async () => {
    try {
      // Simulate connecting wallet
      const mockAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
      setAccount(mockAddress);
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(38)}`
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  // Disconnect wallet function
  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        contract,
        isConnected,
        isContractVerified,
        currentBlock,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
