const express = require('express')
const router = express.Router()

const lynda = require('../modules/lynda')

router.post('/scraper', (req, res, next) => {
  lynda.scraper(req.body.url, videos => {
    res.send(videos)
  })
})

router.post('/videos', (req, res, next) => {
  lynda.videos(req.body.course, req.body.video, req.body.cookie, data => {
    res.send(data)
  })
})

router.get('/login', (req, res, next) => {
  lynda.login(data => {
    res.send(data)
  })
})

module.exports = router
