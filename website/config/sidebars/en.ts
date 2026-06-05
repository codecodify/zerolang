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
      collapsed: false,
      items: [
        'getting-started/install',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Language & Concepts',
      items: [
        'language/syntax',
        'language/effects',
        'language/graph-first',
        'concepts/agent-native',
      ],
    },
    {
      type: 'category',
      label: 'Guides & Tutorials',
      items: [
        'guides/agent-integration',
        'tutorials/agent-editing',
        'tutorials/build-cli',
        'how-to/graph-patch-refactoring',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/program-graph',
        'reference/diagnostics-table',
        'cli/commands',
        'cli/diagnostics',
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
