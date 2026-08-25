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

/**
 * A shipped thing. Same shape as WorkItem plus `result`, because the argument
 * a finished project makes is what it did, not what it is.
 */
export interface ShowcaseItem {
  tag: string;
  summary: string;
  result: string;
}

/** One panel of the NekoAI slideshow. */
export interface ServiceSlide {
  kicker: string;
  title: string;
  body: string;
}

export interface Translation {
  meta: {
    tagline: string;
    description: string;
  };

  nav: {
    showcase: string;
    partners: string;
    work: string;
    services: string;
    capabilities: string;
    trajectory: string;
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

  /**
   * Showcase — the finished work. Separate from `work` because the two
   * sections make different arguments: this one is evidence, `work` is a
   * roadmap.
   */
  showcase: {
    label: string;
    heading: string;
    lede: string;
    liveLabel: string;
    caseLabel: string;
    viewLabel: string;
    resultLabel: string;
    items: {
      nekobuckets: ShowcaseItem;
      nekomusics: ShowcaseItem;
      coffoxmc: ShowcaseItem;
      fujiwara: ShowcaseItem;
    };
  };

  /**
   * Services — the commercial pitch, built around NekoAI. `slides` is an
   * ordered array rather than a keyed object because the slideshow renders it
   * in sequence and the count is allowed to change.
   */
  services: {
    label: string;
    heading: string;
    lede: string;
    /** The product pitch, shown once above the slideshow. */
    pitch: string;
    productName: string;
    productTag: string;
    slides: ServiceSlide[];
    cta: string;
    ctaNote: string;
    prev: string;
    next: string;
    /** aria-label pattern for a dot, e.g. "Go to panel {n}". */
    goTo: string;
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
    /** aria-label for the row button that promotes a member into the feature
        plate, e.g. "Show {name}". */
    showMember: string;
    /** Marks which member the feature plate is currently showing. */
    featured: string;
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
