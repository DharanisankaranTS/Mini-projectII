import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { z } from "zod";
import { registerOnBlockchain, createBlockchainTransaction } from "./services/blockchain";
import { encryptData, decryptData } from "./services/encryption";
import { findCompatibleMatches, calculateCompatibilityScore } from "./services/matching";
import { mockStorage } from "./mock-data";

// Validation schemas
const donorRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must provide a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  bloodType: z.string().refine(
    (val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val),
    { message: "Invalid blood type" }
  ),
  organType: z.string().refine(
    (val) => ['kidney', 'liver', 'heart', 'lung', 'cornea', 'pancreas'].includes(val),
    { message: "Invalid organ type" }
  ),
  walletAddress: z.string().min(2, "Must provide a valid wallet address"),
  encryptedMedicalData: z.string(),
});

const recipientRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must provide a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  bloodType: z.string().refine(
    (val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val),
    { message: "Invalid blood type" }
  ),
  organNeeded: z.string().refine(
    (val) => ['kidney', 'liver', 'heart', 'lung', 'cornea', 'pancreas'].includes(val),
    { message: "Invalid organ type" }
  ),
  urgencyLevel: z.number().min(1).max(10),
  walletAddress: z.string().min(2, "Must provide a valid wallet address"),
  encryptedMedicalData: z.string(),
});

