import * as fs from 'fs';

const directories = [
  ['./static', './tmp'],
  ['./static/v1/diep', './tmp/v1/diep'],
  ['./static/v1/diep/tanks', './static/v1/diep/stats'],
];

/**
 * Ensure that all directories exist.
 */
const ensureDirectories = async (): Promise<void> => {
  for (const level of directories) {
    for (const dir of level) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }
};

export default ensureDirectories;
