/**
 * English Sidebar Configuration - Application Layer
 *
 * Docs navigation structure for English (default) locale.
 */

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/install',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Language',
      items: [
        'language/syntax',
        'language/graph-first',
        'language/effects',
      ],
    },
    {
      type: 'category',
      label: 'CLI',
      items: [
        'cli/commands',
        'cli/diagnostics',
      ],
    },
    {
      type: 'category',
      label: 'Standard Library',
      items: [
        'stdlib/overview',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/hello',
      ],
    },
  ],
};

export default sidebars;
