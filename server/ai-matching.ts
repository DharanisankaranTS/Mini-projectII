import { storage } from "./storage";
import { matches } from "@shared/schema";

// This file simulates a basic AI matching engine for organ donation
// In a production environment, this would connect to a Python microservice
// using more sophisticated machine learning models

// Constants for matching calculations
const BLOOD_TYPE_COMPATIBILITY = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"]
};

// Calculate proximity score based on location (simplified distance calculation)
function calculateProximityScore(location1: string, location2: string): number {
  // In a real implementation, this would use geolocation data and calculate actual distances
  // For this example, we'll return a random score if locations are different, 100 if they match
  if (location1.toLowerCase() === location2.toLowerCase()) {
    return 100;
  }
  
  // Simulate location proximity with a random score
  return Math.floor(Math.random() * 60) + 20; // 20-80 score range
}

// Calculate medical compatibility based on blood type, age, and other factors
function calculateMedicalCompatibility(donor: any, recipient: any): number {
  let score = 0;
  
  // Blood type compatibility (up to 40 points)
  const compatibleBloodTypes = BLOOD_TYPE_COMPATIBILITY[recipient.bloodType as keyof typeof BLOOD_TYPE_COMPATIBILITY] || [];
  if (compatibleBloodTypes.includes(donor.bloodType)) {
    score += 40;
  } else {
    // Not compatible, return 0
    return 0;
  }
  
  // Age compatibility (up to 20 points)
  // Simplified model: younger donors get higher scores
  const ageDifference = Math.abs(donor.age - recipient.age);
  if (ageDifference <= 5) {
    score += 20;
  } else if (ageDifference <= 10) {
    score += 15;
  } else if (ageDifference <= 20) {
    score += 10;
  } else {
    score += 5;
  }
  
  // Organ type match (must match exactly)
  if (donor.organType !== recipient.organNeeded) {
    return 0;
  }
  
  return score;
}

// Use urgency level to prioritize recipients
function calculateUrgencyScore(urgencyLevel: number): number {
  // Scale from 1-10 to 0-20
  return urgencyLevel * 2;
}

// Calculate waiting time score
function calculateWaitingTimeScore(createdAt: Date): number {
  const now = new Date();
  const waitingTimeInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Cap at 20 points (100 days or more)
  return Math.min(waitingTimeInDays / 5, 20);
}

// Combine all factors to calculate overall compatibility score
function calculateCompatibilityScore(donor: any, recipient: any): number {
  // Check basic compatibility first
  const medicalScore = calculateMedicalCompatibility(donor, recipient);
  if (medicalScore === 0) {
    return 0; // Not compatible
  }
  
  // Calculate other scores
  const proximityScore = calculateProximityScore(donor.location, recipient.location);
  const urgencyScore = calculateUrgencyScore(recipient.urgencyLevel);
  const waitingTimeScore = calculateWaitingTimeScore(recipient.createdAt);
  
  // Weighted sum (total max 100)
  // 40% medical compatibility, 20% proximity, 20% urgency, 20% waiting time
  const totalScore = 
    (medicalScore * 0.4) + 
    (proximityScore * 0.2) + 
    (urgencyScore * 0.2) + 
    (waitingTimeScore * 0.2);
  
  // Round to one decimal place
  return Math.round(totalScore * 10) / 10;
}

// Main function to run AI matching algorithm
export async function runAiMatching() {
  try {
    // Get all active donors and recipients
    const donors = await storage.getAllDonors();
    const recipients = await storage.getAllRecipients();
    
    // Filter for active donors and recipients
    const activeDonors = donors.filter(donor => donor.isActive);
    const activeRecipients = recipients.filter(recipient => recipient.isActive);
    
    // Array to store potential matches
    const potentialMatches = [];
    
    // For each donor, find potential recipient matches
    for (const donor of activeDonors) {
      for (const recipient of activeRecipients) {
        // Calculate compatibility score
        const compatibilityScore = calculateCompatibilityScore(donor, recipient);
        
        // Only consider matches with a compatibility score > 70
        if (compatibilityScore > 70) {
          potentialMatches.push({
            donorId: donor.id,
            recipientId: recipient.id,
            organType: donor.organType,
            compatibilityScore,
            matchData: {
              donorAge: donor.age,
              recipientAge: recipient.age,
              donorBloodType: donor.bloodType,
              recipientBloodType: recipient.bloodType,
              donorLocation: donor.location,
              recipientLocation: recipient.location,
              urgencyLevel: recipient.urgencyLevel
            }
          });
        }
      }
    }
    
    // Sort potential matches by compatibility score (descending)
    potentialMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    // Store matches in the database
    const savedMatches = [];
    for (const match of potentialMatches) {
      try {
        const savedMatch = await storage.createMatch(match);
        savedMatches.push(savedMatch);
      } catch (error) {
        console.error(`Error creating match: ${error}`);
      }
    }
    
    // Update AI match rate in stats
    if (potentialMatches.length > 0) {
      const highQualityMatches = potentialMatches.filter(match => match.compatibilityScore >= 85).length;
      const matchRate = Math.round((highQualityMatches / potentialMatches.length) * 1000) / 10;
      await storage.updateAiMatchRate(matchRate);
    }
    
    return {
      matchesFound: savedMatches.length,
      matches: savedMatches
    };
  } catch (error) {
    console.error('Error running AI matching:', error);
    throw error;
  }
}
