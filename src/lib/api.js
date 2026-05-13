import { mockCandidates, mockJobs, mockMatch } from './mock.js';
import { loadConfig } from './config.js';

const TIMEOUT_MS = 15000;

export async function searchCandidates(params) {
  const cfg = loadConfig();
  if (cfg.mode === 'mock' || !cfg.apiKey) {
    return mockCandidates(params);
  }
  return await request(cfg, '/candidates/search', params);
}

export async function searchJobs(params) {
  const cfg = loadConfig();
  if (cfg.mode === 'mock' || !cfg.apiKey) {
    return mockJobs(params);
  }
  return await request(cfg, '/jobs/search', params);
}

export async function matchExplain(candidateId, jobId) {
  const cfg = loadConfig();
  if (cfg.mode === 'mock' || !cfg.apiKey) {
    return mockMatch(candidateId, jobId);
  }
  return await request(cfg, '/match/explain', { candidate_id: candidateId, job_id: jobId });
}

export function activeMode() {
  const cfg = loadConfig();
  if (cfg.mode === 'mock') return 'mock';
  if (!cfg.apiKey) return 'mock (no API key)';
  return 'live';
}

async function request(cfg, path, body) {
  const url = trimTrailingSlash(cfg.baseUrl) + path;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
        'User-Agent': 'fitlane-cli',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await safeText(res);
      throw new Error(`API ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${TIMEOUT_MS / 1000}s`);
    }
    if (err.cause?.code === 'ENOTFOUND' || err.cause?.code === 'ECONNREFUSED') {
      throw new Error(`Cannot reach ${cfg.baseUrl}. The API may not be live yet — run "fitlane configure" and set mode=mock to use sample data.`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function safeText(res) {
  try {
    return (await res.text()).slice(0, 200);
  } catch {
    return '';
  }
}

function trimTrailingSlash(s) {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}
