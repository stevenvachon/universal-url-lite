"use strict";
const gzipSize = require("gzip-size");
const {minify} = require("terser");
const prettyBytes = require("pretty-bytes");
const promisify = require("util.promisify");

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
	.then(({gzipped, raw}) => console.log(`${path} :: ${raw}, ${gzipped} gzipped`));
};



module.exports = Promise.all(
[
	measureFile("full.js"),
	measureFile("lite.js"),
	measureFile("native.js")
]);
