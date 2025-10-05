// eslint.config.js (ESM)
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,

  // React recommended (flat) config
  react.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: {
      react: { version: 'detect' }, // silences the version warning
    },
    rules: {
      // New JSX transform: no need to import React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Hooks best practices
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      // (Optional) keep default unused-vars behavior
      // If you still get false positives from tooling, you could relax it:
      // 'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
    },
  },

  // (Optional) ignore build outputs
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
]
