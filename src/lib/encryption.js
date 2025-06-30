import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'inmomarket-secret-key-2024';

/**
 * Encrypts data using AES encryption
 * @param {any} data - Data to encrypt
 * @returns {string} - Encrypted data as string
 */
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts data using AES encryption
 * @param {string} encryptedData - Encrypted data string
 * @returns {any} - Decrypted data
 */
export const decryptData = (encryptedData) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    // If decryption fails, return null to indicate invalid data
    return null;
  }
};

/**
 * Custom storage implementation for Zustand persist middleware
 * This encrypts data before storing and decrypts when retrieving
 */
export const encryptedStorage = {
  getItem: (name) => {
    try {
      const encryptedValue = localStorage.getItem(name);
      if (!encryptedValue) return null;
      
      const decryptedValue = decryptData(encryptedValue);
      return decryptedValue ? JSON.stringify(decryptedValue) : null;
    } catch (error) {
      console.error('Error getting encrypted item:', error);
      return null;
    }
  },
  
  setItem: (name, value) => {
    try {
      const parsedValue = JSON.parse(value);
      const encryptedValue = encryptData(parsedValue);
      localStorage.setItem(name, encryptedValue);
    } catch (error) {
      console.error('Error setting encrypted item:', error);
      // Fallback to storing as-is if encryption fails
      localStorage.setItem(name, value);
    }
  },
  
  removeItem: (name) => {
    localStorage.removeItem(name);
  }
}; 