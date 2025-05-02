import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, numeric } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Donor table - stores donor information
export const donors = pgTable('donors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  bloodType: text('blood_type').notNull(),
  encryptedMedicalData: text('encrypted_medical_data').notNull(),
  walletAddress: text('wallet_address').notNull().unique(),
  organType: text('organ_type').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const donorsRelations = relations(donors, ({ many }) => ({
  matches: many(matches),
  transactions: many(transactions),
}));

// Recipients table - stores recipient information
export const recipients = pgTable('recipients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  bloodType: text('blood_type').notNull(),
  encryptedMedicalData: text('encrypted_medical_data').notNull(),
  walletAddress: text('wallet_address').notNull().unique(),
  organNeeded: text('organ_needed').notNull(),
  urgencyLevel: integer('urgency_level').notNull(),
  status: text('status').notNull().default('waiting'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recipientsRelations = relations(recipients, ({ many }) => ({
  matches: many(matches),
  transactions: many(transactions),
}));

// Matches table - stores potential matches between donors and recipients
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  donorId: integer('donor_id').references(() => donors.id).notNull(),
  recipientId: integer('recipient_id').references(() => recipients.id).notNull(),
  organType: text('organ_type').notNull(),
  compatibilityScore: real('compatibility_score').notNull(),
  status: text('status').notNull().default('pending'),
  aiMatchData: jsonb('ai_match_data'),
  approvedBy: text('approved_by'),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const matchesRelations = relations(matches, ({ one }) => ({
  donor: one(donors, { fields: [matches.donorId], references: [donors.id] }),
  recipient: one(recipients, { fields: [matches.recipientId], references: [recipients.id] }),
}));

// Blockchain transactions - records all blockchain transactions
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  txHash: text('tx_hash').notNull().unique(),
  blockNumber: integer('block_number'),
  type: text('type').notNull(), // donor_registration, recipient_registration, match_approval, transplant_completion
  donorId: integer('donor_id').references(() => donors.id),
  recipientId: integer('recipient_id').references(() => recipients.id),
  matchId: integer('match_id').references(() => matches.id),
  status: text('status').notNull(),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  donor: one(donors, { fields: [transactions.donorId], references: [donors.id] }),
  recipient: one(recipients, { fields: [transactions.recipientId], references: [recipients.id] }),
}));

// Admin users table
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI model metadata
export const aiModels = pgTable('ai_models', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  accuracy: real('accuracy').notNull(),
  lastUpdated: timestamp('last_updated').notNull(),
  modelParameters: jsonb('model_parameters'),
  active: boolean('active').notNull().default(true),
});

// System statistics
export const statistics = pgTable('statistics', {
  id: serial('id').primaryKey(),
  totalDonors: integer('total_donors').notNull(),
  totalRecipients: integer('total_recipients').notNull(),
  pendingRequests: integer('pending_requests').notNull(),
  successfulMatches: integer('successful_matches').notNull(),
  aiMatchRate: real('ai_match_rate').notNull(),
  organTypeDistribution: jsonb('organ_type_distribution').notNull(),
  regionalDistribution: jsonb('regional_distribution').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// Schema validation for inserting data
export const donorInsertSchema = createInsertSchema(donors, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
  phone: (schema) => schema.min(10, "Phone number must be at least 10 characters"),
  address: (schema) => schema.min(5, "Address must be at least 5 characters"),
  bloodType: (schema) => schema.refine(
    (val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val),
    { message: "Invalid blood type" }
  ),
  organType: (schema) => schema.refine(
    (val) => ['kidney', 'liver', 'heart', 'lung', 'cornea', 'pancreas'].includes(val),
    { message: "Invalid organ type" }
  ),
  walletAddress: (schema) => schema.min(42, "Must provide a valid wallet address"),
});

export const recipientInsertSchema = createInsertSchema(recipients, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
  phone: (schema) => schema.min(10, "Phone number must be at least 10 characters"),
  address: (schema) => schema.min(5, "Address must be at least 5 characters"),
  bloodType: (schema) => schema.refine(
    (val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val),
    { message: "Invalid blood type" }
  ),
  organNeeded: (schema) => schema.refine(
    (val) => ['kidney', 'liver', 'heart', 'lung', 'cornea', 'pancreas'].includes(val),
    { message: "Invalid organ type" }
  ),
  urgencyLevel: (schema) => schema.min(1).max(10),
  walletAddress: (schema) => schema.min(42, "Must provide a valid wallet address"),
});

export const matchInsertSchema = createInsertSchema(matches, {
  compatibilityScore: (schema) => schema.min(0).max(100),
  status: (schema) => schema.refine(
    (val) => ['pending', 'approved', 'rejected', 'completed'].includes(val),
    { message: "Invalid match status" }
  ),
});

export const transactionInsertSchema = createInsertSchema(transactions, {
  type: (schema) => schema.refine(
    (val) => ['donor_registration', 'recipient_registration', 'match_approval', 'transplant_completion', 'match_rejection', 'donation_cancelled'].includes(val),
    { message: "Invalid transaction type" }
  ),
  status: (schema) => schema.refine(
    (val) => ['pending', 'confirmed', 'failed', 'cancelled'].includes(val),
    { message: "Invalid transaction status" }
  ),
});

export const adminInsertSchema = createInsertSchema(admins, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(8, "Password must be at least 8 characters"),
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  role: (schema) => schema.refine(
    (val) => ['admin', 'doctor', 'coordinator'].includes(val),
    { message: "Invalid role" }
  ),
});

// Type definitions
export type Donor = typeof donors.$inferSelect;
export type DonorInsert = z.infer<typeof donorInsertSchema>;

export type Recipient = typeof recipients.$inferSelect;
export type RecipientInsert = z.infer<typeof recipientInsertSchema>;

export type Match = typeof matches.$inferSelect;
export type MatchInsert = z.infer<typeof matchInsertSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type TransactionInsert = z.infer<typeof transactionInsertSchema>;

export type Admin = typeof admins.$inferSelect;
export type AdminInsert = z.infer<typeof adminInsertSchema>;
