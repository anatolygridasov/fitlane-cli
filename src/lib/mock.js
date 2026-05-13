const CANDIDATES = [
  {
    id: 'c_001',
    headline: 'Senior Backend Engineer',
    seniority: 'senior',
    years: 7,
    stack: ['python', 'fastapi', 'postgresql', 'kafka'],
    location: { city: 'Warsaw', country: 'PL', remote_ok: true },
    salary: { amount: 8500, currency: 'EUR', period: 'month' },
    highlight: 'Scaled fintech payments service from 8k to 65k RPS',
  },
  {
    id: 'c_002',
    headline: 'Senior Frontend Engineer',
    seniority: 'senior',
    years: 6,
    stack: ['typescript', 'next.js', 'react', 'tailwind'],
    location: { city: 'Berlin', country: 'DE', remote_ok: true },
    salary: { amount: 7800, currency: 'EUR', period: 'month' },
    highlight: 'Led design system rollout across 6 internal products',
  },
  {
    id: 'c_003',
    headline: 'Staff Backend Engineer',
    seniority: 'staff',
    years: 11,
    stack: ['go', 'postgresql', 'kubernetes', 'kafka'],
    location: { city: 'Lisbon', country: 'PT', remote_ok: true },
    salary: { amount: 10500, currency: 'EUR', period: 'month' },
    highlight: 'Cut p99 latency 60% via Postgres partitioning at scale',
  },
  {
    id: 'c_004',
    headline: 'Middle Full-Stack Engineer',
    seniority: 'middle',
    years: 4,
    stack: ['typescript', 'next.js', 'node.js', 'postgresql'],
    location: { city: 'Tbilisi', country: 'GE', remote_ok: true },
    salary: { amount: 4500, currency: 'EUR', period: 'month' },
    highlight: 'Shipped MVP-to-Series-A platform as second engineer',
  },
  {
    id: 'c_005',
    headline: 'Senior ML Engineer',
    seniority: 'senior',
    years: 8,
    stack: ['python', 'pytorch', 'fastapi', 'aws'],
    location: { city: 'Amsterdam', country: 'NL', remote_ok: true },
    salary: { amount: 9200, currency: 'EUR', period: 'month' },
    highlight: 'Built ranking pipeline serving 40M predictions/day',
  },
  {
    id: 'c_006',
    headline: 'Senior DevOps / SRE',
    seniority: 'senior',
    years: 9,
    stack: ['kubernetes', 'terraform', 'aws', 'go'],
    location: { city: 'Prague', country: 'CZ', remote_ok: true },
    salary: { amount: 8200, currency: 'EUR', period: 'month' },
    highlight: 'Migrated 80-service estate to Kubernetes with zero downtime',
  },
  {
    id: 'c_007',
    headline: 'Junior Backend Engineer',
    seniority: 'junior',
    years: 1,
    stack: ['python', 'fastapi', 'postgresql'],
    location: { city: 'Belgrade', country: 'RS', remote_ok: true },
    salary: { amount: 2400, currency: 'EUR', period: 'month' },
    highlight: 'Self-taught, 2 production projects, strong open-source contributions',
  },
  {
    id: 'c_008',
    headline: 'Senior iOS Engineer',
    seniority: 'senior',
    years: 9,
    stack: ['swift', 'swiftui', 'combine'],
    location: { city: 'Tallinn', country: 'EE', remote_ok: true },
    salary: { amount: 8000, currency: 'EUR', period: 'month' },
    highlight: 'Shipped 4 apps to the App Store, two with 1M+ installs',
  },
];

const JOBS = [
  {
    id: 'j_001',
    title: 'Senior Backend Engineer',
    company: 'Lumeris',
    domain: 'B2B payments',
    must_have_stack: ['python', 'fastapi', 'postgresql'],
    seniority: 'senior',
    salary_band: { min: 7000, max: 8500, currency: 'EUR', period: 'month' },
    remote: true,
    location: 'Remote, CET overlap',
  },
  {
    id: 'j_002',
    title: 'Senior Frontend Engineer',
    company: 'Brigantia',
    domain: 'B2B fintech analytics',
    must_have_stack: ['next.js', 'typescript', 'tailwind'],
    seniority: 'senior',
    salary_band: { min: 6500, max: 8000, currency: 'EUR', period: 'month' },
    remote: true,
    location: 'Remote, CET overlap',
  },
  {
    id: 'j_003',
    title: 'Staff Backend Engineer',
    company: 'Skywell',
    domain: 'real-time logistics',
    must_have_stack: ['go', 'kubernetes', 'kafka'],
    seniority: 'staff',
    salary_band: { min: 9000, max: 11000, currency: 'EUR', period: 'month' },
    remote: true,
    location: 'Remote EU',
  },
  {
    id: 'j_004',
    title: 'Full-Stack Engineer (Founding)',
    company: 'Pinepath',
    domain: 'AI-native CRM',
    must_have_stack: ['typescript', 'next.js', 'postgresql'],
    seniority: 'middle',
    salary_band: { min: 3500, max: 5000, currency: 'EUR', period: 'month' },
    remote: true,
    location: 'Remote, any timezone',
  },
  {
    id: 'j_005',
    title: 'Senior ML Engineer',
    company: 'Quantcrest',
    domain: 'ad-tech ranking',
    must_have_stack: ['python', 'pytorch'],
    seniority: 'senior',
    salary_band: { min: 8000, max: 10000, currency: 'EUR', period: 'month' },
    remote: true,
    location: 'Remote EU',
  },
  {
    id: 'j_006',
    title: 'Senior DevOps Engineer',
    company: 'Korvus',
    domain: 'B2B SaaS infrastructure',
    must_have_stack: ['kubernetes', 'terraform', 'aws'],
    seniority: 'senior',
    salary_band: { min: 7500, max: 9000, currency: 'EUR', period: 'month' },
    remote: true,
    location: 'Remote, EU timezone',
  },
];

