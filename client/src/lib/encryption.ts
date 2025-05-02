import CryptoJS from 'crypto-js';

// This is a browser-compatible encryption implementation using crypto-js

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
 * Encrypt data using AES-256 with a password
 * This is a browser-compatible implementation using crypto-js
 * 
 * @param data - Data to encrypt
 * @param password - Optional password (generates a random one if not provided)
 * @returns Encrypted data as base64 string
 */
export const encryptData = async (data: string, password?: string): Promise<string> => {
  try {
    // Generate a random salt
    const salt = CryptoJS.lib.WordArray.random(128/8);
    
    // Use provided password or generate a random one
    const actualPassword = password || CryptoJS.lib.WordArray.random(256/8).toString();
    
    // Generate random IV
    const iv = CryptoJS.lib.WordArray.random(128/8);
    
    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(actualPassword, salt, {
      keySize: 256/32,
      iterations: 1000
    });
    
    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    
    // Store everything needed for decryption
    const result = {
      salt: salt.toString(CryptoJS.enc.Base64),
      iv: iv.toString(CryptoJS.enc.Base64),
      encrypted: encrypted.toString(),
      // Store password info if it was generated randomly
      ...(password ? {} : { encryptedPassword: actualPassword })
    };
    
    // Return as base64 encoded JSON
    return CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(JSON.stringify(result))
    );
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data encrypted with AES-256
 * This is a browser-compatible implementation using crypto-js
 * 
 * @param encryptedData - Base64 encoded encrypted data
 * @param password - Password used for encryption
 * @returns Decrypted data as string
 */
export const decryptData = async (encryptedData: string, password?: string): Promise<string> => {
  try {
    // Parse the encrypted data from base64
    const parsedEncrypted = JSON.parse(
      CryptoJS.enc.Utf8.stringify(
        CryptoJS.enc.Base64.parse(encryptedData)
      )
    );
    
    // Extract components
    const salt = CryptoJS.enc.Base64.parse(parsedEncrypted.salt);
    const iv = CryptoJS.enc.Base64.parse(parsedEncrypted.iv);
    const encrypted = parsedEncrypted.encrypted;
    
    // Use provided password or the stored one (in a real app, this would be more secure)
    const actualPassword = password || parsedEncrypted.encryptedPassword || 'mock-password';
    
    // Derive the same key
    const key = CryptoJS.PBKDF2(actualPassword, salt, {
      keySize: 256/32,
      iterations: 1000
    });
    
    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};
