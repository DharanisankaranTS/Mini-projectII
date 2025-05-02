import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export interface StorageInterface {
  // Donor operations
  getDonors(): Promise<schema.Donor[]>;
  getDonorById(id: number): Promise<schema.Donor | null>;
  getDonorByEmail(email: string): Promise<schema.Donor | null>;
  getDonorByWalletAddress(walletAddress: string): Promise<schema.Donor | null>;
  insertDonor(donor: schema.DonorInsert): Promise<schema.Donor>;
  updateDonorStatus(id: number, status: string): Promise<schema.Donor | null>;
  
  // Recipient operations
  getRecipients(): Promise<schema.Recipient[]>;
  getRecipientById(id: number): Promise<schema.Recipient | null>;
  getRecipientByEmail(email: string): Promise<schema.Recipient | null>;
  getRecipientByWalletAddress(walletAddress: string): Promise<schema.Recipient | null>;
  insertRecipient(recipient: schema.RecipientInsert): Promise<schema.Recipient>;
  updateRecipientStatus(id: number, status: string): Promise<schema.Recipient | null>;
  
  // Match operations
  getMatches(): Promise<any[]>;
  getMatchById(id: number): Promise<any | null>;
  insertMatch(match: schema.MatchInsert): Promise<any>;
  updateMatchStatus(id: number, status: string, approvedBy?: string): Promise<any | null>;
  
  // Transaction operations
  getTransactions(limit?: number): Promise<schema.Transaction[]>;
  insertTransaction(transaction: schema.TransactionInsert): Promise<schema.Transaction>;
  
  // Statistics operations
  getStatistics(): Promise<any>;
  updateStatistics(statistics: any): Promise<any>;
}

class PostgresStorage implements StorageInterface {
  // Donor operations
  async getDonors(): Promise<schema.Donor[]> {
    return db.query.donors.findMany({
      orderBy: desc(schema.donors.createdAt),
    });
  }
  
  async getDonorById(id: number): Promise<schema.Donor | null> {
    return db.query.donors.findFirst({
      where: eq(schema.donors.id, id),
    });
  }
  
  async getDonorByEmail(email: string): Promise<schema.Donor | null> {
    return db.query.donors.findFirst({
      where: eq(schema.donors.email, email),
    });
  }
  
  async getDonorByWalletAddress(walletAddress: string): Promise<schema.Donor | null> {
    return db.query.donors.findFirst({
      where: eq(schema.donors.walletAddress, walletAddress),
    });
  }
  
  async insertDonor(donor: schema.DonorInsert): Promise<schema.Donor> {
    const [inserted] = await db.insert(schema.donors).values(donor).returning();
    return inserted;
  }
  
  async updateDonorStatus(id: number, status: string): Promise<schema.Donor | null> {
    const [updated] = await db.update(schema.donors)
      .set({ status })
      .where(eq(schema.donors.id, id))
      .returning();
    return updated || null;
  }
  
  // Recipient operations
  async getRecipients(): Promise<schema.Recipient[]> {
    return db.query.recipients.findMany({
      orderBy: desc(schema.recipients.createdAt),
    });
  }
  
  async getRecipientById(id: number): Promise<schema.Recipient | null> {
    return db.query.recipients.findFirst({
      where: eq(schema.recipients.id, id),
    });
  }
  
  async getRecipientByEmail(email: string): Promise<schema.Recipient | null> {
    return db.query.recipients.findFirst({
      where: eq(schema.recipients.email, email),
    });
  }
  
  async getRecipientByWalletAddress(walletAddress: string): Promise<schema.Recipient | null> {
    return db.query.recipients.findFirst({
      where: eq(schema.recipients.walletAddress, walletAddress),
    });
  }
  
  async insertRecipient(recipient: schema.RecipientInsert): Promise<schema.Recipient> {
    const [inserted] = await db.insert(schema.recipients).values(recipient).returning();
    return inserted;
  }
  
  async updateRecipientStatus(id: number, status: string): Promise<schema.Recipient | null> {
    const [updated] = await db.update(schema.recipients)
      .set({ status })
      .where(eq(schema.recipients.id, id))
      .returning();
    return updated || null;
  }
  
  // Match operations
  async getMatches(): Promise<any[]> {
    return db.query.matches.findMany({
      with: {
        donor: true,
        recipient: true,
      },
      orderBy: desc(schema.matches.createdAt),
    });
  }
  
  async getMatchById(id: number): Promise<any | null> {
    return db.query.matches.findFirst({
      where: eq(schema.matches.id, id),
      with: {
        donor: true,
        recipient: true,
      },
    });
  }
  
  async insertMatch(match: schema.MatchInsert): Promise<any> {
    const [inserted] = await db.insert(schema.matches).values(match).returning();
    return this.getMatchById(inserted.id);
  }
  
  async updateMatchStatus(id: number, status: string, approvedBy?: string): Promise<any | null> {
    const [updated] = await db.update(schema.matches)
      .set({
        status,
        ...(approvedBy ? { approvedBy } : {}),
        ...(status !== 'pending' ? { approvedAt: new Date() } : {}),
      })
      .where(eq(schema.matches.id, id))
      .returning();
    
    if (!updated) return null;
    return this.getMatchById(updated.id);
  }
  
  // Transaction operations
  async getTransactions(limit?: number): Promise<schema.Transaction[]> {
    const query = db.select().from(schema.transactions).orderBy(desc(schema.transactions.createdAt));
    
    if (limit) {
      query.limit(limit);
    }
    
    return query;
  }
  
  async insertTransaction(transaction: schema.TransactionInsert): Promise<schema.Transaction> {
    const [inserted] = await db.insert(schema.transactions).values(transaction).returning();
    return inserted;
  }
  
  // Statistics operations
  async getStatistics(): Promise<any> {
    const stats = await db.query.statistics.findFirst({
      orderBy: desc(schema.statistics.lastUpdated),
    });
    
    if (!stats) {
      return {
        totalDonors: 0,
        totalRecipients: 0,
        pendingRequests: 0,
        successfulMatches: 0,
        aiMatchRate: 0,
        organTypeDistribution: {
          labels: ['Kidney', 'Liver', 'Heart', 'Lung', 'Cornea', 'Pancreas'],
          values: [0, 0, 0, 0, 0, 0],
        },
        regionalDistribution: {
          labels: ['North', 'South', 'East', 'West', 'Central'],
          values: [0, 0, 0, 0, 0],
        },
      };
    }
    
    return stats;
  }
  
  async updateStatistics(statistics: any): Promise<any> {
    const [updated] = await db.insert(schema.statistics)
      .values(statistics)
      .onConflictDoUpdate({
        target: schema.statistics.id,
        set: statistics,
      })
      .returning();
    
    return updated;
  }
}

// Export an instance of the storage interface
export const storage: StorageInterface = new PostgresStorage();
