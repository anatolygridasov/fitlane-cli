import ora from 'ora';
import { matchExplain } from '../lib/api.js';
import { printMatch } from '../lib/output.js';

export async function matchCmd(candidateId, jobId, opts) {
  const spinner = ora({ text: `Matching ${candidateId} vs ${jobId}...`, stream: process.stderr }).start();
  try {
    const payload = await matchExplain(candidateId, jobId);
    spinner.stop();
    if (opts.json) {
      console.log(JSON.stringify(payload, null, 2));
      return;
    }
    printMatch(payload);
  } catch (err) {
    spinner.fail(err.message);
    process.exitCode = 1;
  }
}
