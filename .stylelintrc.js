module.exports = {
  extends: 'stylelint-config-standard',
  defaultSeverity: 'warning',
  rules: {
    "string-quotes": "single",
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ],
  },
  customSyntax: 'postcss-less',
};
