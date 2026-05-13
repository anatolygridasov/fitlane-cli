import prompts from 'prompts';
import pc from 'picocolors';
import { loadConfig, saveConfig, resetConfig, configPath } from '../lib/config.js';

export async function configureCmd(opts) {
  if (opts.reset) {
    const removed = resetConfig();
    if (removed) console.log(pc.green('Removed ') + pc.dim(removed));
    else console.log(pc.dim('No configuration file to remove.'));
    return;
  }

  const current = loadConfig();
  const answers = await prompts([
    {
      type: 'select',
      name: 'mode',
      message: 'Run mode',
      choices: [
        { title: 'live  — call the Fitlane API with your key', value: 'live' },
        { title: 'mock  — use built-in sample data (no key required)', value: 'mock' },
      ],
      initial: current.mode === 'live' ? 0 : 1,
    },
    {
      type: (prev) => (prev === 'live' ? 'text' : null),
      name: 'baseUrl',
      message: 'API base URL',
      initial: current.baseUrl,
    },
    {
      type: (_, values) => (values.mode === 'live' ? 'password' : null),
      name: 'apiKey',
      message: 'API key (will be stored at ~/.config/fitlane/config.json, 0600)',
      initial: current.apiKey,
    },
  ]);

  if (!answers.mode) {
    console.log(pc.dim('Cancelled.'));
    return;
  }

  const next = {
    mode: answers.mode,
    baseUrl: answers.baseUrl || current.baseUrl,
    apiKey: answers.mode === 'live' ? answers.apiKey || '' : '',
  };

  const path = saveConfig(next);
  console.log(pc.green('Saved ') + pc.dim(path));
  console.log(pc.dim(`Mode: ${next.mode}${next.mode === 'live' ? ` · ${next.baseUrl}` : ''}`));
}
