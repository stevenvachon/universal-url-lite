"use strict";
const browserify = require("browserify");
const {createWriteStream} = require("fs");
const streamToPromise = require("stream-to-promise");



module.exports = Promise.all(
[
	require("./build-lite"),

	streamToPromise
	(
		browserify(require.resolve("universal-url/browser"), { plugins:["common-shakeify"], standalone:"UniversalURL" })
		.transform("babelify", { global:true, presets:["@babel/preset-env"] })
		.bundle()
		.pipe( createWriteStream("./full.js") )
	),
]);
