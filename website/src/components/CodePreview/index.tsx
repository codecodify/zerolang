import type {ReactNode} from 'react';
import {useState} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type TabItem = {
  id: string;
  label: string;
  filename: string;
  code: string;
};

const tabs: TabItem[] = [
  {
    id: 'source',
    label: 'Source',
    filename: 'main.0',
    code: `fn answer() -> i32 {
    return 40 + 2
}

pub fn main(world: World) -> Void raises {
    if answer() == 42 {
        check world.out.write("math works\\n")
    }
}`,
  },
  {
    id: 'graph',
    label: 'Graph',
    filename: 'zero graph dump',
    code: `zero-graph v1
origin source-text
module "hello"
hash "graph:YOUR_HASH"

node #decl_XXXXXXXX Function name:"main" type:"Void" public:true fallible:true
node #param_XXXXXXXX Param name:"world" type:"World"
node #expr_XXXXXXXX MethodCall name:"write" type:"Void"
node #expr_XXXXXXXX Literal type:"String" value:"hello from zero\\n"
edge #expr_XXXXXXXX arg #expr_XXXXXXXX order:0`,
  },
  {
    id: 'patch',
    label: 'Patch',
    filename: 'zero graph patch',
    code: `$ zero graph patch examples/hello.0 \\
    --expect-graph-hash graph:YOUR_HASH \\
    --op 'set node="#expr_XXXXXXXX" \\
           field="value" \\
           expect="hello from zero\\n" \\
           value="hello graph\\n"'`,
  },
];

export default function CodePreview(): ReactNode {
  const [activeTab, setActiveTab] = useState('source');
  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section className={styles.codePreview}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Source is the artifact. The graph is the work surface.
          </Heading>
          <p className={styles.sectionSubtitle}>
            Write human-readable source, compile to a semantic graph, then
            inspect and patch programmatically. Three views of the same
            program.
          </p>
        </div>

        <div className={styles.window}>
          <div className={styles.tabBar}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={clsx(styles.tab, activeTab === tab.id && styles.tabActive)}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.fileBar}>
            <span className={styles.filename}>{currentTab.filename}</span>
          </div>
          <div className={styles.codeArea}>
            <pre className={styles.codeBlock}>
              <code>{currentTab.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
