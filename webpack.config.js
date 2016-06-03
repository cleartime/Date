var path = require('path');
var version = require('./package.json').version;
var webpack = require('webpack');

module.exports = {
	entry: {
		jyDate: './src/jyDate.js'
	},
	output: {
		path: __dirname + '/build',
		filename: '[name].js',
		library: 'jyDate',
		libraryTarget: 'umd'
	},
	resolveLoader: {
		root: path.join(__dirname, 'node_modules')
	},
	plugins: [
		new webpack.DefinePlugin({
			__VERSION__: JSON.stringify(version)
		})
	]
};