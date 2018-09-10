"use strict";
const browserify = require("browserify");
const builtins = Object.assign({}, require("browserify/lib/builtins"));
const {createWriteStream} = require("fs");
const streamToPromise = require("stream-to-promise");

builtins.buffer = require.resolve("../shims/buffer");



module.exports = streamToPromise
(
	browserify(require.resolve("universal-url/browser"), { builtins, plugins:["common-shakeify"], standalone:"UniversalURL" })
	.transform("babelify", { global:true, presets:["@babel/preset-env"] })
	// TODO :: https://github.com/benbria/aliasify/issues/48
	.transform("aliasify", { global:true, aliases:{ "tr46":"./shims/tr46" }})
	.bundle()
	.pipe( createWriteStream("./lite.js") )
);
