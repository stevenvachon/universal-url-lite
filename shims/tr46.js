"use strict";
const punycode = require("punycode");



const uppercaseChars = /[A-Z]/g;



const toASCII = domainName =>
{
	let error = false;

	// Lowercase without changing any international Unicode characters
	domainName = domainName.replace(uppercaseChars, match => match.toLowerCase());

	const labels = domainName.split(".").map(label =>
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
};



const toUnicode = domainName =>
{
	let error = false;

	const labels = domainName.split(".").map(label =>
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
};



module.exports = { toASCII, toUnicode };
