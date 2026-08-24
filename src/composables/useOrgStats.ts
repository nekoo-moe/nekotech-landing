import { ref, computed, onMounted } from 'vue';

/**
 * Build-time GitHub snapshot, written to `public/github-stats.json` by
 * `scripts/fetch-github-stats.ts`. The shape here mirrors that file exactly —
 * if the script changes, this changes with it.
 *
 * The fallback is not decoration: without a token the workflow still deploys,
 * and a page that renders zeros reads as broken. So the fallback carries
 * plausible values and flags itself via `isFallback`.
 */

export interface LangShare {
  name: string;
  percent: number;
}

export interface TopProject {
  name: string;
  description: string;
  commits: number;
  stars: number;
  forks: number;
  language: string;
  languages: LangShare[];
  url: string;
}

export interface OrgStats {
  members: number;
  repos: number;
  privateRepos: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  languages: LangShare[];
  topProject: TopProject;
  /** 52 weekly commit totals, oldest first. */
  commitActivity: number[];
  generatedAt: string;
  isFallback: boolean;
}

const FALLBACK: OrgStats = {
  members: 6,
  repos: 40,
  privateRepos: 32,
  publicRepos: 8,
  totalStars: 2,
  totalForks: 1,
  languages: [
    { name: 'JavaScript', percent: 28 },
    { name: 'Rust', percent: 24 },
    { name: 'Vue', percent: 11 },
    { name: 'TypeScript', percent: 10 },
    { name: 'Python', percent: 7 },
  ],
  topProject: {
    name: 'NekoStream-CLI',
    description: '',
    commits: 29,
    stars: 0,
    forks: 0,
    language: 'TypeScript',
    languages: [
      { name: 'TypeScript', percent: 82 },
      { name: 'JavaScript', percent: 12 },
      { name: 'HTML', percent: 5 },
      { name: 'CSS', percent: 1 },
    ],
    url: 'https://github.com/nekoo-moe',
  },
  commitActivity: new Array(52).fill(0),
  generatedAt: '',
  isFallback: true,
};

/**
 * GitHub's own language colours. Anything unlisted falls back to a neutral,
 * which is correct: an invented colour would imply a meaning it does not have.
 */
export const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Lua: '#000080',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
};

export function langColor(name: string): string {
  return LANG_COLORS[name] ?? 'var(--border-strong)';
}

export function useOrgStats() {
  const stats = ref<OrgStats>(FALLBACK);
  const loading = ref(true);

  onMounted(async () => {
    try {
      const res = await fetch('/github-stats.json');
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as Partial<OrgStats>;
      // Merge rather than replace: a snapshot missing a newly added field
      // should not blank the section out.
      stats.value = { ...FALLBACK, ...data, isFallback: data.isFallback ?? false };
    } catch {
      // FALLBACK is already in place.
    } finally {
      loading.value = false;
    }
  });

  /** Weekly totals bucketed to five intensity levels, GitHub-style. */
  const commitLevels = computed(() => {
    const weekly = stats.value.commitActivity;
    const peak = Math.max(...weekly, 1);
    return weekly.map((count, i) => ({
      count,
      week: weekly.length - i,
      level: count === 0 ? 0 : Math.min(4, Math.ceil((count / peak) * 4)),
    }));
  });

  const commitTotal = computed(() =>
    stats.value.commitActivity.reduce((a, b) => a + b, 0)
  );

  return { stats, loading, commitLevels, commitTotal };
}
