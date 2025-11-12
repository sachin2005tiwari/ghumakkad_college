import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // 👇 Added/Modified rules for leniency and to fix common errors
    rules: {
      // 1. Allows you to use 'any' in TypeScript (common for quick dev/migration)
      '@typescript-eslint/no-explicit-any': 'off', 
      
      // 2. Changes unused variable errors to warnings (less aggressive)
      //    Note: This is set up to handle both JS and TS unused vars correctly.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], 
      
      // 3. Allows you to use `// @ts-ignore` comments
      '@typescript-eslint/ban-ts-comment': 'off',

      // 4. Allows `require()` calls (sometimes needed for older dependencies)
      '@typescript-eslint/no-var-requires': 'off',

      // 5. Turns off `console` errors (allows you to use `console.log` freely)
      'no-console': 'off',
      
      // 6. Allows empty functions (e.g., placeholder functions)
      '@typescript-eslint/no-empty-function': 'off',
    }
  },
])