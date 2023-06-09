import dotenv from 'dotenv';

dotenv.config();

const { env } = process;

type ProcessEnv = {
  [K in keyof NodeJS.ProcessEnv]: string;
};

/**
 * Verify the environment variables are all provided and of type 'string'.
 * @param envKeys The environment variables to verify.
 * @returns The verified environment variables.
 */
const verifyEnvironment = (envKeys: string[]): ProcessEnv => {
  /**
   * Check if all keys are defined and are strings.
   */
  envKeys.forEach((key) => {
    if (!env[key]) throw new Error(`env.${key} is not defined in .env file`);
    if (typeof env[key] !== 'string')
      throw new Error(`env.${key} is not a string`);
  });

  return env as ProcessEnv;
};

export default verifyEnvironment;
