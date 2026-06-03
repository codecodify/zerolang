# Zerolang Community

> Zerolang community website and documentation — multilingual, agent-native.

## Project Overview

This is the community website for [Zerolang](https://zerolang.ai), an experimental systems programming language from Vercel Labs built for AI Agent workflows.

**Domain**: [zerolang.app](https://zerolang.app) (international)  
**Default Language**: English  
**Secondary Language**: Chinese (Simplified)

## Architecture

This project follows **Clean Architecture** principles:

```
website/
├── content/              # Domain Layer — framework-agnostic content
│   ├── docs/            # English docs (default locale)
│   ├── blog/            # English blog
│   └── i18n/            # Translations — Chinese docs, UI strings
├── config/              # Application Layer — typed, modular configuration
│   ├── site.ts          # Site metadata
│   ├── navbar.ts        # Navigation
│   ├── footer.ts        # Footer links
│   ├── algolia.ts       # Search config
│   └── sidebars/        # Per-locale sidebar configs
├── src/                 # Interface Adapters — React components
│   ├── components/
│   ├── pages/
│   └── css/
├── static/              # Static assets
└── docusaurus.config.ts # Framework Driver — thin wiring layer
```

### Clean Architecture Principles Applied

1. **Dependency Rule**: Dependencies point inward. Framework details (Docusaurus) live at the outer edge. Business rules (content, navigation) live at the center.
2. **Separation of Concerns**: Content, configuration, and presentation are in separate layers.
3. **Framework Independence**: Content and configuration modules have no direct dependency on Docusaurus APIs.
4. **Testability**: Configuration is pure TypeScript — testable without spinning up a dev server.

## Tech Stack

| Layer | Technology |
|---|---|
| Static Site Generator | Docusaurus 3.x |
| Frontend Framework | React 18 + TypeScript |
| Content Format | Markdown / MDX |
| Search | Algolia DocSearch |
| Deployment | **Vercel** (primary) / GitHub Pages (backup) |
| CI/CD | Vercel Auto-Deploy / GitHub Actions |

## Multilingual Setup

| Locale | Route | Status |
|---|---|---|
| English (default) | `/docs/intro` | ✅ Primary |
| Chinese (Simplified) | `/zh-CN/docs/intro` | ✅ Active |

### Adding a New Language

1. Add locale to `docusaurus.config.ts` → `i18n.locales`
2. Add locale config to `i18n.localeConfigs`
3. Create `config/sidebars/[locale].ts`
4. Create `i18n/[locale]/code.json` for UI translations
5. Create `i18n/[locale]/docusaurus-plugin-content-docs/current/` for docs
6. Run `npm run write-translations` to generate template files

## Quick Start

```bash
cd website

# Install dependencies
npm install

# Start dev server (default: English)
npm run start

# Start with Chinese locale
npm run start:zh

# Build all locales
npm run build

# Serve build output
npm run serve
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Framework Preset: **Other**
3. Root Directory: `website`
4. Build Command: `npm run build`
5. Output Directory: `build`
6. Add custom domain `zerolang.app` in Vercel Dashboard → Domains
7. Add the DNS record shown by Vercel at your domain registrar

Push to `master` triggers automatic build and deploy on Vercel.

### GitHub Pages (Backup)

GitHub Actions workflow is configured in `.github/workflows/deploy.yml`. Enable in repository Settings → Pages → Source: GitHub Actions.

## Contributing

We welcome contributions! Please read our contribution guidelines (coming soon).

## References

- [Zerolang Official](https://zerolang.ai)
- [Zerolang GitHub](https://github.com/vercel-labs/zerolang)
- [Docusaurus Documentation](https://docusaurus.io)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
