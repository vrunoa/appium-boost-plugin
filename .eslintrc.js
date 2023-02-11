module.exports = {
    env: {
        node: true,
        mocha: true,
        es6: true,
        browser: true,
    },
    ignorePatterns: ["node_modules", "dist", "bin", ".eslintrc.js"],
    extends: ["appium"],
    parserOptions: {
        ecmaVersion: 2021,
        requireConfigFile: false
    },
    rules: {
        "no-console": "off",
    },
    root: true,
};

