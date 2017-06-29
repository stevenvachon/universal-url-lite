"use strict";
var g;



if (typeof window !== "undefined")
{
	g = window;
}
else if (typeof global !== "undefined")
{
	g = global;
}
else if (typeof self !== "undefined")
{
	g = self;
}
else
{
	g = this;
}



var output =
{
	shim: function(){},
	URL: g.URL,
	URLSearchParams: g.URLSearchParams
};



if (typeof define === "function" && define.amd)
{
	define(function(){ return output });
}
else if (typeof exports === "object")
{
	module.exports = output;
}
else
{
	g.UniversalURL = output;
}
