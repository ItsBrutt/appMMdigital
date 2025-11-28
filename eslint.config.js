// eslint.config.js - Modern Flat Config (ESLint 9+)
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
    // Base recommended rules
    js.configs.recommended,

    // Disable ESLint formatting rules that conflict with Prettier
    prettier,

    // Global configuration
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                // Browser environment
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                // DOM APIs
                Element: 'readonly',
                HTMLElement: 'readonly',
                NodeList: 'readonly',
                // Modern APIs
                IntersectionObserver: 'readonly',
                fetch: 'readonly',
                // Events
                Event: 'readonly',
                CustomEvent: 'readonly'
            }
        },

        rules: {
            // ===== PREVENCIÓN DE ERRORES =====
            'no-undef': 'error',
            'no-unused-vars': ['warn', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_'
            }],
            'no-unreachable': 'error',
            'no-constant-condition': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',

            // ===== MEJORES PRÁCTICAS =====
            'eqeqeq': ['error', 'always'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-with': 'error',
            'curly': ['error', 'all'],
            'dot-notation': 'error',
            'no-multi-spaces': 'error',
            'no-return-assign': 'error',
            'no-self-compare': 'error',
            'no-throw-literal': 'error',
            'no-useless-concat': 'error',
            'prefer-promise-reject-errors': 'error',

            // ===== MODERNIZACIÓN ES6+ =====
            'prefer-const': 'error',
            'prefer-arrow-callback': 'warn',
            'arrow-spacing': 'error',
            'no-var': 'error',
            'prefer-template': 'warn',
            'object-shorthand': 'warn',
            'prefer-destructuring': ['warn', {
                'array': false,
                'object': true
            }],

            // ===== LIMPIEZA DE CÓDIGO =====
            'no-console': 'off',
            'no-debugger': 'warn',
            'no-alert': 'warn',
            'no-empty': 'error',
            'no-extra-semi': 'error',
            // Formatting rules removed - handled by Prettier

            // ===== SEGURIDAD =====
            'no-script-url': 'error',
            'no-new-wrappers': 'error',
            'no-iterator': 'error',
            'no-proto': 'error',

            // ===== RENDIMIENTO =====
            'no-loop-func': 'error',
            'no-new-object': 'error',
            'no-array-constructor': 'error'
        }
    },

    // Ignorar archivos
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            '*.min.js',
            '.git/**'
        ]
    }
];
