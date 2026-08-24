/**
 * Every string that reaches the screen lives in this shape.
 *
 * The rule: components never hold copy. If a component needs a word, it
 * comes from here — including labels, statuses, and aria text. That is what
 * makes the VI/EN toggle switch the *whole* page rather than half of it.
 */

export interface StatusLabels {
  active: string;
  development: string;
  planned: string;
}

export interface Milestone {
  date: string;
  title: string;
  body: string;
}

export interface WorkItem {
  tag: string;
  summary: string;
}

export interface Translation {
  meta: {
    tagline: string;
    description: string;
  };

  nav: {
    work: string;
    capabilities: string;
    trajectory: string;
    partners: string;
    team: string;
    contact: string;
    sideProjects: string;
  };

  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    switchTo: string;
    externalLink: string;
    scrollHint: string;
    mainNav: string;
  };

  hero: {
    eyebrow: string;
    /** Rendered one <span class="line"> per entry, masked on reveal. */
    headline: string[];
    lede: string;
    primaryCta: string;
    secondaryCta: string;
  };

  signal: {
    label: string;
    heading: string;
    lede: string;
    members: string;
    repositories: string;
    privateSuffix: string;
    stars: string;
    commits: string;
    commitsWindow: string;
    weekLabel: string;
    less: string;
    more: string;
    busiestRepo: string;
    acrossRepos: string;
    languages: string;
    orgLink: string;
    stale: string;
  };

  work: {
    label: string;
    heading: string;
    lede: string;
    statuses: StatusLabels;
    items: {
      nekoai: WorkItem;
      nekostream: WorkItem;
      nekostreamCli: WorkItem;
      fujiwara: WorkItem;
    };
    sideProjectsCta: string;
  };

  capabilities: {
    label: string;
    heading: string;
    lede: string;
    items: {
      product: WorkItem;
      platform: WorkItem;
      bots: WorkItem;
      gameservers: WorkItem;
    };
  };

  trajectory: {
    label: string;
    heading: string;
    lede: string;
    shipped: string;
    next: string;
    items: {
      founded: Milestone;
      firstShip: Milestone;
      growth: Milestone;
      nekoaiBeta: Milestone;
      nekostreamLaunch: Milestone;
      platform: Milestone;
    };
  };

  partners: {
    label: string;
    heading: string;
    lede: string;
    visit: string;
    discord: string;
    ctaLead: string;
    ctaLink: string;
    items: {
      langbangvn: { name: string; tag: string; badge: string; summary: string };
      nekostudio: { name: string; tag: string; badge: string; summary: string };
    };
  };

  team: {
    label: string;
    heading: string;
    lede: string;
    roles: {
      lead: string;
      frontend: string;
      backend: string;
      deploy: string;
    };
    osuProfile: string;
    website: string;
  };

  contact: {
    label: string;
    heading: string[];
    lede: string;
    github: string;
    discord: string;
    email: string;
  };

  footer: {
    builtWith: string;
    sourceLink: string;
    rights: string;
    sections: string;
    /** Precedes the live clock, e.g. "Shipping from". */
    status: string;
    /** Timezone label shown after the clock. */
    timezone: string;
  };

  sideProjects: {
    back: string;
    label: string;
    heading: string;
    lede: string;
    items: {
      nekobuckets: WorkItem;
      nekomusics: WorkItem;
    };
    actions: {
      invite: string;
      viewSource: string;
    };
  };
}
