/**
 * Single source of truth for navigation and outbound links.
 *
 * `key` indexes into `t.nav`, so adding an entry here means adding one
 * string to each locale — the compiler will tell you which.
 */

export interface NavItem {
  key: 'work' | 'capabilities' | 'trajectory' | 'partners' | 'team' | 'contact';
  hash: string;
}

export const NAV: NavItem[] = [
  { key: 'work',         hash: '#work' },
  { key: 'capabilities', hash: '#capabilities' },
  { key: 'trajectory',   hash: '#trajectory' },
  { key: 'partners',     hash: '#partners' },
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
