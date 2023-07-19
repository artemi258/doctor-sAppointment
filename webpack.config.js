const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/js/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js',
		clean: true,
	},
	devServer: {
		port: 3000,
		open: true,
		hot: true,
		static: {
			directory: path.join(__dirname, 'dist'),
		},
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { url: false },
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [['postcss-preset-env']],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									corejs: 3,
									useBuiltIns: 'usage',
								},
							],
						],
					},
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			inject: 'body',
			scriptLoading: 'blocking',
			alwaysWriteToDisk: true,
		}),
		new HtmlWebpackHarddiskPlugin({
			outputPath: path.resolve(__dirname, 'dist'),
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].min.css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					context: './src',
					from: 'assets/**/*.+(png|svg|jpg|jpeg|gif|ico|json)',
					to: path.resolve(__dirname, 'dist'),
				},
			],
		}),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				terserOptions: {
					format: {
						comments: false,
					},
				},
			}),
			new CssMinimizerPlugin({
				test: /.css$/,
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: { removeAll: true },
						},
					],
				},
			}),
			new ImageMinimizerPlugin({
				test: /\.(jpe?g|png|gif|svg)$/i,
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: ['imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-optipng', 'imagemin-svgo'],
					},
				},
				loader: false,
			}),
		],
	},
};
