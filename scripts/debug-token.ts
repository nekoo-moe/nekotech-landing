import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

async function go() {
  const envPath = resolve('.env.local');
  const raw = readFileSync(envPath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const line = lines.find(l => l.startsWith('GITHUB_TOKEN=')) ?? '';
  const val = line.slice('GITHUB_TOKEN='.length).replace(/\r/g, '').replace(/^["']|["']$/g, '');

  console.log('length:', val.length);
  console.log('prefix:', val.slice(0, 8));
  console.log('hex of first 4:', Buffer.from(val.slice(0, 4)).toString('hex'));

  const r = await fetch('https://api.github.com/orgs/nekoo-moe/repos?type=all&per_page=3', {
    headers: {
      Authorization: `Bearer ${val}`,
      Accept: 'application/vnd.github+json',
    }
  });
  console.log('status:', r.status);
  if (r.ok) {
    const data = await r.json() as any[];
    data.forEach(repo => console.log(' -', repo.name, repo.private ? '[PRIVATE]' : '[public]'));
  } else {
    const err = await r.json() as any;
    console.log('error:', err.message);
  }
}

go().catch(console.error);
