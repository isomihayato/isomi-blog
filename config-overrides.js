// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const CompressionPlugin = require('compression-webpack-plugin');

// eslint-disable-next-line no-undef
module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins.push(
      new CompressionPlugin({
        test: /\.(js|css)$/,
        algorithm: 'gzip',
      }),
    );
  }
  return config;
};