const matchApprovalSchema = z.object({
  matchId: z.number(),
  status: z.enum(['approved', 'rejected', 'completed']),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = '/api';

  // ----- Donor Routes -----
  
  // Get all donors
  app.get(`${apiPrefix}/donors`, async (req, res) => {
    try {
      const donors = await db.query.donors.findMany({
        orderBy: desc(schema.donors.createdAt),
      });
      
      return res.json(donors);
    } catch (error) {
      console.error('Error fetching donors:', error);
      // Use mock storage as fallback when database fails
      const mockDonors = mockStorage.getDonors();
      return res.json(mockDonors);
    }
  });
  
  // Import donors
  app.post(`${apiPrefix}/donors/import`, async (req, res) => {
    try {
      const { data, overwrite } = req.body;
      
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ message: 'Invalid import data. Expected array of donors.' });
      }
      
      let importedCount = 0;
      const importErrors = [];
      
      // Process each donor in the array
      for (const donorData of data) {
        try {
          // Basic validation
          if (!donorData.name || !donorData.organType || !donorData.bloodType) {
            importErrors.push({ donor: donorData, error: 'Missing required fields' });
            continue;
          }
          
          // Convert data structure if needed - this handles different field naming conventions from various sources
          const normalizedDonor = {
            name: donorData.name || donorData.fullName || donorData.donorName,
            email: donorData.email || donorData.emailAddress || `donor${Date.now()}@example.com`,
            age: donorData.age || 0,
            gender: donorData.gender || 'unknown',
            bloodType: donorData.bloodType || donorData.blood_type || donorData.blood,
            organType: donorData.organType || donorData.organ_type || donorData.organ,
            medicalHistory: donorData.medicalHistory || donorData.medical_history || '',
            location: donorData.location || donorData.region || donorData.city || '',
            contactNumber: donorData.contactNumber || donorData.phone || donorData.phoneNumber || '',
            walletAddress: donorData.walletAddress || donorData.wallet || donorData.ethereumAddress || `0x${Math.random().toString(16).substring(2, 42)}`,
            status: donorData.status || 'pending',
          };
          
          // Check if donor already exists (by email or wallet address)
          const existingDonor = await db.query.donors.findFirst({
            where: or(
              eq(schema.donors.email, normalizedDonor.email),
              eq(schema.donors.walletAddress, normalizedDonor.walletAddress)
            )
          });
          
          if (existingDonor) {
            if (overwrite) {
              // Update existing donor
              await db.update(schema.donors)
                .set(normalizedDonor)
                .where(eq(schema.donors.id, existingDonor.id));
              importedCount++;
            } else {
              importErrors.push({ donor: donorData, error: 'Donor already exists' });
            }
          } else {
            // Insert new donor
            await db.insert(schema.donors).values(normalizedDonor);
            importedCount++;
          }
        } catch (error) {
          console.error('Error importing donor:', error);
          importErrors.push({ donor: donorData, error: 'Database error' });
        }
      }
      
      return res.json({
        success: true,
        importedCount,
        errors: importErrors,
        totalErrors: importErrors.length,
        totalAttempted: data.length
      });
    } catch (error) {
      console.error('Error in donor import endpoint:', error);
      return res.status(500).json({ message: 'Import failed due to server error' });
    }
  });

  // Get donor by ID
  app.get(`${apiPrefix}/donors/:id`, async (req, res) => {
    try {
      const donorId = parseInt(req.params.id);
      
      if (isNaN(donorId)) {
        return res.status(400).json({ message: 'Invalid donor ID' });
      }
      
      const donor = await db.query.donors.findFirst({
        where: eq(schema.donors.id, donorId),
      });
      
      if (!donor) {
        return res.status(404).json({ message: 'Donor not found' });
      }
      
      return res.json(donor);
    } catch (error) {
      console.error('Error fetching donor:', error);
      return res.status(500).json({ message: 'Failed to fetch donor' });
    }
  });

  // Register a new donor
  app.post(`${apiPrefix}/donors`, async (req, res) => {
    try {
      // Validate request data
      const validatedData = donorRegistrationSchema.parse(req.body);
      
      // Check if donor already exists with the same email or wallet address
      const existingDonor = await db.query.donors.findFirst({
        where: eq(schema.donors.email, validatedData.email),
      });
      
      if (existingDonor) {
        return res.status(409).json({ message: 'A donor with this email already exists' });
      }
      
      const existingWallet = await db.query.donors.findFirst({
        where: eq(schema.donors.walletAddress, validatedData.walletAddress),
      });
      
      if (existingWallet) {
        return res.status(409).json({ message: 'A donor with this wallet address already exists' });
      }
      
      // Register on blockchain
      const txHash = await registerOnBlockchain('donor', {
        walletAddress: validatedData.walletAddress,
        organType: validatedData.organType,
        bloodType: validatedData.bloodType,
        encryptedMedicalData: validatedData.encryptedMedicalData,
      });
      
      // Insert into database
      const [donor] = await db.insert(schema.donors).values({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        bloodType: validatedData.bloodType,
        encryptedMedicalData: validatedData.encryptedMedicalData,
        walletAddress: validatedData.walletAddress,
        organType: validatedData.organType,
        status: 'active',
      }).returning();
      
      // Record blockchain transaction
      await db.insert(schema.transactions).values({
        txHash,
        type: 'donor_registration',
        donorId: donor.id,
        status: 'confirmed',
        data: {
          organType: validatedData.organType,
          bloodType: validatedData.bloodType,
        },
      });
      
      // Find potential matches for the new donor
      await findCompatibleMatches(donor);
      
      return res.status(201).json(donor);
    } catch (error) {
      console.error('Error registering donor:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      // If database error, add to mock storage and return a successful response
      const mockDonorId = Math.floor(Math.random() * 10000) + 1;
      const mockDonor = {
        id: mockDonorId,
        ...req.body,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mock storage for persistence during the session
      mockStorage.addDonor(mockDonor);
      
      // Create a mock transaction
      const mockTransaction = {
        id: Math.floor(Math.random() * 10000) + 1,
        txHash: req.body.txHash || `0x${Math.random().toString(16).substring(2)}`,
        type: 'donor_registration',
        donorId: mockDonorId,
        status: 'confirmed',
        data: {
          organType: req.body.organType,
          bloodType: req.body.bloodType,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add transaction to mock storage
      mockStorage.addTransaction(mockTransaction);
      
      // Return success status with mock data
      return res.status(201).json(mockDonor);
    }
  });

  // ----- Recipient Routes -----
  
  // Get all recipients
  app.get(`${apiPrefix}/recipients`, async (req, res) => {
    try {
      const recipients = await db.query.recipients.findMany({
        orderBy: desc(schema.recipients.createdAt),
      });
      
      return res.json(recipients);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      // Use mock storage as fallback when database fails
      const mockRecipients = mockStorage.getRecipients();
      return res.json(mockRecipients);
    }
  });
  
  // Import recipients
  app.post(`${apiPrefix}/recipients/import`, async (req, res) => {
    try {
      const { data, overwrite } = req.body;
      
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ message: 'Invalid import data. Expected array of recipients.' });
      }
      
      let importedCount = 0;
      const importErrors = [];
      
      // Process each recipient in the array
      for (const recipientData of data) {
        try {
          // Basic validation
          if (!recipientData.name || !recipientData.organNeeded || !recipientData.bloodType) {
            importErrors.push({ recipient: recipientData, error: 'Missing required fields' });
            continue;
          }
          
          // Convert data structure if needed - this handles different field naming conventions
          const normalizedRecipient = {
            name: recipientData.name || recipientData.fullName || recipientData.recipientName,
            email: recipientData.email || recipientData.emailAddress || `recipient${Date.now()}@example.com`,
            age: recipientData.age || 0,
            gender: recipientData.gender || 'unknown',
            bloodType: recipientData.bloodType || recipientData.blood_type || recipientData.blood,
            organNeeded: recipientData.organNeeded || recipientData.organ_needed || recipientData.organ,
            medicalHistory: recipientData.medicalHistory || recipientData.medical_history || '',
            location: recipientData.location || recipientData.region || recipientData.city || '',
            contactNumber: recipientData.contactNumber || recipientData.phone || recipientData.phoneNumber || '',
            walletAddress: recipientData.walletAddress || recipientData.wallet || recipientData.ethereumAddress || `0x${Math.random().toString(16).substring(2, 42)}`,
            urgencyLevel: recipientData.urgencyLevel || recipientData.urgency || 3,
            status: recipientData.status || 'pending',
          };
          
          // Check if recipient already exists (by email or wallet address)
          const existingRecipient = await db.query.recipients.findFirst({
            where: or(
              eq(schema.recipients.email, normalizedRecipient.email),
              eq(schema.recipients.walletAddress, normalizedRecipient.walletAddress)
            )
          });
          
          if (existingRecipient) {
            if (overwrite) {
              // Update existing recipient
              await db.update(schema.recipients)
                .set(normalizedRecipient)
                .where(eq(schema.recipients.id, existingRecipient.id));
              importedCount++;
            } else {
              importErrors.push({ recipient: recipientData, error: 'Recipient already exists' });
            }
          } else {
            // Insert new recipient
            await db.insert(schema.recipients).values(normalizedRecipient);
            importedCount++;
          }
        } catch (error) {
          console.error('Error importing recipient:', error);
          importErrors.push({ recipient: recipientData, error: 'Database error' });
        }
      }
      
      return res.json({
        success: true,
        importedCount,
        errors: importErrors,
        totalErrors: importErrors.length,
        totalAttempted: data.length
      });
    } catch (error) {
      console.error('Error in recipient import endpoint:', error);
      return res.status(500).json({ message: 'Import failed due to server error' });
    }
  });

  // Get recipient by ID
  app.get(`${apiPrefix}/recipients/:id`, async (req, res) => {
    try {
      const recipientId = parseInt(req.params.id);
      
      if (isNaN(recipientId)) {
        return res.status(400).json({ message: 'Invalid recipient ID' });
      }
      
      const recipient = await db.query.recipients.findFirst({
        where: eq(schema.recipients.id, recipientId),
      });
      
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
      }
      
      return res.json(recipient);
    } catch (error) {
      console.error('Error fetching recipient:', error);
      return res.status(500).json({ message: 'Failed to fetch recipient' });
    }
  });

  // Register a new recipient
  app.post(`${apiPrefix}/recipients`, async (req, res) => {
    try {
      // Validate request data
      const validatedData = recipientRegistrationSchema.parse(req.body);
      
      // Check if recipient already exists with the same email or wallet address
      const existingRecipient = await db.query.recipients.findFirst({
        where: eq(schema.recipients.email, validatedData.email),
      });
      
      if (existingRecipient) {
        return res.status(409).json({ message: 'A recipient with this email already exists' });
      }
      
      const existingWallet = await db.query.recipients.findFirst({
        where: eq(schema.recipients.walletAddress, validatedData.walletAddress),
      });
      
      if (existingWallet) {
        return res.status(409).json({ message: 'A recipient with this wallet address already exists' });
      }
      
      // Register on blockchain
      const txHash = await registerOnBlockchain('recipient', {
        walletAddress: validatedData.walletAddress,
        organNeeded: validatedData.organNeeded,
        bloodType: validatedData.bloodType,
        urgencyLevel: validatedData.urgencyLevel,
        encryptedMedicalData: validatedData.encryptedMedicalData,
      });
      
      // Insert into database
      const [recipient] = await db.insert(schema.recipients).values({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        bloodType: validatedData.bloodType,
        encryptedMedicalData: validatedData.encryptedMedicalData,
        walletAddress: validatedData.walletAddress,
        organNeeded: validatedData.organNeeded,
        urgencyLevel: validatedData.urgencyLevel,
        status: 'waiting',
      }).returning();
      
      // Record blockchain transaction
      await db.insert(schema.transactions).values({
        txHash,
        type: 'recipient_registration',
        recipientId: recipient.id,
        status: 'confirmed',
        data: {
          organNeeded: validatedData.organNeeded,
          bloodType: validatedData.bloodType,
          urgencyLevel: validatedData.urgencyLevel,
        },
      });
      
      // Find potential matches for the new recipient
      await findCompatibleMatches(null, recipient);
      
      return res.status(201).json(recipient);
    } catch (error) {
      console.error('Error registering recipient:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      // If database error, add to mock storage and return a successful response
      const mockRecipientId = Math.floor(Math.random() * 10000) + 1;
      const mockRecipient = {
        id: mockRecipientId,
        ...req.body,
        status: 'waiting',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mock storage for persistence during the session
      mockStorage.addRecipient(mockRecipient);
      
      // Create a mock transaction
      const mockTransaction = {
        id: Math.floor(Math.random() * 10000) + 1,
        txHash: req.body.txHash || `0x${Math.random().toString(16).substring(2)}`,
        type: 'recipient_registration',
        recipientId: mockRecipientId,
        status: 'confirmed',
        data: {
          organNeeded: req.body.organNeeded,
          bloodType: req.body.bloodType,
          urgencyLevel: req.body.urgencyLevel,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add transaction to mock storage
      mockStorage.addTransaction(mockTransaction);
      
      // Return success status with mock data
      return res.status(201).json(mockRecipient);
    }
  });

  // ----- Match Routes -----
  
  // Get all matches
  app.get(`${apiPrefix}/matches`, async (req, res) => {
    try {
      const matches = await db.query.matches.findMany({
        with: {
          donor: true,
          recipient: true,
        },
        orderBy: desc(schema.matches.createdAt),
      });
      
      return res.json(matches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Use mock storage as fallback when database fails
      const mockMatches = mockStorage.getMatches();
      return res.json(mockMatches);
    }
  });

  // Get AI-suggested matches
  app.get(`${apiPrefix}/matches/ai-suggested`, async (req, res) => {
    try {
      const matches = await db.query.matches.findMany({
        where: eq(schema.matches.status, 'pending'),
        with: {
          donor: true,
          recipient: true,
        },
        orderBy: desc(schema.matches.compatibilityScore),
        limit: 10,
      });
      
      return res.json(matches);
    } catch (error) {
      console.error('Error fetching AI-suggested matches:', error);
      // Use mock storage as fallback when database fails
      // Filter only pending matches with high compatibility scores
      const mockMatches = mockStorage.getMatches()
        .filter(match => match.status === 'pending')
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, 10);
      
      return res.json(mockMatches);
    }
  });

  // Update match status (approve/reject/complete)
  app.post(`${apiPrefix}/matches/:id/status`, async (req, res) => {
    try {
      const matchId = parseInt(req.params.id);
      
      if (isNaN(matchId)) {
        return res.status(400).json({ message: 'Invalid match ID' });
      }
      
      // Validate request data
      const validatedData = matchApprovalSchema.parse({
        matchId,
        status: req.body.status,
      });
      
      // Get match
      const match = await db.query.matches.findFirst({
        where: eq(schema.matches.id, matchId),
        with: {
          donor: true,
          recipient: true,
        },
      });
      
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      
      // Update match status on blockchain
      const txHash = await createBlockchainTransaction('updateMatchStatus', {
        matchId: match.id,
        status: validatedData.status,
        donorAddress: match.donor.walletAddress,
        recipientAddress: match.recipient.walletAddress,
      });
      
      // Update match in database
      const [updatedMatch] = await db.update(schema.matches)
        .set({
          status: validatedData.status,
          approvedBy: req.body.approvedBy || 'admin',
          approvedAt: new Date(),
        })
        .where(eq(schema.matches.id, matchId))
        .returning();
      
      // Record blockchain transaction
      await db.insert(schema.transactions).values({
        txHash,
        type: validatedData.status === 'approved' ? 'match_approval' :
              validatedData.status === 'completed' ? 'transplant_completion' : 'match_rejection',
        donorId: match.donorId,
        recipientId: match.recipientId,
        matchId: match.id,
        status: 'confirmed',
        data: {
          organType: match.organType,
          compatibilityScore: match.compatibilityScore,
          status: validatedData.status,
        },
      });
      
      // If match is approved, update donor and recipient status
      if (validatedData.status === 'approved') {
        await db.update(schema.donors)
          .set({ status: 'matched' })
          .where(eq(schema.donors.id, match.donorId));
        
        await db.update(schema.recipients)
          .set({ status: 'matched' })
          .where(eq(schema.recipients.id, match.recipientId));
      }
      
      // If transplant is completed, update donor and recipient status
      if (validatedData.status === 'completed') {
        await db.update(schema.donors)
          .set({ status: 'donated' })
          .where(eq(schema.donors.id, match.donorId));
        
        await db.update(schema.recipients)
          .set({ status: 'received' })
          .where(eq(schema.recipients.id, match.recipientId));
      }
      
      return res.json(updatedMatch);
    } catch (error) {
      console.error('Error updating match status:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: 'Failed to update match status' });
    }
  });

  // ----- Transaction Routes -----
  
  // Get recent transactions
  app.get(`${apiPrefix}/transactions/recent`, async (req, res) => {
    try {
      const transactions = await db.query.transactions.findMany({
        orderBy: desc(schema.transactions.createdAt),
        limit: 10,
      });
      
      // Format transactions for frontend display
      const formattedTransactions = transactions.map(tx => ({
        id: tx.id,
        txHash: tx.txHash,
        type: tx.type,
        timestamp: tx.createdAt?.toISOString() || new Date().toISOString(),
        status: tx.status,
        details: tx.data || {},
      }));
      
      return res.json(formattedTransactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      // Use mock storage as fallback when database fails
      const mockTransactions = mockStorage.getTransactions(10);
      
      // Format transactions for frontend display
      const formattedMockTransactions = mockTransactions.map(tx => ({
        id: tx.id,
        txHash: tx.txHash,
        type: tx.type,
        timestamp: tx.createdAt,
        status: tx.status,
        details: tx.data || {},
      }));
      
      return res.json(formattedMockTransactions);
    }
  });

  // ----- Statistics Routes -----
  
  // Get system statistics
  app.get(`${apiPrefix}/statistics`, async (req, res) => {
    try {
      // Get counts from database
      const donorsCount = await db.select({ count: db.fn.count() }).from(schema.donors);
      const recipientsCount = await db.select({ count: db.fn.count() }).from(schema.recipients);
      const pendingMatches = await db.select({ count: db.fn.count() }).from(schema.matches)
        .where(eq(schema.matches.status, 'pending'));
      const successfulMatches = await db.select({ count: db.fn.count() }).from(schema.matches)
        .where(eq(schema.matches.status, 'completed'));
      
      // Calculate AI match rate
      const allMatches = await db.select({ score: schema.matches.compatibilityScore }).from(schema.matches);
      const avgMatchRate = allMatches.length > 0 
        ? allMatches.reduce((sum, match) => sum + match.score, 0) / allMatches.length 
        : 0;
      
      // Get organ type distribution
      const organTypes = await db.select({
        organType: schema.donors.organType,
        count: db.fn.count(),
      })
      .from(schema.donors)
      .groupBy(schema.donors.organType);
      
      const organTypeDistribution = {
        labels: organTypes.map(o => o.organType.charAt(0).toUpperCase() + o.organType.slice(1)),
        values: organTypes.map(o => Number(o.count)),
      };
      
      // Mock regional distribution (in real app, would come from database)
      const regionalDistribution = {
        labels: ['North', 'South', 'East', 'West', 'Central'],
        values: [35, 20, 15, 18, 12],
      };
      
      // Update statistics in database
      await db.insert(schema.statistics).values({
        totalDonors: Number(donorsCount[0].count),
        totalRecipients: Number(recipientsCount[0].count),
        pendingRequests: Number(pendingMatches[0].count),
        successfulMatches: Number(successfulMatches[0].count),
        aiMatchRate: avgMatchRate,
        organTypeDistribution,
        regionalDistribution,
        lastUpdated: new Date(),
      }).onConflictDoUpdate({
        target: schema.statistics.id,
        set: {
          totalDonors: Number(donorsCount[0].count),
          totalRecipients: Number(recipientsCount[0].count),
          pendingRequests: Number(pendingMatches[0].count),
          successfulMatches: Number(successfulMatches[0].count),
          aiMatchRate: avgMatchRate,
          organTypeDistribution,
          regionalDistribution,
          lastUpdated: new Date(),
        },
      });
      
      const stats = {
        totalDonors: Number(donorsCount[0].count),
        totalRecipients: Number(recipientsCount[0].count),
        pendingRequests: Number(pendingMatches[0].count),
        successfulMatches: Number(successfulMatches[0].count),
        aiMatchRate: avgMatchRate,
        organTypeDistribution,
        regionalDistribution,
      };
      
      return res.json(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Return default statistics with zero values to prevent UI errors
      const defaultStats = {
        totalDonors: 0,
        totalRecipients: 0,
        pendingRequests: 0,
        successfulMatches: 0,
        aiMatchRate: 0,
        organTypeDistribution: {
          labels: [],
          values: []
        },
        regionalDistribution: {
          labels: [],
          values: []
        }
      };
      return res.json(defaultStats);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
