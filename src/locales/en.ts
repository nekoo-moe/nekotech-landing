import { Translation } from './types';

/**
 * Tone: say what exists, not what we aspire to. Concrete nouns, real dates,
 * no "cutting-edge", no "revolutionise". If a sentence would survive being
 * pasted into a changelog, it belongs here.
 */
const en: Translation = {
  meta: {
    tagline: 'We ship software in the open.',
    description:
      'NekoTech Foundation is a developer collective from Vietnam building AI agents, streaming infrastructure and developer tools — in public, from the first commit.',
  },

  nav: {
    work: 'Work',
    capabilities: 'Capabilities',
    trajectory: 'Trajectory',
    partners: 'Partners',
    team: 'Team',
    contact: 'Contact',
    sideProjects: 'Side projects',
  },

  a11y: {
    skipToContent: 'Skip to content',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    switchTo: 'Switch to Vietnamese',
    externalLink: 'opens in a new tab',
    scrollHint: 'Scroll to continue',
    mainNav: 'Main navigation',
  },

  hero: {
    eyebrow: 'NekoTech Foundation · Building since Sep 2025',
    headline: ['We ship', 'software', 'in the open.'],
    lede:
      'A developer collective from Vietnam building AI agents, streaming infrastructure and developer tools. Every commit public. Every decision written down.',
    primaryCta: 'See what we build',
    secondaryCta: 'Join the org',
  },

  signal: {
    label: 'Signal',
    heading: 'Measured, not claimed.',
    lede:
      'Pulled straight from the GitHub org at build time. When the numbers move, this page moves with them.',
    members: 'Members',
    repositories: 'Repositories',
    privateSuffix: 'private',
    stars: 'Stars',
    commits: 'commits',
    commitsWindow: 'last 52 weeks',
    weekLabel: 'Week',
    less: 'Less',
    more: 'More',
    busiestRepo: 'Busiest repository',
    acrossRepos: 'across {n} repos',
    languages: 'What we write',
    orgLink: 'Browse the org on GitHub',
    stale: 'Snapshot — refreshed on every deploy',
  },

  work: {
    label: 'Work',
    heading: 'Four products, one ecosystem.',
    lede:
      'Everything below is either running in production or in active development. Nothing here is a mockup.',
    statuses: {
      active: 'Live',
      development: 'In development',
      planned: 'Planned',
    },
    items: {
      nekoai: {
        tag: 'AI agent',
        summary:
          'A 2D AI companion that streams, reacts and gets work done — inspired by Neuro-sama, built to be useful rather than a novelty. Voice, memory and tool use in one agent.',
      },
      nekostream: {
        tag: 'Streaming platform',
        summary:
          'A Vietnamese streaming platform for anime viewers who are tired of pop-up ads, region locks and unusable players. Fast, quiet, community-first.',
      },
      nekostreamCli: {
        tag: 'CLI',
        summary:
          'The same catalogue, without the browser. A terminal client for NekoStream: search, queue and play from the shell you already live in.',
      },
      fujiwara: {
        tag: 'Discord bot',
        summary:
          'A Discord bot shaped to one server instead of a hundred thousand. Moderation, music, levelling, custom commands — we deploy it, we maintain it, you own it.',
      },
    },
    sideProjectsCta: 'Side projects',
  },

  capabilities: {
    label: 'Capabilities',
    heading: 'What we can be hired for.',
    lede:
      'Four things we do properly. We would rather turn work down than take on something we have not shipped before.',
    items: {
      product: {
        tag: 'Web · Frontend',
        summary:
          'Product interfaces built to hold up: real accessibility, real performance budgets, real states for loading, empty and error. Vue, React, TypeScript.',
      },
      platform: {
        tag: 'Backend · Infra',
        summary:
          'APIs, data models and deployment pipelines. Rust and Node where it matters, Postgres by default, observability from day one rather than after the first outage.',
      },
      bots: {
        tag: 'Discord · Automation',
        summary:
          'Discord bots and automation for communities: moderation, ticketing, music, custom flows. Built, hosted and handed over with documentation.',
      },
      gameservers: {
        tag: 'Game servers',
        summary:
          'Minecraft server setup and tuning — plugins, anti-cheat, backups and the performance work that stops a full server from stuttering.',
      },
    },
  },

  trajectory: {
    label: 'Trajectory',
    heading: 'From a Discord group to an org.',
    lede:
      'One continuous line: where we came from, and what is already scheduled.',
    shipped: 'Shipped',
    next: 'Next',
    items: {
      founded: {
        date: 'Sep 2025',
        title: 'Founded',
        body:
          'akk1to starts a Discord group with one goal: rebuild a manga reader properly. Three developers, one shared habit of finishing things.',
      },
      firstShip: {
        date: 'Dec 2025',
        title: 'First products ship',
        body:
          'NekoBuckets and NekoMusics go live. The group stops being a group chat and starts being a team with users.',
      },
      growth: {
        date: 'Early 2026',
        title: 'The org takes shape',
        body:
          'NekoAI, NekoStream and Fujiwara enter active development. First contributors from outside the founding three. Partnership with LangBangVN begins.',
      },
      nekoaiBeta: {
        date: 'Q3 2026',
        title: 'NekoAI public beta',
        body:
          'The 2D agent opens for community testing. Bug reports welcome, feature requests read, roadmap public.',
      },
      nekostreamLaunch: {
        date: 'Q4 2026',
        title: 'NekoStream launch',
        body:
          'Public launch of the streaming platform: no interstitial ads, no region walls, a player that works on a five-year-old phone.',
      },
      platform: {
        date: '2027',
        title: 'One platform',
        body:
          'Single sign-on across every NekoTech product and a public API, so what we built internally becomes something others can build on.',
      },
    },
  },

  partners: {
    label: 'Partners',
    heading: 'The people who bet on us early.',
    lede:
      'Two partnerships, both still running. We would rather list two real ones than twenty logos.',
    visit: 'Visit site',
    discord: 'Discord',
    ctaLead: 'Want to work together?',
    ctaLink: 'Tell us what you need',
    items: {
      langbangvn: {
        name: 'LangBangVN — CoffoxMC',
        tag: 'Minecraft server',
        badge: 'Five years running',
        summary:
          'A long-running Vietnamese Minecraft server with well-built game modes and a stable player base. NekoTech has handled its technical work since January 2026.',
      },
      nekostudio: {
        name: 'NekoStudio',
        tag: 'Discord service',
        badge: 'Discord · Custom bots',
        summary:
          'Discord bot setup, custom builds and server configuration, run by Alyosha and Heiznerd. The commercial arm of the same team.',
      },
    },
  },

  team: {
    label: 'Team',
    heading: 'Four people, no filler.',
    lede: 'The core team. Everyone here writes code that ships.',
    roles: {
      lead: 'Team lead · Backend',
      frontend: 'Frontend',
      backend: 'Backend · Mobile',
      deploy: 'Fracs Deploy · PRs Handler',
    },
    osuProfile: 'osu! profile',
    website: 'Personal site',
  },

  contact: {
    label: 'Contact',
    heading: ['We build in', 'the open.'],
    lede:
      'Contribute, hire us, or apply to join. All three start with the same message.',
    github: 'GitHub org',
    discord: 'Discord server',
    email: 'works.nekotech@proton.me',
  },

  footer: {
    builtWith: 'Built with Vue, Vite and three.js',
    sourceLink: 'Source on GitHub',
    rights: 'NekoTech Foundation',
    sections: 'Sections',
    status: 'Shipping from Hanoi',
    timezone: 'ICT',
  },

  sideProjects: {
    back: 'Back to home',
    label: 'Side projects',
    heading: 'Things we built for ourselves.',
    lede:
      'Not products, not roadmapped — written because we wanted them, kept because other people use them.',
    items: {
      nekobuckets: {
        tag: 'Discord bot',
        summary:
          'A general-purpose Discord bot by Heiznerd covering the moderation and entertainment a community actually asks for, without the dashboard upsell.',
      },
      nekomusics: {
        tag: 'Discord bot · Open source',
        summary:
          'An open-source music bot by Heiznerd. High-quality audio in a Discord voice channel, no premium tier gating the queue.',
      },
    },
    actions: {
      invite: 'Invite bot',
      viewSource: 'View source',
    },
  },
};

export default en;
