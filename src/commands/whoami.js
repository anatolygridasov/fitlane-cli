import pc from 'picocolors';
import { loadConfig, configPath } from '../lib/config.js';
import { activeMode } from '../lib/api.js';
import { existsSync } from 'node:fs';

export function whoamiCmd() {
  const cfg = loadConfig();
  const path = configPath();
  console.log('');
  console.log(`${pc.bold('Config file:')} ${existsSync(path) ? path : pc.dim(`${path} (not created — run "fitlane configure")`)}`);
  console.log(`${pc.bold('Mode:')}        ${activeMode()}`);
  console.log(`${pc.bold('Base URL:')}    ${cfg.baseUrl}`);
  console.log(`${pc.bold('API key:')}     ${cfg.apiKey ? pc.green('set') : pc.dim('(none)')}`);
  console.log('');
}
