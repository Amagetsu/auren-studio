import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  { files: ['src/**/*.js', 'server/**/*.js'], languageOptions: { globals: { ...globals.browser, ...globals.node } }, rules: { 'no-unused-vars': 'off' } },
];
