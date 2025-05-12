/**
 * Mock data store for when database connection fails
 * This provides in-memory persistence during application runtime
 */

// Mock storage for donors, recipients and matches
export const mockStorage = {
  donors: [] as any[],
  recipients: [] as any[],
  matches: [] as any[],
  transactions: [] as any[],
  
  // Add a donor to the mock storage
  addDonor(donor: any) {
    this.donors.push(donor);
    return donor;
  },
  
  // Add a recipient to the mock storage
  addRecipient(recipient: any) {
    this.recipients.push(recipient);
    return recipient;
  },
  
  // Add a match to the mock storage
  addMatch(match: any) {
    this.matches.push(match);
    return match;
  },
  
  // Add a transaction to the mock storage
  addTransaction(transaction: any) {
    this.transactions.push(transaction);
    return transaction;
  },
  
  // Get all donors
  getDonors() {
    return this.donors;
  },
  
  // Get all recipients
  getRecipients() {
    return this.recipients;
  },
  
  // Get all matches
  getMatches() {
    return this.matches;
  },
  
  // Get recent transactions with optional limit
  getTransactions(limit?: number) {
    const sortedTransactions = [...this.transactions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    if (limit) {
      return sortedTransactions.slice(0, limit);
    }
    
    return sortedTransactions;
  },
  
  // Get statistics
  getStatistics() {
    return {
      totalDonors: this.donors.length,
      totalRecipients: this.recipients.length,
      pendingMatches: this.matches.filter(m => m.status === 'pending').length,
      approvedMatches: this.matches.filter(m => m.status === 'approved').length,
      successfulMatches: this.matches.filter(m => m.status === 'completed').length,
      // Default statistics
      aiMatchRate: 85,
      organTypeDistribution: {
        labels: ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas'],
        values: [45, 25, 15, 10, 5],
      },
      regionalDistribution: {
        labels: ['North', 'South', 'East', 'West', 'Central'],
        values: [30, 25, 15, 20, 10],
      },
    };
  }
};

// Initialize with some sample data if needed
if (process.env.NODE_ENV !== 'production') {
  // Sample donors
  mockStorage.addDonor({
    id: 1001,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    dateOfBirth: new Date('1980-05-15').toISOString(),
    bloodType: 'A+',
    organType: 'kidney',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    status: 'active',
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString()
  });
  
  mockStorage.addDonor({
    id: 1002,
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    dateOfBirth: new Date('1992-08-22').toISOString(),
    bloodType: 'O-',
    organType: 'liver',
    walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    status: 'active',
    createdAt: new Date('2025-02-05').toISOString(),
    updatedAt: new Date('2025-02-05').toISOString()
  });
  
  // Sample recipients
  mockStorage.addRecipient({
    id: 2001,
    name: 'Michael Williams',
    email: 'michael.williams@example.com',
    phone: '555-444-3333',
    address: '789 Pine St, Elsewhere, USA',
    dateOfBirth: new Date('1975-11-30').toISOString(),
    bloodType: 'AB+',
    organNeeded: 'kidney',
    urgencyLevel: 8,
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    status: 'waiting',
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  });
  
  mockStorage.addRecipient({
    id: 2002,
    name: 'Patricia Moore',
    email: 'patricia.moore@example.com',
    phone: '555-222-1111',
    address: '321 Maple Dr, Nowhereville, USA',
    dateOfBirth: new Date('1988-04-10').toISOString(),
    bloodType: 'O-',
    organNeeded: 'kidney',
    urgencyLevel: 5,
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    status: 'waiting',
    createdAt: new Date('2025-02-20').toISOString(),
    updatedAt: new Date('2025-02-20').toISOString()
  });
  
  // Sample matches
  mockStorage.addMatch({
    id: 3001,
    donorId: 1001,
    recipientId: 2001,
    donor: mockStorage.donors[0],
    recipient: mockStorage.recipients[0],
    organType: 'kidney',
    compatibilityScore: 92,
    status: 'pending',
    createdAt: new Date('2025-03-01').toISOString(),
    updatedAt: new Date('2025-03-01').toISOString()
  });
  
  mockStorage.addMatch({
    id: 3002,
    donorId: 1002,
    recipientId: 2002,
    donor: mockStorage.donors[1],
    recipient: mockStorage.recipients[1],
    organType: 'kidney',
    compatibilityScore: 98,
    status: 'approved',
    createdAt: new Date('2025-04-22').toISOString(),
    updatedAt: new Date('2025-04-22').toISOString()
  });
  
  // Sample transactions
  mockStorage.addTransaction({
    id: 4001,
    txHash: '0x5a1ed729c8f2ff0389f4da2bdc91b5ad8163ef4a3054269e61f5280a69696be1',
    type: 'donor_registration',
    donorId: 1001,
    status: 'confirmed',
    data: { organType: 'kidney', bloodType: 'A+' },
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-01-10').toISOString()
  });
  
  mockStorage.addTransaction({
    id: 4002,
    txHash: '0x8d2f3d44e7f739e79d1d4efe1f626c5183a8663b9d63186d44408b0849c61d1e',
    type: 'match_approval',
    donorId: 1002,
    recipientId: 2002,
    matchId: 3002,
    status: 'confirmed',
    data: { organType: 'kidney', compatibilityScore: 98 },
    createdAt: new Date('2025-04-22').toISOString(),
    updatedAt: new Date('2025-04-22').toISOString()
  });
}