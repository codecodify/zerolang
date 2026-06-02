import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Agent-Native',
    description: (
      <>
        Zerolang treats AI agents as primary users from day one. The compiler emits
        structured JSON diagnostics with stable error codes and typed repair metadata —
        no prose parsing required.
      </>
    ),
  },
  {
    title: 'Graph-First',
    description: (
      <>
        Agents inspect compiled ProgramGraph semantic facts and submit graph edits
        instead of only patching raw source text. Semantic navigation, precise edits,
        and validated refactors — all in one loop.
      </>
    ),
  },
  {
    title: 'Zero-Dependency Systems',
    description: (
      <>
        Compiles to sub-10 KiB native binaries. Explicit memory management, no hidden
        allocator, no implicit async. Token efficiency, low memory, fast startup,
        fast builds, low latency.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
