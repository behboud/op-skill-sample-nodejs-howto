const path = require('path')
const nodeExternals = require('webpack-node-externals')
const slsw = require('serverless-webpack')

const common = {
    entry: slsw.lib.entries,
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate:
            '[absolute-resource-path]?[hash]',
    },
    target: 'node',
    externals: [
        nodeExternals({
            modulesFromFile: true,
            whitelist: [
                'ask-sdk-core',
                'ask-sdk-model',
                'i18next',
                'i18next-sprintf-postprocessor',
                'ssml-jsx',
            ],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
            },
        ],
    },
}

if (process.env.SLS_DEBUG) {
    common['devtool'] = 'eval-source-map'
    common['mode'] = 'development'
}

module.exports = common
