# webpack-vue
>搭建基于webpack4.0的vue项目

## 原文转载： [https://www.jianshu.com/p/1fc5b5151abf](https://www.jianshu.com/p/1fc5b5151abf)

## 第一步：全局安装webpack

```bash
npm install webpack -g
```
```bash
npm install webpack-cli -g
```

## 第二步：项目初始化

```bash
cd webpack-vue
npm init -y
```

> 安装 vue webpack webpack-cli webpack-dev-server
```bash
npm install --save vue
npm install --save-dev webpack webpack-cli webpack-dev-server
```

> 在根目录下新建入口文件index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Webpack-Vue</title>
</head>
<body>

    <script src="/dist/build.js"></script>
</body>
</html>
```

>在根目录下创建 wepback.config.js

```javascript
//webpack.config.js
var path = require('path');
var webpack = require('webpack');

module.exports ={
    
};
```

>新建src文件夹目录，在src下新建main.js，此时目录结构
```bash
webpack-vue
├── node_modules 依赖安装目录
├── src #前端项目源码目录
│   └────main.js  #项目的核心文件
├── index.html #首页入口文件，你可以添加一些 meta 信息或同统计代码啥的
├── package-lock.json #项目配置文件
├── package.json #项目配置文件
└── README.md #项目的说明文档，markdown 格式
└── webpack.config.js #项目配置文件
```

>src目录下新建一个utils.js

```javascript
//utils.js
module.exports = function say(){
    console.log('hello world!');
}
```

> main.js
```javascript
//main.js
var say = require('./utils');
say();
```

> webpack.config.js
```javascript
//webpack.config.js
var path = require('path');
var webpack = require('webpack');

module.exports ={
    entry: './src/main.js', //项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    output:{
        path: path.resolve(__dirname, './dist'), //项目的打包文件路径
        publicPath: '/dist/', //通过devServer 访问路径
        filename: 'build.js' //打包后的文件名
    },
    devServer: {
        historyApiFallback: true, //historyApiFallback设置为true那么所有的路径都执行index.html。
        overlay:true, //将错误显示在html之上
        port: 8282
    }
};
```

>在package.json中的scripts对象中添加如下命令，用以开启本地服务器：
```javascript
{
    ...
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "server": "webpack-dev-server --open"
    },
    ...
}
```

>运行
```bash
 npm run server
```

### 可以在http://localhost:8282/的控制台 console栏目 看到 `hello world!`

#

### 如果我们希望看打包后的bundle.js文件,
>在package.json

```javascript
{
    ...
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "webpack --mode development",
        "server": "webpack-dev-server --open"
    },
    ...
}
```
>运行  ` npm run dev ` , 可以看到 `dist` 下有一个 `build.js`文件

#
* webpack默认不支持转码es6，但是import export这两个语法却单独支持。所以我们可以改写前面的模块化写法
```javascript
//utils.js
export default function say(){
    console.log('hello world!');
}
```    

## 第三步 引入Vue

>main.js

```javascript
//main.js
import Vue from 'vue';

var app =  new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
});
```
>index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Webpack-Vue</title>
</head>
<body>
    <div id="app">
        {{message}}
    </div>
    <script src="/dist/build.js"></script>
</body>
</html>
```

>webpack.config.js

```javascript
//webpack.config.js
var path = require('path');
var webpack = require('webpack');

module.exports ={
    ...
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};
```

## 第四步 引入scss和css

* webpack默认只支持js的模块化，如果需要把其他文件也当成模块引入，就需要相对应的loader解析器

```bash 
npm install --save-dev node-sass css-loader vue-style-loader sass-loader
```

>webpack.config.js

```javascript
//webpack.config.js
var path = require('path');
var webpack = require('webpack');

module.exports ={
    ...
    resolve: {
        ...
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
            }
        ]
    }
};
```

* 注意：因为我们这里用vue开发，所以使用vue-style-loader，其他情况使用style-loader
* css-loader使得我们可以用模块化的写法引入css,vue-style-loader会将引入的css插入到html页面里的style标签里

### 我们现在在src目录下新建style目录，style目录里新建common.scss

> common.scss
```scss
body{
    background:#fed;
}
```
>main.js
```javascript
import './style/common.scss';
```

### 重新 npm run server ，可发现样式生效

#

## 第五步 ：使用babel转码

* ES6的语法大多数浏览器依旧不支持,bable可以把ES6转码成ES5语法，这样我们就可以大胆的在项目中使用最新特性了

```bash
npm --save-dev babel-core babel-loader babel-preset-env babel-preset-stage-3
```

### 在项目根目录新建一个.babelrc文件

```json
//.babelrc
{
    "presets": [
        ["env", {"modules": false}],
        "stage-3"
    ]
}
```

> webpack.config.js添加一个loader
```javascript
//webpack.config.js
var path = require('path');
var webpack = require('webpack');

module.exports ={
    ...
    module: {
        rules: [
            {   //匹配后缀名为css的文件,然后分别用css-loader，vue-style-loader去解析
                //解析器的执行顺序是从下往上(先css-loader再vue-style-loader)
                test: /\.css$/,
                use: [
                    ...
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    ...
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    ...
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude:/node_modules/ //exclude表示忽略node_modules文件夹下的文件，不用转码
            }
        ]
    }
};
```

### 现在我们来试下async await语法吧
>utils.js
```javascript
//utils.js
export default function getData(){
    return new Promise((resolve, reject) =>{
        resolve('ok');
    })
}
```

>main.js
```javascript
import getData from './utils';
import Vue from 'vue';

import './style/common.scss';

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    async fetchData() {
      const data = await getData();
      this.message = data;
    }
  },
  created() {
    this.fetchData();
  }
});
```

## 第六步： 引入图片资源
* 把图片当成模块引入
```bash
npm install --save-dev file-loader
```

>webpack.config.js添加一个loader
```javascript
{
    test: /\.(png|jpg|gif|svg)$/,
    loader: 'file-loader',
    options: {
        name: '[name].[ext]?[hash]'
    }
}
```

### 在src目录下新建一个img目录，存放一张图片logo.png

>main.js
```javascript
//main.js
import getData from './utils';
import Vue from 'vue';
import './style/common.scss';


Vue.component('my-component',{
    template: '<img :src="url" />',
    data() {
        return {
            url: require('./img/logo.png')
        }
    }
})


var app =  new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    },
    methods: {
        async fetchData(){
            const data = await getData();
            this.message = data;
        }
    },
    created(){
        this.fetchData();
    }
});
```

> index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Webpack-Vue</title>
</head>
<body>
    <div id="app">
        {{message}}
        <my-component />
    </div>
    <script src="/dist/build.js"></script>
</body>
</html>
```

* 在此刻我在重新 npm run server 的时候我报了一个如下的错误，应该是由版本引起的

### 解决方案：
```bash
npm install --save-dev babel-loader@7

```

### 安装完后重新 npm run server 便可以看见，图片也被正确加载了

> Couldn't find preset "@babel/preset-env" relative to directory
* 原因： `webpack.config.js` 中  exclude:'/node_modules/'  多了 【' '】单引号
* 解决问题： ` exclude: /node_modules/ `