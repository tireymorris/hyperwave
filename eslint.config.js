import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments';
import customCommentsPlugin from './eslint-custom-comments-plugin.js';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jsdoc: jsdocPlugin,
      'eslint-comments': eslintCommentsPlugin,
      'custom-comments': customCommentsPlugin,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['.*'],
              message: 'Use absolute imports with @ prefix instead. Example: @/components/Layout',
            },
          ],
        },
      ],
      'no-console': 'error',
      'no-debugger': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-duplicate-imports': 'error',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      '@typescript-eslint/no-magic-numbers': 'off',
      'jsdoc/no-types': 'error',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-description': 'off',
      'no-warning-comments': ['error', { terms: ['todo', 'fixme', 'xxx', 'note'], location: 'anywhere' }],
      'spaced-comment': ['error', 'never'],
      'multiline-comment-style': ['error', 'starred-block'],
      'lines-around-comment': [
        'error',
        { beforeBlockComment: false, afterBlockComment: false, beforeLineComment: false, afterLineComment: false },
      ],
      'no-inline-comments': 'error',
      'eslint-comments/no-use': 'error',
      'custom-comments/no-comments': 'error',
    },
  },
  {
    files: ['src/config/env.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['src/utils/env.ts'],
    rules: {
      'no-restricted-syntax': 'off',
      'eslint-comments/no-use': 'off',
      'custom-comments/no-comments': 'off',
      'spaced-comment': 'off',
    },
  },
];
