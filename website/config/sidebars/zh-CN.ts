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
      items: [
        'getting-started/install',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: '教程',
      items: [
        'tutorials/agent-editing',
        'tutorials/build-cli',
      ],
    },
    {
      type: 'category',
      label: '操作指南',
      items: [
        'how-to/graph-patch-refactoring',
      ],
    },
    {
      type: 'category',
      label: '概念',
      items: [
        'concepts/agent-native',
        'language/graph-first',
        'language/effects',
      ],
    },
    {
      type: 'category',
      label: '语言',
      items: [
        'language/syntax',
      ],
    },
    {
      type: 'category',
      label: '参考',
      items: [
        'reference/program-graph',
        'cli/commands',
        'cli/diagnostics',
      ],
    },
    {
      type: 'category',
      label: '标准库',
      items: [
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
