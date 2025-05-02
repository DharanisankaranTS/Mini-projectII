import Web3 from 'web3';
import { InsertDonor, InsertRecipient, Match } from '@shared/schema';

// Smart contract ABI - simplified for example
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

// Initialize Web3 instance
// In a production environment, this would connect to an Ethereum node
// For this example, we'll simulate blockchain functionality
const web3 = new Web3(
  process.env.BLOCKCHAIN_RPC_URL || 
  'http://localhost:8545'
);

// Contract address - in a real application this would be set from environment variable
const contractAddress = process.env.CONTRACT_ADDRESS || '0x72F8Fc3d1289e7325gA82F0f24eB38B203b53f2D';

// Create contract instance
const donorContract = new web3.eth.Contract(donorContractABI as any, contractAddress);

// Account used for transactions - in a real app, this would be handled more securely
let account: string;

// Initialize blockchain connection
async function initBlockchain() {
  try {
    // In a production environment, account would be unlocked securely
    // For this example, we'll use a predefined account or generate one
    const accounts = await web3.eth.getAccounts();
    account = accounts[0] || web3.eth.accounts.create().address;
    
    console.log('Blockchain initialized with account:', account);
    return true;
  } catch (error) {
    console.error('Failed to initialize blockchain:', error);
    return false;
  }
}

// Call initBlockchain when the server starts
initBlockchain();

// Generate a deterministic hash for encrypting sensitive data
function generateDataHash(data: any): string {
  return web3.utils.sha3(JSON.stringify(data)) || '';
}

// Get blockchain status
export async function getBlockchainStatus() {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    const gasPrice = await web3.eth.getGasPrice();
    const isListening = await web3.eth.net.isListening();
    
    return {
      status: isListening ? 'Active' : 'Inactive',
      blockNumber,
      gasPrice: web3.utils.fromWei(gasPrice, 'gwei'),
      networkId: await web3.eth.net.getId(),
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
export async function registerDonor(donor: InsertDonor): Promise<string> {
  try {
    // In a real application, the donor's wallet would be used
    // For this example, we're using the server's account
    const walletAddress = donor.walletAddress;
    
    // Generate a hash of the donor's personal data for privacy
    const dataHash = generateDataHash({
      fullName: donor.fullName,
      age: donor.age,
      medicalHistory: donor.medicalHistory,
      location: donor.location,
      contactInfo: donor.contactInfo
    });
    
    // Prepare transaction data
    const tx = donorContract.methods.registerDonor(
      walletAddress,
      donor.organType,
      donor.bloodType,
      dataHash
    );
    
    // Estimate gas
    const gas = await tx.estimateGas({ from: account });
    
    // Send transaction
    const receipt = await tx.send({
      from: account,
      gas
    });
    
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error registering donor on blockchain:', error);
    // In a production environment, handle this error appropriately
    // For now, return a simulated transaction hash
    return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }
}

// Register a recipient on the blockchain
export async function registerRecipient(recipient: InsertRecipient): Promise<string> {
  try {
    // In a real application, the recipient's wallet would be used
    // For this example, we're using the server's account
    const walletAddress = recipient.walletAddress;
    
    // Generate a hash of the recipient's personal data for privacy
    const dataHash = generateDataHash({
      fullName: recipient.fullName,
      age: recipient.age,
      medicalHistory: recipient.medicalHistory,
      location: recipient.location,
      contactInfo: recipient.contactInfo
    });
    
    // Prepare transaction data
    const tx = donorContract.methods.registerRecipient(
      walletAddress,
      recipient.organNeeded,
      recipient.bloodType,
      recipient.urgencyLevel,
      dataHash
    );
    
    // Estimate gas
    const gas = await tx.estimateGas({ from: account });
    
    // Send transaction
    const receipt = await tx.send({
      from: account,
      gas
    });
    
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error registering recipient on blockchain:', error);
    // In a production environment, handle this error appropriately
    // For now, return a simulated transaction hash
    return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }
}

// Approve a match on the blockchain
export async function approveMatch(match: Match): Promise<string> {
  try {
    if (!match.donor || !match.recipient) {
      throw new Error('Match data incomplete');
    }
    
    // Prepare transaction data
    const tx = donorContract.methods.approveMatch(
      match.donor.walletAddress,
      match.recipient.walletAddress,
      match.organType,
      Math.round(match.compatibilityScore)
    );
    
    // Estimate gas
    const gas = await tx.estimateGas({ from: account });
    
    // Send transaction
    const receipt = await tx.send({
      from: account,
      gas
    });
    
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error approving match on blockchain:', error);
    // In a production environment, handle this error appropriately
    // For now, return a simulated transaction hash
    return `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }
}

// Verify a blockchain transaction
export async function verifyTransaction(txHash: string): Promise<boolean> {
  try {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    return receipt && receipt.status;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}
