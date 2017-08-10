module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import",
  ],
  "rules": {
    "no-console": "off",
    "linebreak-style": "off",
    "no-underscore-dangle": ["error", { "allow": ["_id"]}],
  },
  "env": {
    "node": true,
  },
};
