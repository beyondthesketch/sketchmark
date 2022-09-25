const path = require('path');

module.exports = (env) => ({
    mode: env && env.production ? 'production' : 'development',
    target: 'web',
    entry: path.resolve(__dirname, './src/sketchmark.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'sketchmark.js',
        library: 'SketchMark',
        libraryTarget: 'umd',
        libraryExport: 'default',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        '@babel/plugin-transform-object-assign',
                        '@babel/plugin-proposal-class-properties',
                    ]
                }
            }
        ]
    },
    devtool: env && env.production ?  undefined : 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        devMiddleware: {
            publicPath: '/dist'
        }
    }
});