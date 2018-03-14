"use strict";
const browserify = require("browserify");
const builtins = Object.assign({}, require("browserify/lib/builtins"));
const {createWriteStream} = require("fs");
const streamToPromise = require("stream-to-promise");

builtins.buffer = require.resolve("../shims/buffer");



module.exports = streamToPromise
(
	browserify(require.resolve("universal-url/browser"), { builtins, standalone:"UniversalURL" })
	.transform("babelify",  { global:true, presets:["env"], plugins:[["transform-builtin-extend", { globals:["Uint8Array"] }], "transform-new-target"] })
	// TODO :: https://github.com/benbria/aliasify/issues/48
	.transform("aliasify",  { global:true, aliases:{ "tr46":"./shims/tr46" }})
	.bundle()
	.pipe( createWriteStream("./lite.js") )
);
