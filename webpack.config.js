const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { version } = require('./package.json');

const MODE_DEVELOPMENT = 'development';
const MODE_PRODUCTION = 'production';

const mode = ['development'].includes(process.env.ENVIRONMENT)
  ? MODE_DEVELOPMENT : MODE_PRODUCTION;

module.exports = {
  mode: mode === MODE_DEVELOPMENT ? 'development' : 'production',
  devtool: mode === MODE_DEVELOPMENT ? 'source-map' : false,
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        styles: {
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  entry: {
    app: [
      './src/less/Import.tsx',
      './src/App.tsx',
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'assets/js/[name].[contenthash].min.js',
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/styles.[contenthash].min.css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: {
        environment: process.env.NODE_ENV || 'development',
        version,
        locale_hash: Date.now(),
      },
      filename: './index.html',
      inject: 'body',
      scriptLoading: 'defer',
      minify: false,
      hash: true,
      publicPath: '/',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/locales'),
          to: path.resolve(__dirname, 'dist/locales'),
        },
        {
          from: path.resolve(__dirname, 'public/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'public/favicon.ico'),
          to: path.resolve(__dirname, 'dist/favicon.ico'),
        },
      ],
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // Borrowed from create-react-app webpack configuration.
    new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [
      path.resolve(__dirname, './src'),
      'node_modules',
    ],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@less': path.resolve(__dirname, 'src/less'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@views': path.resolve(__dirname, 'src/views/'),
      '@helpers': path.resolve(__dirname, 'src/helpers/'),
      '@stores': path.resolve(__dirname, 'src/stores/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@lib': path.resolve(__dirname, 'src/lib/'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
    fallback: {
      events: require.resolve('events/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: mode === MODE_DEVELOPMENT,
              importLoaders: 2,
              modules: {
                localIdentName: mode === MODE_DEVELOPMENT ? '[local]--[hash:base64:5]' : '[hash:base64]',
                exportLocalsConvention: 'camelCase',
              },
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: mode === MODE_DEVELOPMENT,
            },
          },
          'less-loader',
        ],
        include: /src\/.*\.module\.less/,
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: mode === MODE_DEVELOPMENT,
              importLoaders: 1,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: mode === MODE_DEVELOPMENT,
            },
          },
          'less-loader',
        ],
        include: /\/src\/less\//,
      },
      {
        test: /\.tsx?$/,
        exclude: path.resolve(__dirname, 'node_modules/'),
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-parameters',
              '@babel/plugin-transform-destructuring',
              '@babel/plugin-proposal-object-rest-spread',
              'lodash',
            ],
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: 'last 2 Chrome versions, last 2 Edge versions, last 2 Safari versions',
                  },
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    port: 3100,
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    compress: false,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
};
