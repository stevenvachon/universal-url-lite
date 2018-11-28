# universal-url-lite [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Monitor][greenkeeper-image]][greenkeeper-url]

> A smaller Universal WHATWG [`URL`](https://developer.mozilla.org/en/docs/Web/API/URL), for Browserify/etc.


The [universal-url](https://npmjs.com/universal-url) package bundles to 392kB (99kB gzipped). This package exists to compile the same to a smaller file size via custom optimizations.

**This package is not meant to be required/imported directly**. It should be added to your browser build process as an alias.


## Installation

[Node.js](http://nodejs.org/) `>= 6` is required. To install, type this at the command line:
```shell
npm install universal-url-lite
```


## Default Shim ![File Size][filesize-lite-uncp-image] ![File Size][filesize-lite-gzip-image]

Usage:

```json
"browser": {
  "universal-url": "universal-url-lite"
}
```

File size optimizations have been made, particularly the near-complete exclusion of the TR46 implementation. Functionality is essentially the same as the `universal-url` package, with the exception of IDNA validation and normalization. If a URL contains a hostname with any of the ~4500 Unicode characters requiring a specific casefold, comparison will produce false negatives. Consider this example:

```js
const url1 = 'http://ㅼㅼㅼ/';
const url2 = 'http://ᄯᄯᄯ/';

if (new URL(url1).hostname !== new URL(url2).hostname) {
    // This is wrong
}
```

With invalid IDNAs passing through without error, you will instead need to rely on errors produced by `XMLHttpRequest`/`fetch` to know that such URLs are unreachable.

**Note:** You will need to exclude this browser shim from bundle parsing since it has already been compiled. Browserify has the `--noparse` CLI option and Webpack has the `noParse` package.json key.

```shell
browserify in.js --outfile=out.js --noparse='/project/node_modules/universal-url-lite/lite.js'
```


## "Native" Shim ![File Size][filesize-natv-uncp-image]

This actually includes no shim at all for browser builds. Only the latest browsers will be supported.

Usage:

```json
"browser": {
  "universal-url": "universal-url-lite/native"
}
```


[npm-image]: https://img.shields.io/npm/v/universal-url-lite.svg
[npm-url]: https://npmjs.org/package/universal-url-lite
[filesize-lite-gzip-image]: https://img.shields.io/badge/size-19kB%20gzipped-blue.svg
[filesize-lite-uncp-image]: https://img.shields.io/badge/size-73kB-blue.svg
[filesize-natv-uncp-image]: https://img.shields.io/badge/size-336B-blue.svg
[travis-image]: https://img.shields.io/travis/stevenvachon/universal-url-lite.svg
[travis-url]: https://travis-ci.org/stevenvachon/universal-url-lite
[greenkeeper-image]: https://badges.greenkeeper.io/stevenvachon/universal-url-lite.svg
[greenkeeper-url]: https://greenkeeper.io/
