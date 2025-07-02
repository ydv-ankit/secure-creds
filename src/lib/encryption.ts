import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

if (!ENCRYPTION_KEY) {
	throw new Error(
		"Please define the ENCRYPTION_KEY environment variable in .env.local"
	);
}

// Encrypt text
export function encrypt(text: string): string {
	try {
		return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
	} catch (error) {
		console.error("Encryption error:", error);
		throw new Error("Failed to encrypt data");
	}
}

// Decrypt text
export function decrypt(encryptedText: string): string {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
		return bytes.toString(CryptoJS.enc.Utf8);
	} catch (error) {
		console.error("Decryption error:", error);
		throw new Error("Failed to decrypt data");
	}
}

// Encrypt password specifically
export function encryptPassword(password: string): string {
	return encrypt(password);
}

// Decrypt password specifically
export function decryptPassword(encryptedPassword: string): string {
	return decrypt(encryptedPassword);
}
