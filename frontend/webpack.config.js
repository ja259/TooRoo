const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    hot: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules\/face-api.js/,
        use: ['source-map-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^fs$/,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
  ],
};
