"use strict";
const {beforeEach, describe, it} = require("mocha");
const {expect} = require("chai");
const Nightmare = require("nightmare");

let browser;



const getBrowser = () => new Nightmare({ nodeIntegration:false }).goto("about:blank");



const it_URL = ({checkHost, useGlobal}) =>
{
	it(`works${useGlobal ? " globally" : ""}`, function()
	{
		return browser.evaluate( function(useGlobal)
		{
			var URL;

			if (useGlobal)
			{
				UniversalURL.shim();
				URL = window.URL;
			}
			else
			{
				URL = UniversalURL.URL;
			}

			var url = new URL("http://ᄯᄯᄯ.ExAmPlE/?param=value");

			// Cannot return a native instance
			return {
				hostname: url.hostname,
				search: url.search,
				param: url.searchParams.get("param")
			};
		}, useGlobal)
		.then(result =>
		{
			if (checkHost)
			{
				expect(result.hostname).to.equal("xn--brdaa.example");
			}

			expect(result.search).to.equal("?param=value");
			expect(result.param).to.equal("value");
		});
	});
};



const it_URLSearchParams = ({useGlobal}) =>
{
	it(`works${useGlobal ? " globally" : ""}`, function()
	{
		return browser.evaluate( function(useGlobal)
		{
			var URLSearchParams;

			if (useGlobal)
			{
				UniversalURL.shim();
				URLSearchParams = window.URLSearchParams;
			}
			else
			{
				URLSearchParams = UniversalURL.URLSearchParams;
			}

			var params = new URLSearchParams("?p1=v&p2=&p2=v&p2");

			// Cannot return a native instance
			return {
				params: params,
				p1: params.get("p1"),
				p2: params.get("p2"),
				p2all: params.getAll("p2")
			};
		}, useGlobal)
		.then(result =>
		{
			expect(result.params).to.not.be.undefined;
			expect(result.p1).to.equal("v");
			expect(result.p2).to.equal("");
			expect(result.p2all).to.deep.equal(["", "v", ""]);
		});
	});
};



describe("Web Browser (without native)", function()
{
	before(() => browser = getBrowser());
	after(() => browser.end());



	describe(`"lite"`, function()
	{
		beforeEach(() => browser.refresh().evaluate( function()
		{
			window.URL = undefined;
			window.URLSearchParams = undefined;
		})
		.then(() => browser.inject("js", "./lite.js")));

		describe("URL", function()
		{
			it_URL({ checkHost:true, useGlobal:false });
			it_URL({ checkHost:true, useGlobal:true });
		});

		describe("URLSearchParams", function()
		{
			it_URLSearchParams({ useGlobal:false });
			it_URLSearchParams({ useGlobal:true });
		});
	});



	describe(`"native"`, function()
	{
		beforeEach(() => browser.refresh().evaluate( function()
		{
			window.URL = undefined;
			window.URLSearchParams = undefined;
		})
		.then(() => browser.inject("js", "./native.js")));



		describe("URL", function()
		{
			it("does not work", function()
			{
				return browser.evaluate( function()
				{
					// Cannot return a native instance
					return typeof UniversalURL.URL;
				})
				.then( function(result)
				{
					expect(result).to.equal("undefined");
				});
			});



			it("does not work globally", function()
			{
				return browser.evaluate( function()
				{
					UniversalURL.shim();

					// Cannot return a native instance
					return typeof URL;
				})
				.then( function(result)
				{
					expect(result).to.equal("undefined");
				});
			});
		});



		describe("URLSearchParams", function()
		{
			it("does not work", function()
			{
				return browser.evaluate( function()
				{
					// Cannot return a native instance
					return typeof UniversalURL.URLSearchParams;
				})
				.then( function(result)
				{
					expect(result).to.equal("undefined");
				});
			});



			it("does not work globally", function()
			{
				return browser.evaluate( function()
				{
					UniversalURL.shim();

					// Cannot return a native instance
					return typeof URLSearchParams;
				})
				.then( function(result)
				{
					expect(result).to.equal("undefined");
				});
			});
		});
	});
});



// TODO :: `checkHost:true` when Chrome correctly converts from Unicode to ASCII
describe("Web Browser (with native)", function()
{
	before(() => browser = getBrowser());
	after(() => browser.end());



	describe(`"lite"`, function()
	{
		beforeEach(() => browser.refresh().inject("js", "./lite.js"));

		describe("URL", function()
		{
			it_URL({ checkHost:false, useGlobal:false });
			it_URL({ checkHost:false, useGlobal:true });
		});

		describe("URLSearchParams", function()
		{
			it_URLSearchParams({ useGlobal:false });
			it_URLSearchParams({ useGlobal:true });
		});
	});



	describe(`"native"`, function()
	{
		beforeEach(() => browser.refresh().inject("js", "./native.js"));

		describe("URL", function()
		{
			it_URL({ checkHost:false, useGlobal:false });
			it_URL({ checkHost:false, useGlobal:true });
		});

		describe("URLSearchParams", function()
		{
			it_URLSearchParams({ useGlobal:false });
			it_URLSearchParams({ useGlobal:true });
		});
	});
});
