/**
 * Site Configuration - Domain Layer
 *
 * Site-level metadata and constants.
 * Framework-agnostic business rules about the project identity.
 */

export const siteConfig = {
  /** Site title - displayed in navbar and SEO */
  title: 'Zerolang',

  /** Tagline - displayed in hero section */
  tagline: 'The programming language for agents',

  /** Production domain */
  url: 'https://zerolang.app',

  /** Base URL path - keep '/' for root deployment */
  baseUrl: '/',

  /** GitHub repository info */
  organizationName: 'zerolang-community',
  projectName: 'zerolang-app',

  /** Deployment branch for GitHub Pages */
  deploymentBranch: 'gh-pages',

  /** Favicon path */
  favicon: 'img/logo.svg',

  /** Social card image for Open Graph */
  image: 'img/zerolang-social-card.png',

  /** Enable trailing slash for stable routing */
  trailingSlash: true,
} as const;

export type SiteConfig = typeof siteConfig;
