<div align="center">
  <img width="200" height="200"
    src="https://worldvectorlogo.com/logos/html5.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://worldvectorlogo.com/logos/webpack.svg">
  </a>
  <h1>VM Loader</h1>
  <p>Exports .vm file as HTML String, also supports Separation between Data and Code.<p>
</div>

<h2 align="center">安装</h2>

```bash
npm i -D vm-loader
```

<h2 align="center">用法</h2>

vm-loader能够解析velocity语法，转换成HTML并输出字符串给下一个loader。  
支持本地模拟后台数据开发，数据文件会默认加入webpack dependency依赖树，当数据文件发生变动时，webpack-dev-server能监听到文件变动并自动刷新。  
基于模块化规范，模块与数据是一对一的关系，即一个模块对应一份数据文件，数据文件划分为常规数据类型（number、string、array、object等）和函数数据类型两种，划分依据是函数数据一般是稳定不变的，而常规数据类型由于测试需要经常得做随机生成文本数字等操作（本地mock数据推荐使用[mockjs](http://mockjs.com/)），划分为两部分可以加快webpack编译速度，另一个考虑是数据文件以.json为格式存储的，而json是不能容下函数的，所以必须以.js文件格式来存放函数数据类型。 

可配置options详情如下：
```
dataPath：模块的数据文件路径，可以是相对路径也可以是绝对路径，文件存放格式必须是json
funPath：模块的函数文件路径，可以是相对路径也可以是绝对路径，文件存放格式必须是js
```
e.g.
```js
{
  test: /\.vm$/,
  use: [
	{
	  loader: "html-loader"
	},
	{
	  loader: 'vm-loader',
	  options: {
	    dataPath: './src/module1-data.json',
	    funPath: './src/common.js' // 函数数据文件最好整理到一份公共的js文件中
	  }
	}
  ]
}
```
通过动态配置webpack将json数据文件hook到相应的模块中去
```js
// 默认所有的模块都在同一个目录下
// 默认json数据文件的命名和模块文件夹一致
// 假设所有模块数据都放在./src/mock/直接目录下
// eg：模块名称数组是：var modulesArr = ['header', 'body', 'footer'];
const webpack = require('webpack');
const webpack_config = require('./webpack.config');
const webpackDevServer = require('webpack-dev-server');
modulesArr.forEach((module) => {
  webpack_config.module.rules.unshift({
    test: eval("/\.vm$/i"),
    include: eval(module),
    use: [
      {
        loader: "html-loader"
      },
      {
        loader: 'vm-loader',
        options: {
          dataPath: './src/mock/'+module+'.json',
          funPath: './src/common.js' // 函数数据文件最好整理到一份公共的js文件中
        }
      }
    ]
  });
});
//webpack dev server
const compiler = webpack(webpack_config);
new webpackDevServer(compiler, {
  stats: {
    colors: true,
    chunks: false
  },
  noInfo: false,
  proxy: {
    '*': {
      target: 'http://localhost:3000',
    }
  }
}).listen(8080, function(){console.log('App (dev) is now running on port 8080!');});
```
