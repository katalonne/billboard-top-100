const request = require('then-request')

const isBrowser = typeof window != 'undefined'

// From https://github.com/caolan/async/blob/master/lib/internal/awaitify.js
// conditionally promisify a function.
// only return a promise if a callback is omitted
function awaitify (asyncFn, arity = asyncFn.length) {
  if (!arity) throw new Error('arity is undefined')
  function awaitable (...args) {
      if (typeof args[arity - 1] === 'function') {
          return asyncFn.apply(this, args)
      }

      return new Promise((resolve, reject) => {
          args[arity - 1] = (err, ...cbArgs) => {
              if (err) return reject(err)
              resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0])
          }
          asyncFn.apply(this, args)
      })
  }

  Object.defineProperty(awaitable, 'name', {
      value: `awaitable(${asyncFn.name})`
  })

  return awaitable
}

function convertToYYYYMMDD(monthDayYearDate) {
  const yyyy = monthDayYearDate.split(',')[1].trim();
  const dd = monthDayYearDate.split(' ')[1].split(',')[0];
  let mm = '';
  switch (monthDayYearDate.split(' ')[0]) {
    case 'January':
      mm = '01';
      break;
    case 'February':
      mm = '02';
      break;
    case 'March':
      mm = '03';
      break;
    case 'April':
      mm = '04';
      break;
    case 'May':
      mm = '05';
      break;
    case 'June':
      mm = '06';
      break;
    case 'July':
      mm = '07';
      break;
    case 'August':
      mm = '08';
      break;
    case 'September':
      mm = '09';
      break;
    case 'October':
      mm = '10';
      break;
    case 'November':
      mm = '11';
      break;
    case 'December':
      mm = '12';
      break;
    default:
      break;
  }
  return `${yyyy}-${mm}-${dd}`;
}

function getCovers(body, imageRE, apostropheRE) {
  return body.match(imageRE)
    .map(item => item.match(apostropheRE))
    .map(item => item[2].split(','))
    .map(items => items[items.length -1].trim().split(' ')[0])
}

function getSongs(body, contentRE, apostropheRE, covers) {
  return body.match(contentRE).reduce((acc, item, idx) => {
    const [ rank, artist, title ] = item.match(apostropheRE).slice(1, -1).map(s => s.slice(1, -1))
    const newItem = { rank: parseInt(rank), artist, title, cover: covers[idx] }
    acc.push(newItem)
    return acc
  }, [])
}

function getFormattedWeek(body, currentWeekRE) {
  const week = body.match(currentWeekRE)[0].split('\n')[1]
  const formattedWeek = convertToYYYYMMDD(week)
  return formattedWeek
}

function getWeeks(body, prevNextWeedRe, apostropheRE, billboardDomain) {
  return body.match(prevNextWeedRe).map(item => {
    const aTag = item.split('\n')[1]
    const [link] = aTag.match(apostropheRE)

    const url = billboardDomain + link.slice(1, -1)
    const date = url.split('/').pop()

    const result = { url, date }
    return result
  })
}

/**
 * 
 * @param {String} chartName hot-100 or billboard-200
 * @param {String | Funnction} date or cb
 * @param {Function} callback option
 * @returns {Promise} a promise, if no callback is passed
 */
const getChart = function (chartName = 'hot-100', date, cb)  {
  // if second argument is a function then we assume is the callback
  if (typeof arguments[1] === 'function') { cb = arguments[1]; date = ''}
  // if first argument is a function then we assume is the callback
  if (typeof arguments[0] === 'function') { cb = arguments[0]; date = ''; chartName = 'hot-100'}
  if (!['hot-100','billboard-200'].includes(chartName)) {
      const err = '[billboard-top-100]: chartName must be equal \'hot-100\' or \'billboard-200\''
      cb(err, null)
      return
  }
  const billboardDomain = `https://www.billboard.com`
  const billboardLink = `${billboardDomain}/charts/${chartName}${date ? `/${date}` : ''}`
  request('GET', billboardLink).then(res => {
    const statusOK = String(res.statusCode)[0] === '2'
    if (statusOK) {
      // RegEx Patterns
      const contentRE = /<div.*class="chart-list-item.*data-rank=".*>/gi
      const imageRE = /<img.*class="chart-list-item__image.*>/gi
      const apostropheRE = /"([^"]*)"/gi
      const prevNextWeekRE = /dropdown__date-selector-option ">(.*?)<s/gs
      const currentWeekRE = /chart-detail-header__date-selector-button">(.*?)</gs
      
      const body = isBrowser ? res.getBody() : res.getBody().toString()
      const covers = getCovers(body, imageRE, apostropheRE)
      const songs = getSongs(body, contentRE, apostropheRE, covers)
      const week = getFormattedWeek(body, currentWeekRE)
      const [previousWeek, nextWeek] = getWeeks(body, prevNextWeekRE, apostropheRE, billboardDomain)

      const chart = {
        songs,
        week,
        previousWeek, 
        nextWeek
      }

      cb(null, chart)
    } else {
      const error = `Something went wrong, got status ${res.statusCode}`
      cb(error, null)
    }
  })
}

module.exports = awaitify(getChart, 3);

// Allow use of default import syntax in TypeScript
module.exports.default = awaitify(getChart, 3);