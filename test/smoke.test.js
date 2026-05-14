import test from 'node:test';
import assert from 'node:assert/strict';
import { mockCandidates, mockJobs, mockMatch } from '../src/lib/mock.js';

test('mockCandidates returns results for a typical query', () => {
  const { results } = mockCandidates({ query: 'senior python backend', limit: 5 });
  assert.ok(results.length > 0, 'expected at least one candidate');
  assert.ok(results.every((c) => typeof c.id === 'string' && c.id.length > 0), 'candidate ids should be non-empty strings');
});

test('mockCandidates respects --seniority filter', () => {
  const { results } = mockCandidates({ query: '', limit: 10, seniority: 'staff' });
  assert.ok(results.every((c) => c.seniority === 'staff'));
});

test('mockCandidates respects --stack filter', () => {
  const { results } = mockCandidates({ query: '', limit: 10, stack: 'kubernetes' });
  assert.ok(results.length > 0);
  assert.ok(results.every((c) => c.stack.includes('kubernetes')));
});

test('mockJobs returns results for a stack query', () => {
  const { results } = mockJobs({ query: 'go kubernetes', limit: 5 });
  assert.ok(results.length > 0);
  assert.ok(results.every((j) => typeof j.id === 'string' && j.id.length > 0));
});

test('mockMatch returns a deterministic score for known IDs', () => {
  const r = mockMatch('marta-kowalska', 'lumeris-backend');
  assert.equal(typeof r.score, 'number');
  assert.ok(r.score >= 0 && r.score <= 100);
  assert.ok(Array.isArray(r.fits) && r.fits.length > 0);
  assert.ok(Array.isArray(r.gaps));
  assert.equal(typeof r.recruiter_next_step, 'string');
});

test('mockMatch throws for unknown IDs with helpful message', () => {
  assert.throws(() => mockMatch('no-such-candidate', 'lumeris-backend'), /candidate/);
  assert.throws(() => mockMatch('marta-kowalska', 'no-such-job'), /job/);
});
