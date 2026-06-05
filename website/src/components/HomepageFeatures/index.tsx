import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: ReactNode;
  description: ReactNode;
};

function AgentIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="3.5" fill="currentColor" />
      <line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="22" x2="14" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5.5" y1="5.5" x2="8.3" y2="8.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="19.7" y1="19.7" x2="22.5" y2="22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5.5" y1="22.5" x2="8.3" y2="19.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="19.7" y1="8.3" x2="22.5" y2="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="3" fill="currentColor" />
      <circle cx="21" cy="7" r="3" fill="currentColor" />
      <circle cx="7" cy="21" r="3" fill="currentColor" />
      <circle cx="21" cy="21" r="3" fill="currentColor" />
      <line x1="10" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="10" x2="7" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="21" y1="10" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9.5" y1="9.5" x2="18.5" y2="18.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 2L6 16h6l-2 10 10-14h-6l2-10z"
        fill="currentColor"
      />
    </svg>
  );
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Agent-Native',
    icon: <AgentIcon />,
    description: (
      <>
        The compiler emits structured JSON diagnostics with stable error codes
        and typed repair metadata. Agents parse machine-readable output, not
        human prose. First-class error recovery, zero guesswork.
      </>
    ),
  },
  {
    title: 'Graph-First',
    icon: <GraphIcon />,
    description: (
      <>
        Compiled ProgramGraph exposes semantic facts about your code. Agents
        inspect nodes, traverse edges, and submit precise graph edits instead
        of patching raw source text. Validated refactors in one loop.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    icon: <LightningIcon />,
    description: (
      <>
        Sub-10 KiB native binaries. Explicit memory management, no hidden
        allocator, no implicit async. Token-efficient output, minimal memory
        footprint, instant startup.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>{icon}</div>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Built for the agent era
          </Heading>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
