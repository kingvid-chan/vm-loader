'use strict';
var loaderUtils = require('loader-utils'),
    path = require('path'),
    fs = require('fs'),
    Velocity = require('velocityjs'),
    Compile = Velocity.Compile;

module.exports = function(content) {
    if (this.cacheable) { this.cacheable(); }
    var callback = this.async(),
        query = loaderUtils.parseQuery(this.query);

    if (typeof query === "object" && query.dataPath) {
        var dataPath = path.resolve(query.dataPath), //存储常规数据类型的json数据
            func = {};  //存储函数数据
        this.addDependency(dataPath);

        if (query.funPath) {
            func = require(path.resolve(query.funPath));
        }

        try{
            fs.readFile(dataPath, 'utf-8', function(err, text){
                if(err) return callback(err);
                try{
                    var context = Object.assign(JSON.parse(text), func),
                        result = (new Compile(Velocity.parse(content))).render(context);
                    callback(null, result);
                }catch(err){
                    callback(err, (new Compile(Velocity.parse(content))).render(func));
                }
            });
        }catch(err){
            console.error('数据文件路径出错', query.dataPath, '找不到该文件');
        }
    }else{
        callback(null, (new Compile(Velocity.parse(content))).render({}));
    }
};