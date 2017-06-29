"use strict";
const browserify = require("browserify");
const {createWriteStream} = require("fs");
const streamToPromise = require("stream-to-promise");

const babelFix = require("./babel-fix");



module.exports = Promise.all(
[
	require("./build-lite"),

	streamToPromise
	(
		browserify(require.resolve("universal-url/browser"), { standalone:"UniversalURL" })
		.transform("babelify", { global:true, presets:["es2015"] })
		.bundle()
		.pipe( babelFix() )
		.pipe( createWriteStream("./full.js") )
	),
]);
