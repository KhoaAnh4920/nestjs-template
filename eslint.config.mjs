
// eslint.config.mjs
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import nestjsTypedRecommended from '@darraghor/nestjs-typed/recommended';

export default tseslint.config(
  {
    ignores: ['.eslintrc.js', '*.spec.ts', '*.e2e-spec.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  nestjsTypedRecommended,
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      globals: {
        ...globals.node
      },
      ecmaVersion: 5,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-types': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'accessor', format: ['camelCase'] },
        { selector: 'property', format: ['camelCase', 'UPPER_CASE'] },
        { selector: 'method', format: ['camelCase'] },
        { selector: 'variable', format: ['camelCase', 'PascalCase'] },
        { selector: 'function', format: ['PascalCase', 'camelCase'] },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] }
      ],
      '@darraghor/nestjs-typed/all-properties-have-explicit-defined': 'error',
      '@darraghor/nestjs-typed/validate-nested-of-array-should-set-each': 'error',
      '@darraghor/nestjs-typed/param-decorator-name-matches-route-param': 'error',
      '@darraghor/nestjs-typed/provided-injected-should-match-factory-parameters': 'error',
      '@darraghor/nestjs-typed/controllers-should-supply-api-tags': 'warn',
      '@darraghor/nestjs-typed/api-enum-property-best-practices': 'warn',
      '@darraghor/nestjs-typed/api-property-returning-array-should-set-array': 'warn',
      '@darraghor/nestjs-typed/api-method-should-specify-api-response': 'off',
      '@darraghor/nestjs-typed/should-specify-forbid-unknown-values': 'off',

      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  }
);
