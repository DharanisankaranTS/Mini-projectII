import { db } from "./index";
import * as schema from "@shared/schema";
import { sql } from "drizzle-orm";

// Simple encryptor for sample data
const getEncryptedMedicalData = async (data: any) => {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

async function seed() {
  try {
    console.log("Starting database seed...");
    
    try {
      // Check if data already exists using raw SQL count
      const existingDonors = await db.select({
        count: sql<number>`count(*)`
      }).from(schema.donors);
      
      if (existingDonors.length > 0 && Number(existingDonors[0].count) > 0) {
        console.log("Data already exists in database, skipping seed");
        return;
      }
    } catch (error) {
      console.log("Error checking existing data, likely schema doesn't exist yet. Proceeding with seed anyway.");
    }

    // ----- Create Donors -----
    console.log("Creating donors...");
    
    const donors = [
      {
        name: "John Smith",
        email: "johnsmith@example.com",
        phone: "555-123-4567",
        address: "123 Main St, New York, NY",
        dateOfBirth: new Date("1980-05-15"),
        bloodType: "A+",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "180cm",
          weight: "75kg",
          allergies: "None",
          medications: "None",
          healthHistory: "Healthy"
        }),
        walletAddress: "0x3a2e45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a5f4",
        organType: "kidney",
        status: "active",
      },
      {
        name: "Sarah Johnson",
        email: "sarahjohnson@example.com",
        phone: "555-234-5678",
        address: "456 Oak Ave, Los Angeles, CA",
        dateOfBirth: new Date("1975-08-22"),
        bloodType: "O-",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "165cm",
          weight: "62kg",
          allergies: "Penicillin",
          medications: "None",
          healthHistory: "Healthy"
        }),
        walletAddress: "0x7c1d45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a3e42",
        organType: "liver",
        status: "active",
      },
      {
        name: "Michael Brown",
        email: "michaelbrown@example.com",
        phone: "555-345-6789",
        address: "789 Pine Rd, Chicago, IL",
        dateOfBirth: new Date("1990-01-10"),
        bloodType: "B+",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "175cm",
          weight: "80kg",
          allergies: "None",
          medications: "None",
          healthHistory: "Healthy"
        }),
        walletAddress: "0x9e4f45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a1a27",
        organType: "heart",
        status: "active",
      },
      {
        name: "Emily Wilson",
        email: "emilywilson@example.com",
        phone: "555-456-7890",
        address: "101 Maple Dr, Houston, TX",
        dateOfBirth: new Date("1985-11-30"),
        bloodType: "AB+",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "170cm",
          weight: "65kg",
          allergies: "Sulfa",
          medications: "None",
          healthHistory: "Healthy"
        }),
        walletAddress: "0x5b2c45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a7f63",
        organType: "cornea",
        status: "active",
      },
      {
        name: "David Lee",
        email: "davidlee@example.com",
        phone: "555-567-8901",
        address: "202 Cedar Ln, Seattle, WA",
        dateOfBirth: new Date("1988-07-05"),
        bloodType: "A-",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "182cm",
          weight: "78kg",
          allergies: "None",
          medications: "None",
          healthHistory: "Healthy"
        }),
        walletAddress: "0x2d8a45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a4e19",
        organType: "kidney",
        status: "active",
      }
    ];

    // Insert donors
    for (const donor of donors) {
      await db.insert(schema.donors).values(donor);
    }

    // ----- Create Recipients -----
    console.log("Creating recipients...");
    
    const recipients = [
      {
        name: "Robert Chen",
        email: "robertchen@example.com",
        phone: "555-678-9012",
        address: "303 Birch St, Boston, MA",
        dateOfBirth: new Date("1970-03-25"),
        bloodType: "O+",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "175cm",
          weight: "70kg",
          allergies: "None",
          medications: "Insulin",
          healthHistory: "Kidney disease"
        }),
        walletAddress: "0x71ae45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a4f09",
        organNeeded: "kidney",
        urgencyLevel: 8,
        status: "waiting",
      },
      {
        name: "Jennifer Martinez",
        email: "jennifermartinez@example.com",
        phone: "555-789-0123",
        address: "404 Willow Way, Miami, FL",
        dateOfBirth: new Date("1982-12-15"),
        bloodType: "A+",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "160cm",
          weight: "55kg",
          allergies: "Latex",
          medications: "Multiple",
          healthHistory: "Liver cirrhosis"
        }),
        walletAddress: "0x65fd45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a8b23",
        organNeeded: "liver",
        urgencyLevel: 7,
        status: "waiting",
      },
      {
        name: "William Taylor",
        email: "williamtaylor@example.com",
        phone: "555-890-1234",
        address: "505 Spruce St, Denver, CO",
        dateOfBirth: new Date("1965-09-08"),
        bloodType: "B-",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "178cm",
          weight: "85kg",
          allergies: "None",
          medications: "Multiple",
          healthHistory: "Heart failure"
        }),
        walletAddress: "0x89fa45f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a2d54",
        organNeeded: "heart",
        urgencyLevel: 9,
        status: "waiting",
      },
      {
        name: "Amanda Rodriguez",
        email: "amandarodriguez@example.com",
        phone: "555-901-2345",
        address: "606 Aspen Ave, Phoenix, AZ",
        dateOfBirth: new Date("1992-05-20"),
        bloodType: "AB-",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "168cm",
          weight: "60kg",
          allergies: "Peanuts",
          medications: "None",
          healthHistory: "Corneal damage"
        }),
        walletAddress: "0x47e245f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a1c38",
        organNeeded: "cornea",
        urgencyLevel: 5,
        status: "waiting",
      },
      {
        name: "Thomas White",
        email: "thomaswhite@example.com",
        phone: "555-012-3456",
        address: "707 Redwood Rd, Portland, OR",
        dateOfBirth: new Date("1978-02-14"),
        bloodType: "O-",
        encryptedMedicalData: await getEncryptedMedicalData({
          height: "185cm",
          weight: "90kg",
          allergies: "None",
          medications: "Multiple",
          healthHistory: "Kidney failure"
        }),
        walletAddress: "0x92c145f7c8d9b6a1e0f2d4c8b7a6e9d8c7b6a3a76",
        organNeeded: "kidney",
        urgencyLevel: 10,
        status: "waiting",
      }
    ];

    // Insert recipients
    for (const recipient of recipients) {
      await db.insert(schema.recipients).values(recipient);
    }

    // ----- Create Matches -----
    console.log("Creating matches...");
    
    // Get the inserted donors and recipients
    const insertedDonors = await db.query.donors.findMany();
    const insertedRecipients = await db.query.recipients.findMany();

    // Create some sample matches
    const matches = [
      {
        donorId: insertedDonors.find(d => d.organType === "kidney" && d.bloodType === "A+")?.id || 1,
        recipientId: insertedRecipients.find(r => r.organNeeded === "kidney" && r.bloodType === "A+")?.id || 1,
        organType: "kidney",
        compatibilityScore: 95,
        status: "pending",
        aiMatchData: {
          factors: {
            bloodTypeCompatibility: 100,
            organMatch: 100,
            tissueMatching: 92,
            ageFactors: 85,
            geographicProximity: 90
          },
          recommendation: "Highly Recommended"
        },
      },
      {
        donorId: insertedDonors.find(d => d.organType === "liver")?.id || 2,
        recipientId: insertedRecipients.find(r => r.organNeeded === "liver")?.id || 2,
        organType: "liver",
        compatibilityScore: 87,
        status: "pending",
        aiMatchData: {
          factors: {
            bloodTypeCompatibility: 100,
            organMatch: 100,
            tissueMatching: 85,
            ageFactors: 80,
            geographicProximity: 75
          },
          recommendation: "Highly Recommended"
        },
      },
      {
        donorId: insertedDonors.find(d => d.organType === "heart")?.id || 3,
        recipientId: insertedRecipients.find(r => r.organNeeded === "heart")?.id || 3,
        organType: "heart",
        compatibilityScore: 72,
        status: "pending",
        aiMatchData: {
          factors: {
            bloodTypeCompatibility: 80,
            organMatch: 100,
            tissueMatching: 75,
            ageFactors: 65,
            geographicProximity: 80
          },
          recommendation: "Recommended"
        },
      }
    ];

    // Insert matches
    for (const match of matches) {
      await db.insert(schema.matches).values(match);
    }

    // ----- Create Transactions -----
    console.log("Creating transactions...");
    
    const transactions = [
      {
        txHash: "0x3a2e8f91b6c7d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
        type: "donor_registration",
        donorId: insertedDonors[0].id,
        status: "confirmed",
        data: {
          organType: insertedDonors[0].organType,
          bloodType: insertedDonors[0].bloodType,
        },
        createdAt: new Date("2023-08-15 14:23:09"),
      },
      {
        txHash: "0x7c1d3e42b6c7d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
        type: "ai_match_found",
        donorId: insertedDonors[0].id,
        recipientId: insertedRecipients[0].id,
        matchId: 1,
        status: "confirmed",
        data: {
          organType: "kidney",
          compatibilityScore: 95,
        },
        createdAt: new Date("2023-08-15 12:48:33"),
      },
      {
        txHash: "0x9e4f1a27b6c7d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
        type: "recipient_registration",
        recipientId: insertedRecipients[0].id,
        status: "confirmed",
        data: {
          organNeeded: insertedRecipients[0].organNeeded,
          bloodType: insertedRecipients[0].bloodType,
          urgencyLevel: insertedRecipients[0].urgencyLevel,
        },
        createdAt: new Date("2023-08-15 10:15:21"),
      },
      {
        txHash: "0x5b2c7f63b6c7d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
        type: "donation_cancelled",
        donorId: insertedDonors[3].id,
        status: "cancelled",
        data: {
          organType: insertedDonors[3].organType,
          bloodType: insertedDonors[3].bloodType,
          reason: "Donor withdrew consent",
        },
        createdAt: new Date("2023-08-15 09:32:14"),
      },
      {
        txHash: "0x2d8a4e19b6c7d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
        type: "transplant_completion",
        donorId: insertedDonors[4].id,
        recipientId: insertedRecipients[4].id,
        status: "success",
        data: {
          organType: "kidney",
          bloodType: "A-",
          hospital: "Central Medical Center",
        },
        createdAt: new Date("2023-08-14 23:47:56"),
      }
    ];

    // Insert transactions
    for (const transaction of transactions) {
      await db.insert(schema.transactions).values(transaction);
    }

    // ----- Create Statistics -----
    console.log("Creating statistics...");
    
    const statistics = {
      totalDonors: insertedDonors.length,
      totalRecipients: insertedRecipients.length,
      pendingRequests: matches.filter(m => m.status === "pending").length,
      successfulMatches: 1, // One transplant completed
      aiMatchRate: 86.4,
      organTypeDistribution: {
        labels: ['Kidney', 'Liver', 'Heart', 'Lung', 'Cornea', 'Pancreas'],
        values: [423, 318, 156, 98, 211, 78],
      },
      regionalDistribution: {
        labels: ['North', 'South', 'East', 'West', 'Central'],
        values: [35, 20, 15, 18, 12],
      },
      lastUpdated: new Date(),
    };

    // Insert statistics
    await db.insert(schema.statistics).values(statistics);

    console.log("Database seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
