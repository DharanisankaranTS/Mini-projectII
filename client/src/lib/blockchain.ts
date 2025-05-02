// ABI for the Donor Contract
export const donorContractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "donorAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "organType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      }
    ],
    "name": "DonorRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "matchId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "donorAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipientAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "organType",
        "type": "string"
      }
    ],
    "name": "MatchCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "matchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "status",
        "type": "string"
      }
    ],
    "name": "MatchStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipientAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "organNeeded",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "urgencyLevel",
        "type": "uint8"
      }
    ],
    "name": "RecipientRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_matchId",
        "type": "uint256"
      }
    ],
    "name": "approveMatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_matchId",
        "type": "uint256"
      }
    ],
    "name": "completeTransplant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "donors",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "organType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "encryptedMedicalData",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_donorAddress",
        "type": "address"
      }
    ],
    "name": "getDonorDetails",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "organType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "encryptedMedicalData",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_matchId",
        "type": "uint256"
      }
    ],
    "name": "getMatchDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "donorAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipientAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "organType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "compatibilityScore",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMatchesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_recipientAddress",
        "type": "address"
      }
    ],
    "name": "getRecipientDetails",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "organNeeded",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "urgencyLevel",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "encryptedMedicalData",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_matchId",
        "type": "uint256"
      }
    ],
    "name": "rejectMatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_organType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_bloodType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_encryptedMedicalData",
        "type": "string"
      }
    ],
    "name": "registerDonor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_organNeeded",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_bloodType",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_urgencyLevel",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_encryptedMedicalData",
        "type": "string"
      }
    ],
    "name": "registerRecipient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "recipients",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "organNeeded",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "bloodType",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "urgencyLevel",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "encryptedMedicalData",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_donorAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_recipientAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_organType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_compatibilityScore",
        "type": "uint256"
      }
    ],
    "name": "suggestMatch",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Mock version for Replit environment
export const interactWithBlockchain = async (
  web3: any,
  contract: any,
  method: string,
  params: any[] = [],
  account: string
) => {
  try {
    if (!web3 || !contract) {
      throw new Error("Web3 or contract not initialized");
    }

    console.log(`Calling ${method} with params:`, params);
    
    // Create mock result data based on method
    let result: any = {
      transactionHash: `0x${Math.random().toString(16).substring(2)}`,
      blockNumber: 12345678,
      events: {}
    };
    
    // Simulate different methods
    if (method === 'registerDonor') {
      result.events.DonorRegistered = {
        returnValues: {
          donorAddress: account,
          organType: params[0],
          bloodType: params[1]
        }
      };
    } else if (method === 'registerRecipient') {
      result.events.RecipientRegistered = {
        returnValues: {
          recipientAddress: account,
          organNeeded: params[0],
          bloodType: params[1],
          urgencyLevel: params[2]
        }
      };
    } else if (method === 'suggestMatch' || method === 'approveMatch') {
      result.events.MatchStatusUpdated = {
        returnValues: {
          matchId: typeof params[0] === 'number' ? params[0] : 1,
          status: 'Approved'
        }
      };
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return result;
  } catch (error) {
    console.error(`Error in ${method}:`, error);
    throw error;
  }
};

export const callContractMethod = async (
  web3: any,
  contract: any,
  method: string,
  params: any[] = []
) => {
  try {
    if (!web3 || !contract) {
      throw new Error("Web3 or contract not initialized");
    }
    
    console.log(`Calling read method ${method} with params:`, params);
    
    // Generate mock data based on the method being called
    let result: any;
    
    if (method === 'getDonorDetails') {
      result = {
        isRegistered: true,
        organType: 'Kidney',
        bloodType: 'O+',
        encryptedMedicalData: 'encrypted-data-mock',
        status: 'Available'
      };
    } else if (method === 'getRecipientDetails') {
      result = {
        isRegistered: true,
        organNeeded: 'Kidney',
        bloodType: 'AB+',
        urgencyLevel: 5,
        encryptedMedicalData: 'encrypted-data-mock',
        status: 'Waiting'
      };
    } else if (method === 'getMatchDetails') {
      result = {
        donorAddress: '0x123456789abcdef',
        recipientAddress: '0xabcdef123456789',
        organType: 'Kidney',
        compatibilityScore: 87,
        status: 'Pending',
        timestamp: Math.floor(Date.now() / 1000)
      };
    } else if (method === 'getMatchesCount') {
      result = 3;
    } else {
      // Default mock result
      result = true;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return result;
  } catch (error) {
    console.error(`Error calling ${method}:`, error);
    throw error;
  }
};
