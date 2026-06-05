import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import CodePreview from '@site/src/components/CodePreview';
import QuickStart from '@site/src/components/QuickStart';
import SocialProof from '@site/src/components/SocialProof';
import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.glowDot} aria-hidden="true" />
      <div className="container">
        <div className={styles.badge}>Experimental</div>
        <Heading as="h1" className={styles.heroTitle}>
          The programming language{' '}
          <span className={styles.gradient}>for agents</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          A graph-first language where agents work with semantic program
          structure, not raw source text.
        </p>

        <div className={styles.terminal}>
          <div className={styles.terminalDots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <code className={styles.terminalCode}>
            curl -fsSL https://zerolang.ai/install.sh | bash
          </code>
        </div>

        <div className={styles.buttons}>
          <Link
            className={clsx(styles.ctaPrimary)}
            to="/docs/getting-started/install"
          >
            Get Started
          </Link>
          <Link
            className={clsx(styles.ctaOutline)}
            to="/docs/intro"
          >
            Read the Docs
          </Link>
        </div>

        <p className={styles.warning}>
          ⚠ Experimental. Expect breaking changes.
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Zerolang community and documentation site"
    >
      <HomepageHeader />
      <main>
        <CodePreview />
        <HomepageFeatures />
        <QuickStart />
        <SocialProof />
      </main>
    </Layout>
  );
}
