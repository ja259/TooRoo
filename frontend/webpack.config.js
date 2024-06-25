const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development', // Can be set to 'production' for production builds
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  devtool: 'source-map', // Generates source maps for debugging
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true, // Enable hot module replacement
    historyApiFallback: true, // Fallback to index.html for SPA routing
    port: 8080, // Development server port
    compress: true, // Enable gzip compression for everything served
    open: true, // Automatically open the browser
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/, // Process CSS files
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Process image files
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/, // Process font files
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash][ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the output directory before each build
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'), // Template for the HTML file
      favicon: path.resolve(__dirname, 'src', 'logo.png'), // Favicon
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^fs$/, // Ignore 'fs' module in client-side code
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these extensions
    alias: {
      '@components': path.resolve(__dirname, 'src', 'components'), // Alias for components directory
      '@assets': path.resolve(__dirname, 'src', 'assets'), // Alias for assets directory
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // Split vendor and app code
    },
    runtimeChunk: 'single', // Create a single runtime bundle for all chunks
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },
};
