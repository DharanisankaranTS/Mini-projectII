import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { donorContractABI } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract address
const CONTRACT_ADDRESS = "0x72F8Fc3d1289e7325gA82F0f24eB38B203b53f2D";

interface Web3ContextProps {
  web3: Web3 | null;
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
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isContractVerified, setIsContractVerified] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const { toast } = useToast();

  // Initialize Web3
  useEffect(() => {
    const init = async () => {
      // Check if metamask is installed
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Get current block number
          const blockNumber = await web3Instance.eth.getBlockNumber();
          setCurrentBlock(blockNumber);

          // Set up contract
          const contractInstance = new web3Instance.eth.Contract(
            donorContractABI as AbiItem[],
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);
          setIsContractVerified(true);

          // Check if already connected
          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length === 0) {
              setAccount(null);
              setIsConnected(false);
              toast({
                title: "Wallet Disconnected",
                description: "You have disconnected your wallet.",
              });
            } else {
              setAccount(accounts[0]);
              setIsConnected(true);
            }
          });

          // Listen for chain changes
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error initializing Web3:", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    init();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [toast]);

  // Update block number periodically
  useEffect(() => {
    if (!web3) return;

    const interval = setInterval(async () => {
      try {
        const blockNumber = await web3.eth.getBlockNumber();
        setCurrentBlock(blockNumber);
      } catch (error) {
        console.error("Error getting block number:", error);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [web3]);

  // Connect wallet function
  const connect = async () => {
    if (!web3) {
      toast({
        title: "Web3 Not Available",
        description: "Please install MetaMask to use this feature.",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
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
