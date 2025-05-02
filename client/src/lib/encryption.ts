import crypto from 'crypto-browserify';
import { Buffer } from 'buffer';

// AES-256 Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 64;
const KEY_LENGTH = 32; // 256 bits
const TAG_LENGTH = 16; // For GCM

// Public key for asymmetric encryption (in a real app, this would be securely stored and rotated)
// This is just for demonstration, in production you'd use proper key management
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz5IlXe5GK5V8BZyn+Zb8
mlhN5hGWZ0CkOEUoQobwRbPJ91kwZ2uXiKBEsK8sD2dA4x1X1v3SfPmX8y74XiOQ
FEVhf9Hg79Xr0gQbpYj9JJZcPzR3RPZf4dovEB7Z5G1+6X9nmbFTY6GxU7yY5MIV
tXh9Br+8Q4IXOxzV0ZyMrfN1UmUWTCjHNl+K+3NV7QfpX8kH6Hmwt4gQz/A9JXaQ
Ji7TxLLp1KY9bMQhhn3XlQsJibNP0DHROTZwQYKEOoNXWYLTZ7JbhkJf1KyLFe0p
wSGAgig7o3G4YIKr8SdXuDhEnrBRrG9G47LFfeknNQgCEYkQXcuRGhWZjcHJxRLQ
JwIDAQAB
-----END PUBLIC KEY-----`;

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
 * Encrypt data using AES-256-GCM with a random salt and initialization vector
 * @param data - Data to encrypt
 * @param password - Optional password (generates a random one if not provided)
 * @returns Encrypted data as base64 string
 */
export const encryptData = async (data: string, password?: string): Promise<string> => {
  try {
    // Generate a random salt
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Use provided password or generate a random one
    const actualPassword = password || crypto.randomBytes(32).toString('hex');
    
    // Derive key from password and salt
    const key = await getKeyFromPassword(actualPassword, salt);
    
    // Generate random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt data
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // If no password was provided, encrypt the generated password with public key for secure storage
    let encryptedPassword = actualPassword;
    if (!password) {
      const encryptBuffer = crypto.publicEncrypt(
        {
          key: PUBLIC_KEY,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(actualPassword)
      );
      encryptedPassword = encryptBuffer.toString('base64');
    }
    
    // Combine all components for storage: salt, iv, tag, encrypted data, and optionally encrypted password
    const result = {
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      tag: authTag.toString('base64'),
      encrypted,
      // Only include encrypted password if generated randomly
      ...(password ? {} : { encryptedPassword })
    };
    
    // Return combined data as JSON string encoded in base64
    return Buffer.from(JSON.stringify(result)).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * This is a placeholder for the decryption function.
 * In a real implementation, this would be performed server-side with proper key management
 * and would require appropriate authorization.
 */
export const decryptData = async (encryptedData: string, password?: string): Promise<string> => {
  try {
    // This is a simplified mock implementation
    // In a real system, this would be more secure and happen server-side
    
    // Parse the encrypted data
    const parsedData = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
    
    // Convert components back to Buffers
    const salt = Buffer.from(parsedData.salt, 'base64');
    const iv = Buffer.from(parsedData.iv, 'base64');
    const authTag = Buffer.from(parsedData.tag, 'base64');
    
    // If no password provided and we have an encrypted password, we'd decrypt it here
    // with a private key (omitted in this simplified example)
    const actualPassword = password || 'mock-password';
    
    // Derive key from password and salt
    const key = await getKeyFromPassword(actualPassword, salt);
    
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
