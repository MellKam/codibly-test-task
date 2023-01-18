module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript"
  ],
  overrides: [
  ],
  settings: {
    react: {
      version: "18.2.0"
    }
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: [
    "react"
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/indent": "off",
    "no-tabs": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/promise-function-async": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/quotes": [
      "warn",
      "double",
      {
        allowTemplateLiterals: true
      }
    ],
    quotes: "off",
    "multiline-ternary": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/strict-boolean-expressions": "off"
  }
}
