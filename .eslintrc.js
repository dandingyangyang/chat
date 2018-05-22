module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 6,
        sourceType: 'module'
    },
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: ['plugin:vue/essential'],
    rules: {
        'comma-dangle': 'off',
        'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
};
