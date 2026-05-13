#!/usr/bin/env node
import pc from 'picocolors';
import { run } from '../src/index.js';

run(process.argv).catch((err) => {
  console.error(pc.red('error: ') + (err?.message || String(err)));
  process.exit(1);
});
