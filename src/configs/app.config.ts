/**
 * Single source of truth for navigation and outbound links.
 *
 * `key` indexes into `t.nav`, so adding an entry here means adding one
 * string to each locale — the compiler will tell you which.
 */

export interface NavItem {
  key:
    | 'showcase'
    | 'partners'
    | 'work'
    | 'services'
    | 'capabilities'
    | 'trajectory'
    | 'team'
    | 'contact';
  hash: string;
}

/**
 * Order matches the page, top to bottom — the header's scroll-spy walks this
 * array in document order, so a mismatch would light the wrong link.
 */
export const NAV: NavItem[] = [
  { key: 'showcase',     hash: '#showcase' },
  { key: 'partners',     hash: '#partners' },
  { key: 'work',         hash: '#work' },
  { key: 'services',     hash: '#services' },
  { key: 'capabilities', hash: '#capabilities' },
  { key: 'trajectory',   hash: '#trajectory' },
  { key: 'team',         hash: '#team' },
  { key: 'contact',      hash: '#contact' },
];

export const ORG = {
  handle: 'nekoo-moe',
  github: 'https://github.com/nekoo-moe',
  discord: 'https://discord.gg/uP6EJQxQg5',
  email: 'works.nekotech@proton.me',
  foundedYear: 2025,
} as const;

/** Repo that hosts this site, linked from the footer. */
export const SITE_REPO = 'https://github.com/nekoo-moe/nekotech-landing';
