"use strict";
const punycode = require("punycode");



const PROCESSING_OPTIONS = {};
const uppercaseChars = /[A-Z]/g;



function toASCII(domainName)
{
	let error = false;

	// Lowercase without changing any international Unicode characters
	domainName = domainName.replace(uppercaseChars, match => match.toLowerCase());

	const labels = domainName.split(".").map( function(label)
	{
		try
		{
			return punycode.toASCII(label);
		}
		catch(e)
		{
			error = true;
			return label;
		}
	});

	return !error ? labels.join(".") : null;
}



function toUnicode(domainName)
{
	let error = false;

	const labels = domainName.split(".").map( function(label)
	{
		try
		{
			return punycode.toUnicode(label);
		}
		catch(e)
		{
			error = true;
			return label;
		}
	});

	return {
		domain: labels.join("."),
		error
	};
}



module.exports = { PROCESSING_OPTIONS, toASCII, toUnicode };
