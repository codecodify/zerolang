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
      label: 'Tutorials',
      items: [
        'tutorials/agent-editing',
        'tutorials/build-cli',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guides',
      items: [
        'how-to/graph-patch-refactoring',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/agent-native',
        'language/graph-first',
        'language/effects',
      ],
    },
    {
      type: 'category',
      label: 'Language',
      items: [
        'language/syntax',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/program-graph',
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
