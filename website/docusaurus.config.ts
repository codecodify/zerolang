/**
 * Docusaurus Configuration - Framework Driver Layer
 *
 * This file is the "thin" framework wiring layer.
 * It imports domain/application configurations and connects them to Docusaurus.
 *
 * Clean Architecture principle:
 * - Framework details (Docusaurus APIs) live here
 * - Business rules (site metadata, navigation) live in config/
 * - This file should contain minimal logic
 */

import {themes as prismThemes} from 'prism-react-renderer';
import localSearch from '@easyops-cn/docusaurus-search-local';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import {siteConfig} from './config/site';
import {navbarConfig} from './config/navbar';
import {footerConfig} from './config/footer';

const config: Config = {
  title: siteConfig.title,
  tagline: siteConfig.tagline,
  favicon: siteConfig.favicon,
  url: siteConfig.url,
  baseUrl: siteConfig.baseUrl,
  organizationName: siteConfig.organizationName,
  projectName: siteConfig.projectName,
  deploymentBranch: siteConfig.deploymentBranch,
  trailingSlash: siteConfig.trailingSlash,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
        direction: 'ltr',
      },
      'zh-CN': {
        label: '简体中文',
        htmlLang: 'zh-CN',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './config/sidebars/en.ts',
          editUrl:
            'https://github.com/zerolang-community/zerolang-app/tree/main/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/zerolang-community/zerolang-app/tree/main/website/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: siteConfig.image,
    navbar: navbarConfig,
    footer: footerConfig,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,

  plugins: [
    [localSearch, {
      hashed: true,
      language: ['en', 'zh'],
      highlightSearchTermsOnTargetPage: true,
      searchResultLimits: 10,
    }],
  ],
};

export default config;
