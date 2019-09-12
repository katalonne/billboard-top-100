<h1 align="center">Billboard Top 100</h1>

[![Build Status](https://travis-ci.org/katalonne/billboard-top-100.svg?branch=master)](https://travis-ci.org/katalonne/billboard-top-100)
[![codebeat badge](https://codebeat.co/badges/299f68a9-8267-4f8d-a3e8-9abc5910f582)](https://codebeat.co/projects/github-com-katalonne-billboard-top-100-master)
[![GitHub open issues](https://img.shields.io/github/issues/katalonne/billboard-top-100.svg)](https://github.com/katalonne/billboard-top-100/issues?q=is%3Aopen+is%3Aissue)
[![npm version](https://img.shields.io/npm/v/billboard-top-100.svg)](https://www.npmjs.com/package/billboard-top-100)
[![MIT License](https://img.shields.io/github/license/katalonne/billboard-top-100.svg)](https://github.com/katalonne/billboard-top-100/blob/master/LICENSE)

Promise and Callback based module API for getting Billboard chart list
For browser and node.js

## Installation
```bash
yarn add @katalonne/billboard-top-100

npm install --save @katalonne/billboard-top-100
```
## Usage

```javascript
import getChart from 'billboard-top-100';

// or

const getChart = require('billboard-top-100')

// With Promise
getChart('hot-100').then(chart => {
  console.log(chart)
}).catch(e => {
  console.error(e)
})

// or 

// With a callback
getChart('hot-100', (err, chart) => {
  if (err !== null) {
    console.error(err)
  }

  console.log(chart)
})

```
<a name="getChart"></a>

#### getChart([chartName], [week], [callback])

| Param       | Type                  | Default      | Description                                          |
|-------------|-----------------------|--------------|------------------------------------------------------|
| [chartName] | <code>string</code>   | 'hot-100'    | Billboard chart name. ('hot-100' or 'billboard-200') |
| [week]      | <code>string</code>   | current week | chart week. YYYY-MM-DD (Example: '2019-06-01')       |
| [callback]  | <code>Function</code> |              | <code>(err, chart) => { ... }</code>                 |

All parameters are optional, therefore you can pass just the callback.

## License

MIT © [katalonne](https://github.com/katalonne)