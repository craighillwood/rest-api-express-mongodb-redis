module.exports = {
  'extends': [
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
  'plugins': [
    'import',
  ],
  'rules': {
    'no-console': 'off',
    'no-underscore-dangle': ['error', { 'allow': ['_id']}],
    'prettier/prettier': [
      'error',
      {
        'printWidth': 100,
        'tabWidth': 2,
        'useTabs': false,
        'semi': true,
        'singleQuote': true,
        'trailingComma': 'all',
        'bracketSpacing': true,
        'jsxBracketSameLine': false,
        'arrowParens': 'avoid',
        'rangeStart': 0,
        'rangeEnd': Infinity,
      }
    ],
  },
  'env': {
    'node': true,
  },
};
