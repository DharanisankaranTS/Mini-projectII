import CryptoJS from 'crypto-js';
import elliptic from 'elliptic';

// Initialize elliptic curve
const EC = new elliptic.ec('secp256k1');

/**
 * Generates a new key pair for ECC
 * @returns Object containing public and private keys
 */
export function generateKeyPair() {
  const keyPair = EC.genKeyPair();
  return {
    privateKey: keyPair.getPrivate('hex'),
    publicKey: keyPair.getPublic('hex')
  };
}

/**
 * Encrypt data using AES-256
 * @param data Data to encrypt
 * @param key Encryption key (optional, will generate a random one if not provided)
 * @returns Encrypted data and used key
 */
export function encryptAES(data: string, key?: string) {
  // Generate random key if not provided
  const useKey = key || CryptoJS.lib.WordArray.random(32).toString();
  
  // Encrypt data
  const encrypted = CryptoJS.AES.encrypt(data, useKey).toString();
  
  return {
    encryptedData: encrypted,
    key: useKey
  };
}

/**
 * Decrypt AES-256 encrypted data
 * @param encryptedData Encrypted data
 * @param key Encryption key
 * @returns Decrypted data
 */
export function decryptAES(encryptedData: string, key: string) {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Encrypt data using ECC (for key exchange)
 * @param data Data to encrypt
 * @param publicKey Recipient's public key
 * @returns Encrypted data that only the holder of the private key can decrypt
 */
export function encryptECC(data: string, publicKey: string) {
  // First encrypt data with AES
  const { encryptedData, key } = encryptAES(data);
  
  // Then encrypt the AES key with ECC
  const recipientPublicKey = EC.keyFromPublic(publicKey, 'hex');
  const ephemeral = EC.genKeyPair();
  const sharedSecret = ephemeral.derive(recipientPublicKey.getPublic());
  const sharedSecretHex = sharedSecret.toString(16);
  
  // Use shared secret to encrypt the AES key
  const encryptedKey = CryptoJS.AES.encrypt(key, sharedSecretHex).toString();
  
  return {
    encryptedData,
    encryptedKey,
    ephemeralPublicKey: ephemeral.getPublic('hex')
  };
}

/**
 * Decrypt data that was encrypted with ECC
 * @param encryptedData Encrypted data
 * @param encryptedKey Encrypted AES key
 * @param ephemeralPublicKey Public key used during encryption
 * @param privateKey Recipient's private key
 * @returns Decrypted data
 */
export function decryptECC(
  encryptedData: string,
  encryptedKey: string,
  ephemeralPublicKey: string,
  privateKey: string
) {
  const recipientPrivateKey = EC.keyFromPrivate(privateKey, 'hex');
  const ephemeralPublic = EC.keyFromPublic(ephemeralPublicKey, 'hex');
  const sharedSecret = recipientPrivateKey.derive(ephemeralPublic.getPublic());
  const sharedSecretHex = sharedSecret.toString(16);
  
  // Decrypt the AES key
  const decryptedKey = CryptoJS.AES.decrypt(encryptedKey, sharedSecretHex).toString(CryptoJS.enc.Utf8);
  
  // Use the AES key to decrypt the data
  return decryptAES(encryptedData, decryptedKey);
}

/**
 * Create a hash of data (for ZKP verification)
 * @param data Data to hash
 * @returns Hash of the data
 */
export function hashData(data: any) {
  return CryptoJS.SHA256(JSON.stringify(data)).toString();
}

/**
 * Generate a zero-knowledge proof that you know a value without revealing it
 * This is a simplified ZKP implementation for demonstration
 * @param privateData Data to prove knowledge of without revealing
 * @param publicKey Public key 
 * @returns Zero-knowledge proof
 */
export function generateZKP(privateData: string, publicKey: string) {
  // Hash the private data
  const dataHash = hashData(privateData);
  
  // Generate a random nonce
  const nonce = CryptoJS.lib.WordArray.random(16).toString();
  
  // Create a ZKP commitment 
  const commitment = hashData({ dataHash, nonce, publicKey });
  
  return {
    commitment,
    nonce,
    // The verification would require more complex math for actual ZKP
    // This is a simplified version for demonstration
  };
}

/**
 * Verify a zero-knowledge proof
 * @param commitment ZKP commitment
 * @param nonce Nonce used in the ZKP
 * @param claimedDataHash Hash of the data being proved
 * @param publicKey Public key used in the proof
 * @returns Whether the proof is valid
 */
export function verifyZKP(
  commitment: string,
  nonce: string,
  claimedDataHash: string,
  publicKey: string
) {
  // Recreate the commitment
  const recreatedCommitment = hashData({ dataHash: claimedDataHash, nonce, publicKey });
  
  // Check if the recreated commitment matches the provided one
  return commitment === recreatedCommitment;
}
