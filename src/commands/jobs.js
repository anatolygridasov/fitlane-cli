import ora from 'ora';
import { searchJobs } from '../lib/api.js';
import { printJobs } from '../lib/output.js';

export async function jobsCmd(query, opts) {
  const spinner = ora({ text: 'Searching jobs...', stream: process.stderr }).start();
  try {
    const payload = await searchJobs({
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
    printJobs(payload);
  } catch (err) {
    spinner.fail(err.message);
    process.exitCode = 1;
  }
}
