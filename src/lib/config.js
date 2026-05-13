import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, chmodSync } from 'node:fs';

const CONFIG_DIR = join(homedir(), '.config', 'fitlane');
const CONFIG_PATH = join(CONFIG_DIR, 'config.json');

const DEFAULTS = {
  baseUrl: 'https://api.fitlaneai.com/v1',
  apiKey: '',
  mode: 'mock',
};

export function loadConfig() {
  const fromEnv = {
    baseUrl: process.env.FITLANE_BASE_URL,
    apiKey: process.env.FITLANE_API_KEY,
    mode: process.env.FITLANE_MODE,
  };

  let fromFile = {};
  if (existsSync(CONFIG_PATH)) {
    try {
      fromFile = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
    } catch {
      fromFile = {};
    }
  }

  const merged = { ...DEFAULTS, ...fromFile };
  for (const k of Object.keys(fromEnv)) {
    if (fromEnv[k]) merged[k] = fromEnv[k];
  }
  return merged;
}

export function saveConfig(cfg) {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
  chmodSync(CONFIG_PATH, 0o600);
  return CONFIG_PATH;
}

export function resetConfig() {
  if (existsSync(CONFIG_PATH)) {
    unlinkSync(CONFIG_PATH);
    return CONFIG_PATH;
  }
  return null;
}

export function configPath() {
  return CONFIG_PATH;
}
