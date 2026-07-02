import CryptoJS from "crypto-js";

const SECRET_KEY = "healthcare-offline-secret-key-123";

const encryptionService = {
  encrypt(data) {
    if (!data) return data;
    const str = typeof data === "object" ? JSON.stringify(data) : String(data);
    return CryptoJS.AES.encrypt(str, SECRET_KEY).toString();
  },

  decrypt(ciphertext) {
    if (!ciphertext) return ciphertext;
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
      try {
        return JSON.parse(decryptedStr);
      } catch {
        return decryptedStr;
      }
    } catch (e) {
      console.error("Decryption failed:", e);
      return null;
    }
  },
};

export default encryptionService;