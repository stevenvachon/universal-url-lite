"use strict";
const browserify = require("browserify");
const builtins = Object.assign({}, require("browserify/lib/builtins"));
const createWriteStream = require("fs").createWriteStream;
const streamToPromise = require("stream-to-promise");

//const CJStoES2015 = require("rollup-plugin-commonjs")({ sourceMap:false/*, useStrict:false*/ });

builtins.buffer = require.resolve("../shims/buffer");



module.exports = streamToPromise
(
	browserify(require.resolve("universal-url/browser"), { builtins, standalone:"UniversalURL" })
	//.transform("rollupify", { global:true, plugins:[CJStoES2015] })
	.transform("babelify",  { global:true, presets:["es2015"], plugins:[["transform-builtin-extend", { globals:["Uint8Array"] }]] })
	// TODO :: https://github.com/benbria/aliasify/issues/48
	.transform("aliasify",  { global:true, aliases:{ "tr46":"./shims/tr46" }})
	.bundle()
	.pipe( createWriteStream("./lite.js") )
);
