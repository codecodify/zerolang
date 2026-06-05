import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type StepItem = {
  number: string;
  title: string;
  command: string;
};

const steps: StepItem[] = [
  {
    number: '01',
    title: 'Install',
    command: 'curl -fsSL https://zerolang.ai/install.sh | bash',
  },
  {
    number: '02',
    title: 'Run',
    command: 'zero run examples/hello.0',
  },
  {
    number: '03',
    title: 'Inspect the graph',
    command: 'zero graph dump examples/hello.0',
  },
];

function Step({number, title, command}: StepItem & {index: number}) {
  return (
    <div className={styles.step}>
      <span className={styles.stepNumber}>{number}</span>
      <Heading as="h3" className={styles.stepTitle}>
        {title}
      </Heading>
      <div className={styles.commandBlock}>
        <code className={styles.command}>$ {command}</code>
      </div>
    </div>
  );
}

export default function QuickStart(): ReactNode {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Up and running in seconds
          </Heading>
        </div>

        <div className={styles.stepsRow}>
          {steps.map((step, idx) => (
            <>
              <Step key={step.number} {...step} index={idx} />
              {idx < steps.length - 1 && (
                <span className={styles.arrow} key={`arrow-${idx}`}>
                  →
                </span>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
