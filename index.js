'use strict';
var loaderUtils = require('loader-utils'),
	path = require('path'),
    Velocity = require('velocityjs'),
    Compile = Velocity.Compile;

module.exports = function(content) {
    if (this.cacheable) { this.cacheable(); }

    var query = loaderUtils.parseQuery(this.query);

    if (typeof query === "object" && query.contextPath) {
    	var context = require(path.resolve(query.contextPath));
    	content = (new Compile(Velocity.parse(content))).render(context);
    }else{
    	content = (new Compile(Velocity.parse(content))).render({});
    }

    return content;
};
