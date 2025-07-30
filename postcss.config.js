module.exports = (ctx) => ({
  plugins: {
    autoprefixer: {},
    cssnano: ['test', 'local'].includes(ctx.env) ? false : {
      preset: ['default', {
        mergeLonghand: false,
        cssDeclarationSorter: false,
        normalizeUrl: false,
      }],
    },
  },
});
