// Simple encryption utility using base64 encoding (for demo purposes)
// For production, use proper encryption libraries like tweetnacl or libsodium

const SECRET_KEY = 'deedvault-secret-key-2026'; // In production, use environment variables

export function encryptData(data: string): string {
  try {
    const encrypted = btoa(data + '::' + SECRET_KEY);
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptData(encrypted: string): string {
  try {
    const decrypted = atob(encrypted);
    const [data] = decrypted.split('::');
    return data;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

export function encryptObject(obj: any): string {
  try {
    const jsonString = JSON.stringify(obj);
    return encryptData(jsonString);
  } catch (error) {
    console.error('Object encryption error:', error);
    return '';
  }
}

export function decryptObject(encrypted: string): any {
  try {
    const decrypted = decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Object decryption error:', error);
    return null;
  }
}
