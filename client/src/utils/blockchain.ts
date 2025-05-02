import Web3 from 'web3';

// Smart contract ABI - simplified
const donorContractABI = [
  {
    "inputs": [
      { "name": "walletAddress", "type": "address" },
      { "name": "organType", "type": "string" },
      { "name": "bloodType", "type": "string" },
      { "name": "dataHash", "type": "string" }
    ],
    "name": "registerDonor",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "inputs": [
      { "name": "walletAddress", "type": "address" },
      { "name": "organNeeded", "type": "string" },
      { "name": "bloodType", "type": "string" },
      { "name": "urgencyLevel", "type": "uint8" },
      { "name": "dataHash", "type": "string" }
    ],
    "name": "registerRecipient",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  },
  {
    "inputs": [
      { "name": "donorAddress", "type": "address" },
      { "name": "recipientAddress", "type": "address" },
      { "name": "organType", "type": "string" },
      { "name": "compatibilityScore", "type": "uint8" }
    ],
    "name": "approveMatch",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  }
];

// Address of the contract
const contractAddress = '0x72F8Fc3d1289e7325gA82F0f24eB38B203b53f2D';

// Utility function to check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  const { ethereum } = window as any;
  return Boolean(ethereum && ethereum.isMetaMask);
}

// Check if user is connected to MetaMask
export async function isConnectedToMetaMask(): Promise<boolean> {
  try {
    if (!isMetaMaskInstalled()) {
      return false;
    }
    
    const { ethereum } = window as any;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0;
  } catch (error) {
    console.error('Error checking MetaMask connection:', error);
    return false;
  }
}

// Connect to MetaMask
export async function connectToMetaMask(): Promise<string | null> {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    const { ethereum } = window as any;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    return null;
  }
}

// Initialize Web3 instance
export function getWeb3(): Web3 {
  if (isMetaMaskInstalled()) {
    const { ethereum } = window as any;
    return new Web3(ethereum);
  }
  
  // Fallback to HTTP provider
  return new Web3(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');
}

// Get contract instance
export function getContract() {
  const web3 = getWeb3();
  return new web3.eth.Contract(donorContractABI as any, contractAddress);
}

// Generate a hash for privacy-preserving data
export function generateDataHash(data: any): string {
  const web3 = getWeb3();
  return web3.utils.sha3(JSON.stringify(data)) || '';
}

// Get current blockchain status
export async function getBlockchainStatus() {
  try {
    const web3 = getWeb3();
    const blockNumber = await web3.eth.getBlockNumber();
    const isListening = await web3.eth.net.isListening();
    
    return {
      status: isListening ? 'Active' : 'Inactive',
      blockNumber,
      latestBlock: blockNumber,
      contractAddress
    };
  } catch (error) {
    console.error('Error getting blockchain status:', error);
    return {
      status: 'Error',
      error: (error as Error).message
    };
  }
}

// Register a donor on the blockchain
export async function registerDonor(donor: any) {
  try {
    const web3 = getWeb3();
    const contract = getContract();
    const accounts = await web3.eth.getAccounts();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available. Please connect to MetaMask.');
    }
    
    const dataHash = generateDataHash({
      fullName: donor.fullName,
      age: donor.age,
      medicalHistory: donor.medicalHistory,
      location: donor.location,
      contactInfo: donor.contactInfo
    });
    
    const result = await contract.methods.registerDonor(
      donor.walletAddress,
      donor.organType,
      donor.bloodType,
      dataHash
    ).send({ from: accounts[0] });
    
    return result;
  } catch (error) {
    console.error('Error registering donor on blockchain:', error);
    throw error;
  }
}

// Register a recipient on the blockchain
export async function registerRecipient(recipient: any) {
  try {
    const web3 = getWeb3();
    const contract = getContract();
    const accounts = await web3.eth.getAccounts();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available. Please connect to MetaMask.');
    }
    
    const dataHash = generateDataHash({
      fullName: recipient.fullName,
      age: recipient.age,
      medicalHistory: recipient.medicalHistory,
      location: recipient.location,
      contactInfo: recipient.contactInfo
    });
    
    const result = await contract.methods.registerRecipient(
      recipient.walletAddress,
      recipient.organNeeded,
      recipient.bloodType,
      recipient.urgencyLevel,
      dataHash
    ).send({ from: accounts[0] });
    
    return result;
  } catch (error) {
    console.error('Error registering recipient on blockchain:', error);
    throw error;
  }
}

// Approve a match on the blockchain
export async function approveMatch(match: any) {
  try {
    const web3 = getWeb3();
    const contract = getContract();
    const accounts = await web3.eth.getAccounts();
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available. Please connect to MetaMask.');
    }
    
    if (!match.donor || !match.recipient) {
      throw new Error('Match data incomplete');
    }
    
    const result = await contract.methods.approveMatch(
      match.donor.walletAddress,
      match.recipient.walletAddress,
      match.organType,
      Math.round(match.compatibilityScore)
    ).send({ from: accounts[0] });
    
    return result;
  } catch (error) {
    console.error('Error approving match on blockchain:', error);
    throw error;
  }
}
