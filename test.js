"use strict";
const {before, beforeEach, describe, it} = require("mocha");
const {expect} = require("chai");
const puppeteer = require("puppeteer");

let browser, page;



const openBrowser = () =>
{
	return puppeteer.launch({ args: ["--no-sandbox"] })
	.then(puppeteerInstance =>
	{
		browser = puppeteerInstance;
		return puppeteerInstance.newPage();
	})
	.then(pageInstance =>
	{
		page = pageInstance;
	});
};



const it_URL = ({checkHost, useGlobal}) =>
{
	it(`works${useGlobal ? " globally" : ""}`, () =>
	{
		return page.evaluate(useGlobal =>
		{
			let URL;

			if (useGlobal)
			{
				UniversalURL.shim();
				URL = window.URL;
			}
			else
			{
				URL = UniversalURL.URL;
			}

			const url = new URL("http://ᄯᄯᄯ.ExAmPlE/?param=value#hash");

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
	it(`works${useGlobal ? " globally" : ""}`, () =>
	{
		return page.evaluate(useGlobal =>
		{
			let URLSearchParams;

			if (useGlobal)
			{
				UniversalURL.shim();
				URLSearchParams = window.URLSearchParams;
			}
			else
			{
				URLSearchParams = UniversalURL.URLSearchParams;
			}

			const params = new URLSearchParams("?p1=v&p2=&p2=v&p2");

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



describe("Web Browser (without native)", () =>
{
	before(() => openBrowser());
	after(() => browser.close());



	describe(`"lite"`, () =>
	{
		beforeEach(() =>
		{
			return page.reload()
			.then(() => page.evaluate(() =>
			{
				window.URL = undefined;
				window.URLSearchParams = undefined;
			}))
			.then(() => page.addScriptTag({ path: "./lite.js" }));
		});

		describe("URL", () =>
		{
			it_URL({ checkHost:true, useGlobal:false });
			it_URL({ checkHost:true, useGlobal:true });
		});

		describe("URLSearchParams", () =>
		{
			it_URLSearchParams({ useGlobal:false });
			it_URLSearchParams({ useGlobal:true });
		});
	});



	describe(`"native"`, () =>
	{
		beforeEach(() =>
		{
			return page.reload()
			.then(() => page.evaluate(() =>
			{
				window.URL = undefined;
				window.URLSearchParams = undefined;
			}))
			.then(() => page.addScriptTag({ path: "./native.js" }));
		});



		describe("URL", () =>
		{
			it("does not work", () =>
			{
				return page.evaluate(() =>
				{
					// Cannot return a native instance
					return typeof UniversalURL.URL;
				})
				.then(result =>
				{
					expect(result).to.equal("undefined");
				});
			});



			it("does not work globally", () =>
			{
				return page.evaluate(() =>
				{
					UniversalURL.shim();

					// Cannot return a native instance
					return typeof URL;
				})
				.then(result =>
				{
					expect(result).to.equal("undefined");
				});
			});
		});



		describe("URLSearchParams", () =>
		{
			it("does not work", () =>
			{
				return page.evaluate(() =>
				{
					// Cannot return a native instance
					return typeof UniversalURL.URLSearchParams;
				})
				.then(result =>
				{
					expect(result).to.equal("undefined");
				});
			});



			it("does not work globally", () =>
			{
				return page.evaluate(() =>
				{
					UniversalURL.shim();

					// Cannot return a native instance
					return typeof URLSearchParams;
				})
				.then(result =>
				{
					expect(result).to.equal("undefined");
				});
			});
		});
	});
});



// TODO :: `checkHost:true` when Chrome correctly converts from Unicode to ASCII
describe("Web Browser (with native)", () =>
{
	before(() => openBrowser());
	after(() => browser.close());



	describe(`"lite"`, () =>
	{
		beforeEach(() => page.reload().then(() => page.addScriptTag({ path: "./lite.js" })));

		describe("URL", () =>
		{
			it_URL({ checkHost:false, useGlobal:false });
			it_URL({ checkHost:false, useGlobal:true });
		});

		describe("URLSearchParams", () =>
		{
			it_URLSearchParams({ useGlobal:false });
			it_URLSearchParams({ useGlobal:true });
		});
	});



	describe(`"native"`, () =>
	{
		beforeEach(() => page.reload().then(() => page.addScriptTag({ path: "./native.js" })));

		describe("URL", () =>
		{
			it_URL({ checkHost:false, useGlobal:false });
			it_URL({ checkHost:false, useGlobal:true });
		});

		describe("URLSearchParams", () =>
		{
			it_URLSearchParams({ useGlobal:false });
			it_URLSearchParams({ useGlobal:true });
		});
	});
});
