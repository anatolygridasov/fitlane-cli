import ora from 'ora';
import { searchCandidates } from '../lib/api.js';
import { printCandidates } from '../lib/output.js';

export async function candidatesCmd(query, opts) {
  const spinner = ora({ text: 'Searching candidates...', stream: process.stderr }).start();
  try {
    const payload = await searchCandidates({
      query,
      limit: opts.limit,
      location: opts.location,
      seniority: opts.seniority,
      stack: opts.stack,
    });
    spinner.stop();
    if (opts.json) {
      console.log(JSON.stringify(payload, null, 2));
      return;
    }
    printCandidates(payload);
  } catch (err) {
    spinner.fail(err.message);
    process.exitCode = 1;
  }
}
