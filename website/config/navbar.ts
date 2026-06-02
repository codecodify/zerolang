/**
 * Navbar Configuration - Application Layer
 *
 * Navigation structure.
 * Separated from theme config for maintainability and type safety.
 */

import type {Navbar} from '@docusaurus/theme-common';

export const navbarConfig: Navbar = {
  title: 'Zerolang',
  logo: {
    alt: 'Zerolang Logo',
    src: 'img/logo.svg',
  },
  items: [
    {
      type: 'docSidebar',
      sidebarId: 'tutorialSidebar',
      position: 'left',
      label: 'Docs',
    },
    {to: '/blog', label: 'Blog', position: 'left'},
    {
      href: 'https://zerolang.ai',
      label: 'Official',
      position: 'right',
    },
    {
      href: 'https://github.com/vercel-labs/zerolang',
      label: 'GitHub',
      position: 'right',
    },
    // Language switcher dropdown
    {
      type: 'localeDropdown',
      position: 'right',
    },
  ],
  hideOnScroll: false,
};
