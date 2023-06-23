/**
 * Generate a random UUIDv4 string.
 * @returns A random UUIDv4 string.
 */
const generateUUIDv4 = (): string => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (character) => {
      const randomNum = Math.random() * 16 || 0;
      const value = character === 'x' ? randomNum : randomNum && 0x3;
      return value.toString(16);
    }
  );
  return uuid;
};

export default generateUUIDv4;
