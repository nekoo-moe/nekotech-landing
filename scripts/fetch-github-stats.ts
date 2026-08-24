// scripts/fetch-github-stats.ts
// Run: npx tsx scripts/fetch-github-stats.ts
// Output: public/github-stats.json

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ORG = 'nekoo-moe';

// ── Always load .env.local first (overrides any stale session vars) ──────────
function loadEnvLocal() {
  const envPath = resolve('.env.local');
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, 'utf-8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    // Always override — file wins over stale session vars
    const val = trimmed.slice(eqIdx + 1).trim().replace(/\r/g, '').replace(/^["']|["']$/g, '');
    if (key && val) process.env[key] = val;
  }
}

loadEnvLocal();

const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  // A missing token used to mean "write zeros and give up", which put a dead
  // commit graph on the site. Public endpoints still answer without auth —
  // we just see the public repos rather than all of them.
  console.warn('[github-stats] No GITHUB_TOKEN — fetching PUBLIC data only.');
} else {
  console.log('[github-stats] Token loaded ✓ (length:', TOKEN.length, ')');
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────

// Authenticated fetch — for private endpoints
async function fetchAuth(url: string) {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) throw new Error(`GH ${res.status}: ${url}`);
  return res.json();
}

// Unauthenticated fetch — for public org data (non-member tokens get 401 on org routes)
async function fetchPub(url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) throw new Error(`GH ${res.status}: ${url}`);
  return res.json();
}

