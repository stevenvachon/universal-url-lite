"use strict";
const isString = require("is-string");
const utf8 = require("utf8-typed");



class Buffer extends Uint8Array
{
	constructor(input)
	{
		if (isString(input) === true)
		{
			input = utf8.encode(input);
		}

		super(input);
	}



	static from(input)
	{
		return new Buffer(input);
	}



	toString()
	{
		return utf8.decode(this);
	}
}



module.exports = { Buffer };