export function mockCandidates({ query, limit = 5, location, seniority, stack }) {
  const tokens = tokenize(query);
  const stackFilter = parseList(stack);
  let results = CANDIDATES.map((c) => ({ ...c, score: scoreItem(c, tokens, stackFilter) }))
    .filter((c) => c.score > 0)
    .filter((c) => !seniority || c.seniority === seniority.toLowerCase())
    .filter((c) => !location || matchLocation(c.location, location))
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(limit));

  if (results.length === 0) results = CANDIDATES.slice(0, Number(limit)).map((c) => ({ ...c, score: 0 }));

  return { mode: 'mock', total: results.length, results };
}

export function mockJobs({ query, limit = 5, location, seniority, stack }) {
  const tokens = tokenize(query);
  const stackFilter = parseList(stack);
  let results = JOBS.map((j) => ({ ...j, score: scoreItem({ stack: j.must_have_stack, headline: j.title, seniority: j.seniority }, tokens, stackFilter) }))
    .filter((j) => j.score > 0)
    .filter((j) => !seniority || j.seniority === seniority.toLowerCase())
    .filter((j) => !location || matchLocation({ city: '', country: '', remote_ok: j.remote }, location) || j.location.toLowerCase().includes(location.toLowerCase()))
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(limit));

  if (results.length === 0) results = JOBS.slice(0, Number(limit)).map((j) => ({ ...j, score: 0 }));

  return { mode: 'mock', total: results.length, results };
}

export function mockMatch(candidateId, jobId) {
  const candidate = CANDIDATES.find((c) => c.id === candidateId);
  const job = JOBS.find((j) => j.id === jobId);
  if (!candidate || !job) {
    throw new Error(`Unknown ${!candidate ? 'candidate' : 'job'} id. In mock mode, valid IDs are c_001..c_008 and j_001..j_006.`);
  }

  const stackOverlap = job.must_have_stack.filter((s) => candidate.stack.includes(s));
  const stackScore = (stackOverlap.length / job.must_have_stack.length) * 60;
  const seniorityMap = { junior: 1, middle: 2, senior: 3, staff: 4, principal: 5 };
  const senDelta = Math.abs((seniorityMap[candidate.seniority] || 0) - (seniorityMap[job.seniority] || 0));
  const seniorityScore = Math.max(0, 20 - senDelta * 10);
  const remoteScore = candidate.location.remote_ok && job.remote ? 10 : 0;
  const exp = candidate.salary.amount;
  const max = job.salary_band.max;
  const salaryScore = exp <= max ? 10 : exp <= max * 1.15 ? 5 : 0;

  const score = Math.round(stackScore + seniorityScore + remoteScore + salaryScore);

  const fits = [];
  if (stackOverlap.length === job.must_have_stack.length) {
    fits.push(`Full stack overlap (${stackOverlap.join(', ')}) matches every must-have on the job.`);
  } else if (stackOverlap.length > 0) {
    fits.push(`Stack overlap: ${stackOverlap.join(', ')} (${stackOverlap.length}/${job.must_have_stack.length} must-haves).`);
  }
  if (senDelta === 0) fits.push(`Seniority match: candidate is ${candidate.seniority}, job asks for ${job.seniority}.`);
  if (candidate.location.remote_ok && job.remote) fits.push('Remote-friendly on both sides.');
  if (candidate.highlight) fits.push(`Notable: ${candidate.highlight}.`);

  const gaps = [];
  const missing = job.must_have_stack.filter((s) => !candidate.stack.includes(s));
  if (missing.length) gaps.push(`Missing must-haves: ${missing.join(', ')}.`);
  if (senDelta > 0) gaps.push(`Seniority gap: candidate ${candidate.seniority} vs job ${job.seniority}.`);
  if (exp > max) {
    const overshoot = Math.round(((exp - max) / max) * 100);
    gaps.push(`Salary expectation ${exp} ${candidate.salary.currency}/mo is ${overshoot}% above the band max (${max}).`);
  }

  const next =
    missing.length > 0
      ? `Verify whether ${missing[0]} is a real blocker or if recent work covers it.`
      : exp > max
        ? 'Discuss salary alignment before pushing to the hiring manager.'
        : 'Confirm start-date availability and notice period.';

  return {
    mode: 'mock',
    candidate_id: candidateId,
    job_id: jobId,
    score,
    fits,
    gaps: gaps.length ? gaps : ['No material gaps.'],
    recruiter_next_step: next,
  };
}

function tokenize(q) {
  if (!q) return [];
  return q
    .toLowerCase()
    .replace(/[^a-z0-9.\- ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function parseList(s) {
  if (!s) return [];
  return s.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
}

function scoreItem(item, tokens, stackFilter) {
  const haystack = [
    item.headline || '',
    (item.stack || []).join(' '),
    item.seniority || '',
  ]
    .join(' ')
    .toLowerCase();

  let score = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (haystack.includes(t)) score += 2;
  }
  for (const s of stackFilter) {
    if ((item.stack || []).includes(s)) score += 5;
    else return 0;
  }
  return tokens.length === 0 && stackFilter.length === 0 ? 1 : score;
}

function matchLocation(loc, filter) {
  const f = filter.toLowerCase();
  if (f === 'remote') return !!loc.remote_ok;
  return (loc.city || '').toLowerCase().includes(f) || (loc.country || '').toLowerCase().includes(f);
}
