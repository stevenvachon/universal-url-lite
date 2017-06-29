"use strict";
const replaceStream = require("replacestream");

const babelFix = () =>
{
	// TODO :: https://github.com/babel/babel/issues/1088
	return replaceStream("new.target", "(this instanceof this.constructor)");
};



module.exports = babelFix;
