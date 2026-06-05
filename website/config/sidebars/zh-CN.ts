/**
 * Chinese Sidebar Configuration - Application Layer
 *
 * Docs navigation structure for Chinese (zh-CN) locale.
 */

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '快速入门',
      collapsed: false,
      items: [
        'getting-started/install',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: '语言与概念',
      items: [
        'language/syntax',
        'language/effects',
        'language/graph-first',
        'concepts/agent-native',
      ],
    },
    {
      type: 'category',
      label: '指南与教程',
      items: [
        'guides/agent-integration',
        'tutorials/agent-editing',
        'tutorials/build-cli',
        'how-to/graph-patch-refactoring',
      ],
    },
    {
      type: 'category',
      label: '参考',
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
      label: '示例',
      items: [
        'examples/hello',
      ],
    },
  ],
};

export default sidebars;
