"use strict";
const isString = require("is-string");
const utf8 = require("utf8-typed");



class Buffer extends Uint8Array
{
	constructor(input)
	{
		if (isString(input))
		{
			input = utf8.encode(input);
		}

		super(input);
	}



	static alloc(size, fill)
	{
		/*if (typeof size !== "number")
		{
			throw new TypeError(`"size" argument must be a number`);
		}
		else if (size < 0)
		{
			throw new RangeError(`"size" argument must not be negative`);
		}
		else
		{*/
			return new Buffer(size).fill(fill);
		//}
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
