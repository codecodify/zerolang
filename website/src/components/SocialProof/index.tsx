import type {ReactNode} from 'react';
import {useState, useEffect} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function StarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SocialProof(): ReactNode {
  const [stars, setStars] = useState<string>('—');

  useEffect(() => {
    fetch('https://api.github.com/repos/vercel-labs/zerolang')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        if (typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count.toLocaleString());
        }
      })
      .catch(() => {
        /* silent fallback */
      });
  }, []);

  return (
    <section className={styles.socialProof}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.statsCard}>
            <div className={styles.statRow}>
              <div className={styles.stat}>
                <div className={styles.statIcon}>
                  <StarIcon />
                </div>
                <div className={styles.statValue}>{stars}</div>
                <div className={styles.statLabel}>GitHub Stars</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statBadge}>Apache 2.0</div>
                <div className={styles.statLabel}>License</div>
              </div>
            </div>
          </div>

          <div className={styles.quoteCard}>
            <blockquote className={styles.quote}>
              <p>
                &ldquo;Source text is good for humans and review, but it is a
                weak interface for program understanding.&rdquo;
              </p>
              <cite className={styles.cite}>— zerolang.ai</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
