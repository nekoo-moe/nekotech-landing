// scripts/fetch-github-stats.ts
// Runs at build time via: npx tsx scripts/fetch-github-stats.ts
// Writes to public/github-stats.json — fetched by frontend at runtime
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const ORG = 'NekoTech-Foundation';
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.warn('[github-stats] No GITHUB_TOKEN found — writing fallback data. Set GITHUB_TOKEN in .env.local for full stats including private repos.');
}

async function fetchWithAuth(url: string) {
  const res = await fetch(url, {
    headers: {
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${url}`);
  return res.json();
}

async function main() {
  const fallback = {
    members: 6,
    repos: 12,
    privateRepos: 3,
    publicRepos: 9,
    totalStars: 47,
    totalForks: 15,
    languages: ['TypeScript', 'Python', 'Go'],
    generatedAt: new Date().toISOString(),
    isFallback: true,
  };

  try {
    const [org, repos, members] = await Promise.all([
      fetchWithAuth(`https://api.github.com/orgs/${ORG}`),
      fetchWithAuth(`https://api.github.com/orgs/${ORG}/repos?type=all&per_page=100`),
      fetchWithAuth(`https://api.github.com/orgs/${ORG}/members?per_page=100`),
    ]);

    const totalStars = (repos as any[]).reduce((acc: number, r: any) => acc + r.stargazers_count, 0);
    const totalForks = (repos as any[]).reduce((acc: number, r: any) => acc + r.forks_count, 0);

    const langMap: Record<string, number> = {};
    (repos as any[]).forEach((r: any) => {
      if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1;
    });
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([l]) => l);

    const stats = {
      members: Array.isArray(members) ? members.length : (org as any).members_count ?? fallback.members,
      repos: (org as any).public_repos + ((org as any).total_private_repos ?? 0),
      privateRepos: (org as any).total_private_repos ?? 0,
      publicRepos: (org as any).public_repos,
      totalStars,
      totalForks,
      languages: languages.length ? languages : fallback.languages,
      generatedAt: new Date().toISOString(),
      isFallback: false,
    };

    mkdirSync(resolve('public'), { recursive: true });
    writeFileSync(resolve('public/github-stats.json'), JSON.stringify(stats, null, 2));
    console.log('[github-stats] ✓ Written to public/github-stats.json', stats);
  } catch (err) {
    console.error('[github-stats] Fetch failed, writing fallback:', err);
    mkdirSync(resolve('public'), { recursive: true });
    writeFileSync(resolve('public/github-stats.json'), JSON.stringify(fallback, null, 2));
  }
}

main();
