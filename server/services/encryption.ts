import crypto from 'crypto';

// AES-256 Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 64;
const KEY_LENGTH = 32; // 256 bits
const TAG_LENGTH = 16; // For GCM

// Server-side encryption key (in production, this would be securely stored)
// Never expose this key in client-side code
const SERVER_KEY = process.env.ENCRYPTION_KEY || 'f9a4f9a6e9f2b3a8c7e2d5b6a1f8e2d5b6a1f8e2d5b6a1f8e2d5b6a1f8e2d5b6';

/**
 * Generate a key from password with salt using PBKDF2
 */
const getKeyFromPassword = (password: string, salt: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, KEY_LENGTH, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
};

/**
 * Encrypt data using AES-256-GCM
 * @param data - Data to encrypt
 * @returns Encrypted data as base64 string
 */
export const encryptData = async (data: string): Promise<string> => {
  try {
    // Generate a random salt
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Derive key from server key and salt
    const key = await getKeyFromPassword(SERVER_KEY, salt);
    
    // Generate random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt data
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Combine all components for storage
    const result = {
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      tag: authTag.toString('base64'),
      encrypted,
    };
    
    // Return combined data as JSON string encoded in base64
    return Buffer.from(JSON.stringify(result)).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - Encrypted data as base64 string
 * @returns Decrypted data
 */
export const decryptData = async (encryptedData: string): Promise<string> => {
  try {
    // Parse the encrypted data
    const parsedData = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
    
    // Convert components back to Buffers
    const salt = Buffer.from(parsedData.salt, 'base64');
    const iv = Buffer.from(parsedData.iv, 'base64');
    const authTag = Buffer.from(parsedData.tag, 'base64');
    
    // Derive key from server key and salt
    const key = await getKeyFromPassword(SERVER_KEY, salt);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt data
    let decrypted = decipher.update(parsedData.encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Verify Zero-Knowledge Proof
 * This is a placeholder. In a real implementation, this would use libraries like snarkjs
 * to verify zero-knowledge proofs.
 */
export const verifyZeroKnowledgeProof = (proof: any, publicInputs: any): boolean => {
  // In a real implementation, this would verify a ZK proof
  // For now, we'll always return true
  console.log('Verifying Zero-Knowledge Proof:', { proof, publicInputs });
  return true;
};

/**
 * Generate Zero-Knowledge Proof
 * This is a placeholder. In a real implementation, this would use libraries like snarkjs
 * to generate zero-knowledge proofs.
 */
export const generateZeroKnowledgeProof = (privateData: any, publicInputs: any): any => {
  // In a real implementation, this would generate a ZK proof
  // For now, we'll return a mock proof
  console.log('Generating Zero-Knowledge Proof:', { privateData, publicInputs });
  return {
    proof: {
      pi_a: ['123', '456', '789'],
      pi_b: [['123', '456'], ['789', '012']],
      pi_c: ['123', '456'],
    },
    publicSignals: ['123', '456'],
  };
};
