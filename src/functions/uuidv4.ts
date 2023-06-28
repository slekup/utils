import crypto from 'crypto';

/* eslint-disable no-bitwise */

/**
 * Generate a random UUIDv4 string.
 * @returns A random UUIDv4 string.
 */
const generateUUIDv4 = (): string => {
  const randomBytes = crypto.randomBytes(16);

  // Set the version and variant bits
  randomBytes[6] = (randomBytes[6] ?? 0 & 0x0f) | 0x40; // Version 4
  randomBytes[8] = (randomBytes[8] ?? 0 & 0x3f) | 0x80; // Variant 1*

  const hexDigits = '0123456789abcdef';
  let uuid = '';
  for (let index = 0; index < 16; index += 1) {
    const useIndex = randomBytes[index] ?? 0;
    uuid += hexDigits[useIndex >> 4];
    uuid += hexDigits[useIndex & 0x0f];
    if (index === 3 || index === 5 || index === 7 || index === 9) {
      uuid += '-';
    }
  }

  return uuid;
};

export default generateUUIDv4;