// Smart paginate: uses auth when token available (sees private repos), else public
async function paginate(baseUrl: string): Promise<any[]> {
  const all: any[] = [];
  let page = 1;
  const fetcher = process.env.GITHUB_TOKEN ? fetchAuth : fetchPub;
  while (true) {
    const sep = baseUrl.includes('?') ? '&' : '?';
    const data = await fetcher(`${baseUrl}${sep}per_page=100&page=${page}`) as any[];
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return all;
}

// ── Commit helpers ────────────────────────────────────────────────────────────

// Total commits for a single repo via participation stats
async function repoCommitCount(repoName: string): Promise<number> {
  try {
    const fetcher = process.env.GITHUB_TOKEN ? fetchAuth : fetchPub;
    const data = await fetcher(
      `https://api.github.com/repos/${ORG}/${repoName}/stats/participation`
    ) as any;
    if (data?.all && Array.isArray(data.all)) {
      return (data.all as number[]).reduce((a, b) => a + b, 0);
    }
  } catch { /* skip */ }
  return 0;
}

// 52-week commit activity across top repos
async function orgCommitActivity(repos: any[]): Promise<number[]> {
  const weekly = new Array(52).fill(0);
  const fetcher = process.env.GITHUB_TOKEN ? fetchAuth : fetchPub;
  const top15 = [...repos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 15);

  for (const repo of top15) {
    try {
      const data = await fetcher(
        `https://api.github.com/repos/${ORG}/${repo.name}/stats/participation`
      ) as any;
      if (data?.all && Array.isArray(data.all)) {
        (data.all as number[]).forEach((n, i) => { if (i < 52) weekly[i] += n; });
      }
      await new Promise(r => setTimeout(r, 120));
    } catch { /* skip */ }
  }
  return weekly;
}

// Language bytes across up to 20 repos
async function orgLanguages(repos: any[]): Promise<Record<string, number>> {
  const bytes: Record<string, number> = {};
  const fetcher = process.env.GITHUB_TOKEN ? fetchAuth : fetchPub;
  for (const repo of repos.slice(0, 20)) {
    try {
      const data = await fetcher(
        `https://api.github.com/repos/${ORG}/${repo.name}/languages`
      ) as Record<string, number>;
      for (const [lang, b] of Object.entries(data)) {
        bytes[lang] = (bytes[lang] ?? 0) + b;
      }
      await new Promise(r => setTimeout(r, 80));
    } catch { /* skip */ }
  }
  return bytes;
}

// ── Fallback data ─────────────────────────────────────────────────────────────
const FALLBACK = {
  members: 6,
  repos: 12,
  privateRepos: 3,
  publicRepos: 9,
  totalStars: 47,
  totalForks: 15,
  languages: [
    { name: 'TypeScript', percent: 45 },
    { name: 'Python', percent: 30 },
    { name: 'Go', percent: 25 },
  ],
  topProject: {
    name: 'NekoAI',
    description: '2D AI Agent powered by custom LLM orchestration',
    commits: 154, stars: 0, forks: 0,
    language: 'TypeScript',
    languages: [
      { name: 'TypeScript', percent: 80 },
      { name: 'Vue', percent: 20 },
    ],
    url: `https://github.com/${ORG}`,
  },
  commitActivity: new Array(52).fill(0),
  generatedAt: new Date().toISOString(),
  isFallback: true,
};

function writeJson(data: object) {
  mkdirSync(resolve('public'), { recursive: true });
  writeFileSync(resolve('public/github-stats.json'), JSON.stringify(data, null, 2));
}

// Previous snapshot, if any. Used to avoid regressing org-wide totals: an
// unauthenticated run only sees public repos, so it would report 9 repos and 2
// members for an org that really has 40 and 6. Those counts are facts about the
// org, not about our token — so the larger, truer number wins. Commit activity
// is always taken fresh, since that is the thing that goes stale.
function previousSnapshot(): any | null {
  try {
    const p = resolve('public/github-stats.json');
    if (!existsSync(p)) return null;
    const prev = JSON.parse(readFileSync(p, 'utf-8'));
    return prev?.isFallback ? null : prev;
  } catch { return null; }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('[github-stats] Fetching org data...');

    // All repos (public + private) when token available, else public only
    const repoType = process.env.GITHUB_TOKEN ? 'all' : 'public';
    const repos = await paginate(`https://api.github.com/orgs/${ORG}/repos?type=${repoType}`);
    console.log(`[github-stats] ${repos.length} repos (type=${repoType})`);

    // Org metadata — use auth for accurate private repo count
    let org: any = {};
    try { org = await (process.env.GITHUB_TOKEN ? fetchAuth : fetchPub)(`https://api.github.com/orgs/${ORG}`); } catch { /* ok */ }

    // Members (requires org membership — graceful fallback)
    let members: any[] = [];
    try {
      members = await fetchAuth(`https://api.github.com/orgs/${ORG}/members?per_page=100`) as any[];
    } catch { console.warn('[github-stats] Could not fetch members.'); }

    const totalStars = repos.reduce((s: number, r: any) => s + r.stargazers_count, 0);
    const totalForks = repos.reduce((s: number, r: any) => s + r.forks_count, 0);

    // Language breakdown
    console.log('[github-stats] Fetching languages...');
    const langBytes = await orgLanguages(repos);
    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langBytes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, b]) => ({
        name,
        percent: totalBytes > 0 ? Math.round((b / totalBytes) * 100) : 0,
      }));

    // Most-committed project
    console.log('[github-stats] Fetching commit counts...');
    const candidates = repos
      .filter((r: any) => !r.fork && !r.name.toLowerCase().includes('nekocomics'))
      .sort((a: any, b: any) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 10);

    const withCommits = await Promise.all(
      candidates.map(async (r: any) => ({ ...r, commitCount: await repoCommitCount(r.name) }))
    );
    const topRepo = withCommits.sort((a, b) => b.commitCount - a.commitCount)[0];

    // Fetch language breakdown for the top repo
    let topRepoLangs: { name: string; percent: number }[] = [];
    if (topRepo) {
      try {
        const fetcher = process.env.GITHUB_TOKEN ? fetchAuth : fetchPub;
        const rawLangs = await fetcher(
          `https://api.github.com/repos/${ORG}/${topRepo.name}/languages`
        ) as Record<string, number>;
        const totalLangBytes = Object.values(rawLangs).reduce((a, b) => a + b, 0);
        topRepoLangs = Object.entries(rawLangs)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, b]) => ({
            name,
            percent: totalLangBytes > 0 ? Math.round((b / totalLangBytes) * 100) : 0,
          }));
      } catch { /* skip */ }
    }

    const topProject = topRepo
      ? {
          name: topRepo.name,
          description: topRepo.description ?? '',
          commits: topRepo.commitCount,
          stars: topRepo.stargazers_count,
          forks: topRepo.forks_count,
          language: topRepo.language ?? 'Unknown',
          languages: topRepoLangs,
          url: topRepo.html_url,
        }
      : FALLBACK.topProject;

    // Commit activity (52 weeks)
    console.log('[github-stats] Fetching commit activity...');
    const commitActivity = await orgCommitActivity(repos);

    // Org-wide counts: keep the highest number we have ever seen. Without a
    // token this run is blind to private repos and org members, and reporting
    // the smaller public-only figure would look like the org shrank.
    const prev = previousSnapshot();
    const atLeast = (fresh: number, key: string) =>
      Math.max(fresh, typeof prev?.[key] === 'number' ? prev[key] : 0);

    const memberCount = members.length > 0 ? members.length : (org.members_count ?? FALLBACK.members);

    const stats = {
      members: atLeast(memberCount, 'members'),
      repos: atLeast(repos.length, 'repos'),
      privateRepos: atLeast(org.total_private_repos ?? FALLBACK.privateRepos, 'privateRepos'),
      publicRepos: repos.length,
      totalStars: atLeast(totalStars, 'totalStars'),
      totalForks: atLeast(totalForks, 'totalForks'),
      languages: languages.length ? languages : FALLBACK.languages,
      topProject,
      commitActivity,
      generatedAt: new Date().toISOString(),
      isFallback: false,
    };

    writeJson(stats);
    console.log('[github-stats] ✓ public/github-stats.json written');
    console.log(`  members:   ${stats.members}`);
    console.log(`  repos:     ${stats.repos}`);
    console.log(`  stars:     ${stats.totalStars}`);
    console.log(`  top:       ${stats.topProject.name} (${stats.topProject.commits} commits)`);
    console.log(`  languages: ${stats.languages.map((l: any) => `${l.name} ${l.percent}%`).join(', ')}`);
  } catch (err) {
    console.error('[github-stats] Fatal error, writing fallback:', err);
    writeJson(FALLBACK);
  }
}

main();
