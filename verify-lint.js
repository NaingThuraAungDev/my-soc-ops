#!/usr/bin/env node
// Quick script to verify ESLint runs without PowerShell 6+
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runLint() {
  try {
    console.log('Running ESLint...\n');
    const { stdout, stderr } = await execAsync('npx eslint .', { cwd: process.cwd() });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error('Errors found:');
      console.error(stderr);
      process.exit(1);
    }

    console.log('✓ All linting rules passed!');
    process.exit(0);
  } catch (error) {
    console.error('Linting failed:');
    console.error(error.stdout || error.message);
    process.exit(1);
  }
}

runLint();
