import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { decryptData } from "./encryption";
import { createBlockchainTransaction } from "./blockchain";

// Simulated ML service for organ compatibility matching
class OrganMatchingService {
  /**
   * Calculate compatibility score between donor and recipient
   * This is a simplified implementation of what would be a much more complex ML model
   */
  calculateCompatibilityScore(donor: any, recipient: any): number {
    // Basic compatibility check - blood type and organ type
    const bloodTypeMatch = this.checkBloodTypeCompatibility(donor.bloodType, recipient.bloodType);
    const organTypeMatch = donor.organType === recipient.organNeeded;

    if (!bloodTypeMatch || !organTypeMatch) {
      return 0; // No match
    }

    // Calculate base score (blood type + organ match = 70%)
    let score = 70;

    // Add bonus for rare blood types
    if (['AB-', 'AB+', 'B-', 'O-'].includes(donor.bloodType)) {
      score += 5;
    }

    // Add random medical factors (in a real system, this would involve complex ML)
    // We simulate this with a random factor between 0-25%
    const medicalFactors = Math.floor(Math.random() * 25);
    score += medicalFactors;

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Check if blood types are compatible for transplant
   */
  private checkBloodTypeCompatibility(donorBloodType: string, recipientBloodType: string): boolean {
    // Universal donor (O-) can donate to anyone
    if (donorBloodType === 'O-') return true;

    // O+ can donate to O+, A+, B+, AB+
    if (donorBloodType === 'O+') {
      return ['O+', 'A+', 'B+', 'AB+'].includes(recipientBloodType);
    }

    // A- can donate to A-, A+, AB-, AB+
    if (donorBloodType === 'A-') {
      return ['A-', 'A+', 'AB-', 'AB+'].includes(recipientBloodType);
    }

    // A+ can donate to A+, AB+
    if (donorBloodType === 'A+') {
      return ['A+', 'AB+'].includes(recipientBloodType);
    }

    // B- can donate to B-, B+, AB-, AB+
    if (donorBloodType === 'B-') {
      return ['B-', 'B+', 'AB-', 'AB+'].includes(recipientBloodType);
    }

    // B+ can donate to B+, AB+
    if (donorBloodType === 'B+') {
      return ['B+', 'AB+'].includes(recipientBloodType);
    }

    // AB- can donate to AB-, AB+
    if (donorBloodType === 'AB-') {
      return ['AB-', 'AB+'].includes(recipientBloodType);
    }

    // AB+ can only donate to AB+
    if (donorBloodType === 'AB+') {
      return recipientBloodType === 'AB+';
    }

    return false;
  }

  /**
   * Apply regional clustering for optimized allocation
   * In a real system, this would use K-means clustering
   */
  applyRegionalClustering(donors: any[], recipients: any[]): any[] {
    // This is a placeholder for K-means clustering algorithm
    // In a real implementation, this would group donors and recipients by geographic regions
    console.log('Applying regional clustering to optimize allocation');
    
    // For now, just return the input pairs
    return donors.map(donor => {
      return {
        donor,
        matches: recipients
          .filter(recipient => recipient.organNeeded === donor.organType)
          .map(recipient => ({
            recipient,
            score: this.calculateCompatibilityScore(donor, recipient)
          }))
          .filter(match => match.score > 0)
          .sort((a, b) => b.score - a.score)
      };
    });
  }

  /**
   * Simulate a machine learning prediction model
   */
  predictCompatibility(donorData: any, recipientData: any): any {
    // This would be a complex ML model in reality
    // For now, we'll simulate it with a simpler scoring system
    const baseScore = this.calculateCompatibilityScore(donorData, recipientData);
    
    // Add additional factors that would normally be part of an ML model
    const result = {
      overallScore: baseScore,
      factors: {
        bloodTypeCompatibility: this.checkBloodTypeCompatibility(donorData.bloodType, recipientData.bloodType) ? 100 : 0,
        organMatch: donorData.organType === recipientData.organNeeded ? 100 : 0,
        tissueMatching: Math.floor(Math.random() * 30) + 70, // Simulated tissue cross-match (70-100%)
        ageFactors: Math.floor(Math.random() * 40) + 60, // Simulated age compatibility (60-100%)
        geographicProximity: Math.floor(Math.random() * 20) + 80, // Simulated geographic proximity (80-100%)
      },
      recommendation: baseScore >= 75 ? 'Highly Recommended' : baseScore >= 50 ? 'Recommended' : 'Not Recommended',
    };
    
    return result;
  }
}

// Initialize the matching service
const matchingService = new OrganMatchingService();

/**
 * Calculate compatibility score between a donor and recipient
 */
export const calculateCompatibilityScore = (donor: any, recipient: any): number => {
  return matchingService.calculateCompatibilityScore(donor, recipient);
};

/**
 * Find potential matches for a donor or recipient
 */
export const findCompatibleMatches = async (
  donor: schema.Donor | null = null, 
  recipient: schema.Recipient | null = null
): Promise<void> => {
  try {
    if (!donor && !recipient) {
      throw new Error('Either donor or recipient must be provided');
    }

    if (donor) {
      // Find matches for a new donor
      const potentialRecipients = await db.query.recipients.findMany({
        where: and(
          eq(schema.recipients.status, 'waiting'),
          eq(schema.recipients.organNeeded, donor.organType)
        ),
      });

      for (const potentialRecipient of potentialRecipients) {
        const score = matchingService.calculateCompatibilityScore(donor, potentialRecipient);
        
        if (score >= 50) { // Only create matches with score >= 50%
          // Check if match already exists
          const existingMatch = await db.query.matches.findFirst({
            where: and(
              eq(schema.matches.donorId, donor.id),
              eq(schema.matches.recipientId, potentialRecipient.id)
            ),
          });

          if (!existingMatch) {
            // Create blockchain transaction for match
            const txHash = await createBlockchainTransaction('createMatch', {
              donorAddress: donor.walletAddress,
              recipientAddress: potentialRecipient.walletAddress,
              organType: donor.organType,
              compatibilityScore: score,
            });

            // Record the match in database
            const [match] = await db.insert(schema.matches).values({
              donorId: donor.id,
              recipientId: potentialRecipient.id,
              organType: donor.organType,
              compatibilityScore: score,
              status: 'pending',
              aiMatchData: matchingService.predictCompatibility(donor, potentialRecipient),
            }).returning();

            // Record blockchain transaction
            await db.insert(schema.transactions).values({
              txHash,
              type: 'ai_match_found',
              donorId: donor.id,
              recipientId: potentialRecipient.id,
              matchId: match.id,
              status: 'confirmed',
              data: {
                organType: donor.organType,
                compatibilityScore: score,
              },
            });

            console.log(`Created match between donor ${donor.id} and recipient ${potentialRecipient.id} with score ${score}`);
          }
        }
      }
    } else if (recipient) {
      // Find matches for a new recipient
      const potentialDonors = await db.query.donors.findMany({
        where: and(
          eq(schema.donors.status, 'active'),
          eq(schema.donors.organType, recipient.organNeeded)
        ),
      });

      for (const potentialDonor of potentialDonors) {
        const score = matchingService.calculateCompatibilityScore(potentialDonor, recipient);
        
        if (score >= 50) { // Only create matches with score >= 50%
          // Check if match already exists
          const existingMatch = await db.query.matches.findFirst({
            where: and(
              eq(schema.matches.donorId, potentialDonor.id),
              eq(schema.matches.recipientId, recipient.id)
            ),
          });

          if (!existingMatch) {
            // Create blockchain transaction for match
            const txHash = await createBlockchainTransaction('createMatch', {
              donorAddress: potentialDonor.walletAddress,
              recipientAddress: recipient.walletAddress,
              organType: potentialDonor.organType,
              compatibilityScore: score,
            });

            // Record the match in database
            const [match] = await db.insert(schema.matches).values({
              donorId: potentialDonor.id,
              recipientId: recipient.id,
              organType: potentialDonor.organType,
              compatibilityScore: score,
              status: 'pending',
              aiMatchData: matchingService.predictCompatibility(potentialDonor, recipient),
            }).returning();

            // Record blockchain transaction
            await db.insert(schema.transactions).values({
              txHash,
              type: 'ai_match_found',
              donorId: potentialDonor.id,
              recipientId: recipient.id,
              matchId: match.id,
              status: 'confirmed',
              data: {
                organType: potentialDonor.organType,
                compatibilityScore: score,
              },
            });

            console.log(`Created match between donor ${potentialDonor.id} and recipient ${recipient.id} with score ${score}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error finding compatible matches:', error);
    throw error;
  }
};
