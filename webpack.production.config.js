//webpack.config.js
var path = require('path');
var webpack = require('webpack');
var VueLoaderPlugin = require('vue-loader/lib/plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports ={
    entry: ['babel-polyfill','./src/main.js'], //项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    output:{
        path: path.resolve(__dirname, './dist'), //项目的打包文件路径
        publicPath: '/dist/', //通过devServer 访问路径
        filename: 'build.js' //打包后的文件名
    },
    devtool: 'none',//注意修改了这里，这能大大压缩我们的打包代码
    devServer: {
        historyApiFallback: true, //historyApiFallback设置为true那么所有的路径都执行index.html。
        overlay:true, //将错误显示在html之上
        port: 8282
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    
    module: {
        rules: [
            {   //匹配后缀名为css的文件,然后分别用css-loader，vue-style-loader去解析
                //解析器的执行顺序是从下往上(先css-loader再vue-style-loader)
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude:/node_modules/ //exclude表示忽略node_modules文件夹下的文件，不用转码
                
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders:{
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin('版权所有，翻版必究'),
        //make sure to include the plugin for the magic
        new VueLoaderPlugin()
        
    ]
    
};