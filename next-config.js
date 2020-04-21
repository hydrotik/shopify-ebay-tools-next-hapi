const webpack = require('webpack')
const purgecss = require('@fullhuman/postcss-purgecss')

const isProd = (process.env.NODE_ENV || 'production') === 'production'
const assetPrefix = (isProd) ? '' : ''

console.log('production: ' + isProd);

module.exports = {
  'process.env.BACKEND_URL': assetPrefix,
  exportPathMap: () => ({
    '/': { page: '/' }

  }),
  assetPrefix: assetPrefix,
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.ASSET_PREFIX': JSON.stringify(assetPrefix),
        'process.env.BACKEND_URL' : JSON.stringify(assetPrefix)
      })
    )

    return config
  }
}