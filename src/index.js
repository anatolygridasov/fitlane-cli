import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { configureCmd } from './commands/configure.js';
import { candidatesCmd } from './commands/candidates.js';
import { jobsCmd } from './commands/jobs.js';
import { matchCmd } from './commands/match.js';
import { whoamiCmd } from './commands/whoami.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

export async function run(argv) {
  const program = new Command();

  program
    .name('fitlane')
    .description('Fitlane CLI — search IT candidates and jobs from your terminal.\nDocs: https://fitlaneai.com')
    .version(pkg.version, '-v, --version');

  program
    .command('configure')
    .description('Set up your API key and base URL')
    .option('--reset', 'remove existing configuration')
    .action(configureCmd);

  program
    .command('whoami')
    .description('Show the current configuration')
    .action(whoamiCmd);

  program
    .command('candidates <query...>')
    .description('Search candidates ("senior react remote eu")')
    .option('-l, --limit <n>', 'how many results to return', '5')
    .option('--location <loc>', 'filter by location (city, country, or "remote")')
    .option('--seniority <level>', 'junior | middle | senior | staff | principal')
    .option('--stack <skills>', 'comma-separated must-have stack')
    .option('--json', 'output raw JSON')
    .action((queryParts, opts) => candidatesCmd(queryParts.join(' '), opts));

  program
    .command('jobs <query...>')
    .description('Search open jobs ("backend python b2b saas")')
    .option('-l, --limit <n>', 'how many results to return', '5')
    .option('--location <loc>', 'filter by location or "remote"')
    .option('--seniority <level>', 'junior | middle | senior | staff | principal')
    .option('--stack <skills>', 'comma-separated must-have stack')
    .option('--json', 'output raw JSON')
    .action((queryParts, opts) => jobsCmd(queryParts.join(' '), opts));

  program
    .command('match <candidateId> <jobId>')
    .description('Explain why a candidate fits a job')
    .option('--json', 'output raw JSON')
    .action(matchCmd);

  await program.parseAsync(argv);
}
