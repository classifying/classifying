const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: {
		index: path.join(__dirname, 'src', 'index.ts'),
	},
	output: {
		filename: `[name].min.js`,
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist'
	},
	module: {
		rules: [
			{   test: /\.ts$/,
                use: [
                    'ts-loader'
                ],
                exclude: /node_modules/
            },
			{
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
		]
	},
	resolve: {
		extensions: [
            '.js',
            '.jsx',
            '.json',
            '.scss',
            '.css'
        ],
		modules: [
            'node_modules'
        ],
		alias: {
			'@root': path.join(__dirname, 'src'),
		},
	},
	plugins: [
		new MiniCssExtractPlugin({ linkType: 'text/css', filename: `theme.css` }),
		new CopyWebpackPlugin({
			patterns: [
				{
                    from: 'version.json',
                    to: 'version.json',
                    force: true
                },
			],
			options: {
				concurrency: 100,
			},
		}),
	],
    mode: 'development',
    devServer: {
        port: 8080,
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: true
        }
    },
}