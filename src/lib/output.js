import pc from 'picocolors';

export function printCandidates(payload) {
  const { results, mode } = payload;
  if (mode === 'mock') printMockBanner();
  if (!results.length) {
    console.log(pc.dim('No matches.'));
    return;
  }
  for (const c of results) {
    console.log('');
    console.log(`${pc.bold(c.id)}  ${pc.cyan(c.headline)}  ${pc.dim(`(${c.seniority}, ${c.years}y)`)}`);
    console.log(`  ${pc.dim('stack')}    ${c.stack.join(', ')}`);
    console.log(`  ${pc.dim('location')} ${c.location.city}, ${c.location.country}${c.location.remote_ok ? pc.green(' · remote-ok') : ''}`);
    console.log(`  ${pc.dim('salary')}   ${c.salary.amount} ${c.salary.currency}/${c.salary.period}`);
    if (c.highlight) console.log(`  ${pc.dim('signal')}   ${c.highlight}`);
  }
  console.log('');
  console.log(pc.dim(`${results.length} result(s). Run "fitlane match <candidateId> <jobId>" to see why a candidate fits a job.`));
}

export function printJobs(payload) {
  const { results, mode } = payload;
  if (mode === 'mock') printMockBanner();
  if (!results.length) {
    console.log(pc.dim('No matches.'));
    return;
  }
  for (const j of results) {
    console.log('');
    console.log(`${pc.bold(j.id)}  ${pc.cyan(j.title)} @ ${j.company}  ${pc.dim(`(${j.seniority})`)}`);
    console.log(`  ${pc.dim('domain')}   ${j.domain}`);
    console.log(`  ${pc.dim('stack')}    ${j.must_have_stack.join(', ')}`);
    console.log(`  ${pc.dim('location')} ${j.location}${j.remote ? pc.green(' · remote') : ''}`);
    console.log(`  ${pc.dim('band')}     ${j.salary_band.min}-${j.salary_band.max} ${j.salary_band.currency}/${j.salary_band.period}`);
  }
  console.log('');
  console.log(pc.dim(`${results.length} result(s).`));
}

export function printMatch(payload) {
  const { score, fits, gaps, recruiter_next_step, mode } = payload;
  if (mode === 'mock') printMockBanner();

  const color = score >= 80 ? pc.green : score >= 60 ? pc.yellow : pc.red;
  console.log('');
  console.log(`${pc.bold('Match score:')} ${color(`${score} / 100`)}`);
  console.log('');
  console.log(pc.bold('Why this fits'));
  for (const f of fits) console.log(`  - ${f}`);
  console.log('');
  console.log(pc.bold('Why it might not'));
  for (const g of gaps) console.log(`  - ${g}`);
  console.log('');
  console.log(pc.bold('Recruiter next step'));
  console.log(`  ${recruiter_next_step}`);
  console.log('');
}

function printMockBanner() {
  console.log(pc.dim('— sample data (mock mode). Run "fitlane configure" once the live API key is available. —'));
}
