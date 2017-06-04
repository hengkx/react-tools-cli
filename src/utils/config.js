import { join } from 'path';
import { existsSync, readFileSync, removeSync } from 'fs';

function getConfig(configDir) {
  const configPath = join(configDir, '.reactconfig');
  if (existsSync(configPath)) {
    try {
      return JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch (error) {
      removeSync(configPath);
      return {};
    }
  } else {
    return {};
  }
}

export default getConfig;
