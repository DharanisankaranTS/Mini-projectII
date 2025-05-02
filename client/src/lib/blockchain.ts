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

    // Gas estimation
    const gasEstimate = await contract.methods[method](...params).estimateGas({ from: account });
    
    // Execute transaction
    const result = await contract.methods[method](...params).send({
      from: account,
      gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer for gas
    });
    
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
    
    // Call (no transaction, just reading data)
    const result = await contract.methods[method](...params).call();
    return result;
  } catch (error) {
    console.error(`Error calling ${method}:`, error);
    throw error;
  }
};
