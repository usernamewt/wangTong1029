// 通过 Node 中的模块操作，向外暴露一个配置对象
// 配置webpack的操作模块，输入和输出路径
const VueLoaderPlugin = require('vue-loader/lib/plugin');//获取Vue-loader所需要的插件
const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: path.join(__dirname, './src/main.js'),
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'//指定输出的文件名称
    },
    plugins: [//自动在内存中指定页面生成一个内存的页面，自动把bundle.js插入到页面的DOM中
        new htmlWebpackPlugin({//创建一个在内存中生成 html 页面的插件
            template: path.join(__dirname, './src/index.html'),//会生成指定页面
            filename: 'index.html'//指定生成页面的名称
        }),
        new VueLoaderPlugin()//加载vue-loader插件
    ],
    module: {//用于配置所有第三方模块加载器
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },//处理所有第三方模块css的规则
            // {test:/\.css$/,use:['style-loader','css-loader','less-loader']}用于添加less后缀文件的加载规则
            // {test:/\.css$/,use:['style-loader','css-loader','sass-loader']}用于添加scss后缀文件的加载规则
            { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader' },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },//操作字体样式
            // {test:/\.(jpg|png|gif|bmp|jpeg)$/,use:'url-loader?limit=1111&name=[hash:8]-[name].[ext]'}limit给定的值是图片的大小单位是byte如果引用的图片大于或等于给定的limit值
            // 则不会被转为base64位格式的字符串如果小于就会
            // name 属性设置URL图片的名称和后缀名
            { test: /\.vue$/, use: 'vue-loader' }
        ]
    },
    resolve: {
        alias: {//设置 vue 包被导入的配置
            // "vue$": "vue/dist/vue.js"
        }
    }
}






