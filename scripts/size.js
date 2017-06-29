"use strict";
const {minify} = require("uglify-js");
const prettyBytes = require("pretty-bytes");
const promisify = require("util.promisify");

const gzipSize = promisify( require("gzip-size") );
const readFile = promisify( require("fs").readFile );



const filesize = source =>
{
	const output = { raw:prettyBytes(source.length) };

	return gzipSize(source)
	.then(size => output.gzipped = prettyBytes(size))
	.then(() => output);
};



const measureFile = path =>
{
	return readFile(`${__dirname}/../${path}`, "utf8")
	.then(source => minify(source).code)
	.then(source => filesize(source))
	.then(size => console.log(`${path} :: ${size.raw}, ${size.gzipped} gzipped`));
};



module.exports = Promise.all(
[
	measureFile("full.js"),
	measureFile("lite.js"),
	measureFile("native.js")
]);
