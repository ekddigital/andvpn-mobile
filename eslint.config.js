const pluginExpo = require('eslint-config-expo/flat.js');

module.exports = [
    // Apply Expo config to all files
    ...pluginExpo,

    // Override/extend with custom rules
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'react-hooks/exhaustive-deps': 'warn'
        }
    },

    // Ignore patterns
    {
        ignores: [
            'node_modules/',
            '.expo/',
            'dist/',
            'build/'
        ]
    }
];