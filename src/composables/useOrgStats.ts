import { ref, onMounted } from 'vue';

export interface OrgStats {
  members: number;
  repos: number;
  privateRepos: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  languages: string[];
  generatedAt: string;
  isFallback: boolean;
}

const FALLBACK: OrgStats = {
  members: 6,
  repos: 12,
  privateRepos: 3,
  publicRepos: 9,
  totalStars: 47,
  totalForks: 15,
  languages: ['TypeScript', 'Python', 'Go'],
  generatedAt: '',
  isFallback: true,
};

export function useOrgStats() {
  const stats = ref<OrgStats>(FALLBACK);
  const loading = ref(true);

  onMounted(async () => {
    try {
      const res = await fetch('/github-stats.json');
      if (!res.ok) throw new Error();
      const data = await res.json();
      stats.value = data;
    } catch {
      // FALLBACK values already set — no-op
    } finally {
      loading.value = false;
    }
  });

  return { stats, loading };
}
