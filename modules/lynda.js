const request = require('request')
const cheerio = require('cheerio')

const Lynda = class {
  constructor () {
    this.scraper = (url, callback) => {
      if ((/\.lynda\.com\/.+\/\d+-\d+\.html/).test(url)) {
        request.get(url, (err, resp, body) => {
          err && console.log(err)
          console.log('lynda.com', resp.statusMessage, resp.statusCode)

          const $ = cheerio.load(body)
          let videos = []
          $('.item-name.video-name').each((i, e) => {
            let link = $(e).attr('href')
            if ((/\.lynda\.com\/.+\/\d+\/\d+-\d+\.html/).test(link)) {
              let [linkMatch, courseId, videoId] = link.match(/\/(\d+)\/(\d+)-\d+\.html/)
              let [nameMatch, name] = $(e).text().match(/\b(.+)\b/)
              videos.push({
                course: courseId,
                id: videoId,
                name: name,
                link: link,
                index: ++i
              })
            }
          })
          callback && callback(videos)
        })
      } else {
        callback && callback()
      }
    }

    this.videos = (course, video, cookie, callback) => {
      let options = {
        url: 'https://www.lynda.com/ajax/course/' + course + '/' + video + '/play',
        headers: {
          'Cookie': cookie
        }
      }
      request.get(options, (err, resp, body) => {
        err && console.log(err)
        console.log('lynda.com ajax', resp.statusMessage, resp.statusCode)

        callback && callback(body)
      })
    }

    this.login = callback => {
      request.get('https://www.lynda.com/portal/sip?org=dclibrary.org', (err, resp, body) => {
        err && console.log(err)
        console.log('lynda.com loginpage', resp.statusMessage, resp.statusCode)

        let cookie = ''
        resp.headers['set-cookie'].forEach(e => {
          cookie += e + ';'
        })

        const $ = cheerio.load(body)

        let seasurf = $('#seasurf').val()

        let options = {
          url: 'https://www.lynda.com/portal/sip?org=dclibrary.org',
          headers: {
            'Cookie': cookie
          },
          form: {
            currentView: 'login',
            libraryCardNumber: '21172023811625',
            libraryCardPasswordVerify: '',
            libraryCardPin: '8953',
            org: 'dclibrary.org',
            seasurf: seasurf
          }
        }
        request.post(options, (err, resp, body) => {
          err && console.log(err)
          console.log('lynda.com login', resp.statusMessage, resp.statusCode)

          let cookie = ''
          resp.headers['set-cookie'].forEach(e => {
            cookie += e + ';'
          })

          callback && callback(cookie)
        })
      })
    }
  }
}

module.exports = new Lynda()
