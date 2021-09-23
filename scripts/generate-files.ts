/* eslint-disable */

import type { Rule } from 'eslint';
// @ts-expect-error
import eslintPluginVue from 'eslint-plugin-vue';
import * as fs from 'fs';
import * as path from 'path';

interface Plugin {
  rules: Record<string, Rule.RuleModule>;
}

function pascalCase(value: string): string {
  return value.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()).replace(/-/g, '');
}

const rulesDir = path.resolve(__dirname, '../src/rules');

const ruleProviderDir = path.resolve(rulesDir, 'vue');

fs.mkdirSync(ruleProviderDir, { mode: 0o755, recursive: true });

Object.entries((eslintPluginVue as Plugin).rules).forEach(([name, { meta }]) => {
  const rulePath = path.resolve(ruleProviderDir, `${name}.d.ts`);
  fs.writeFileSync(
    rulePath,
    `import type { RuleConfig } from '../rule-config';

/**
 *
 */
export type ${pascalCase(name)}RuleConfig = RuleConfig<[]>;

/**
 *
 */
export interface ${pascalCase(name)}Rule {
  'vue/${name}': any;
}
`
  );
});
