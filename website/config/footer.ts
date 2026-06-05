/**
 * Footer Configuration - Application Layer
 *
 * Footer links and structure.
 * Separated from theme config for maintainability.
 */

import type {Footer} from '@docusaurus/theme-common';

export const footerConfig: Footer = {
  style: 'dark',
  links: [
    {
      title: 'Docs',
      items: [
        {
          label: 'Getting Started',
          to: '/docs/getting-started/install',
        },
        {
          label: 'Language Guide',
          to: '/docs/language/syntax',
        },
      ],
    },
    {
      title: 'Community',
      items: [
        {
          label: 'GitHub',
          href: 'https://github.com/vercel-labs/zerolang',
        },
        {
          label: 'zerolang.ai',
          href: 'https://zerolang.ai',
        },
      ],
    },
    {
      title: 'More',
      items: [
        {
          label: 'Blog',
          to: '/blog',
        },
      ],
    },
  ],
  copyright: `Copyright © ${new Date().getFullYear()} Zerolang Community. Part of the Vercel Labs ecosystem.`,
};
