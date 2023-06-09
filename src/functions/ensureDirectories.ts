import * as fs from 'fs';

/**
 * Ensure that all directories exist.
 * @param directories The directories to ensure.
 */
const ensureDirectories = async (directories: string[][]): Promise<void> => {
  for (const level of directories) {
    for (const dir of level) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }
};

export default ensureDirectories;
