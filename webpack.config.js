require('webpack')
const path = require('path')

const Plugins = {
  Clean: require('clean-webpack-plugin').CleanWebpackPlugin,
  Html: require('html-webpack-plugin'),
  CssExtract: require('mini-css-extract-plugin'),
  Copy: require('copy-webpack-plugin')
}

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : 'source-map',

  entry: {
    background: path.resolve(__dirname, 'src/background.js'),
    content: path.resolve(__dirname, 'src/content.js'),
    popup: path.resolve(__dirname, 'src/views/popup/popup.js'),
    options: path.resolve(__dirname, 'src/views/options/options.js')
  },

  output: {
    path: path.resolve(__dirname, 'extension/dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loaders: [ 'html-loader' ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          Plugins.CssExtract.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },

  plugins: [
    new Plugins.Clean(),

    new Plugins.CssExtract({
      filename: '[name].css'
    }),

    new Plugins.Html({
      template: path.resolve(__dirname, 'src/views/options/options.html'),
      filename: 'options.html',
      inject: false
    }),

    new Plugins.Html({
      template: path.resolve(__dirname, 'src/views/popup/popup.html'),
      filename: 'popup.html',
      inject: false
    })

    // new Plugins.Copy([
    //   { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'vendor/bootstrap/bootstrap.css' },
    //   { from: 'node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'vendor/bootstrap/bootstrap.js' }
    // ])
  ]
}
