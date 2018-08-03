const express = require('express')
const router = express.Router()
const { validateSlugIsEmpty, fetchFromRedis, fetchStory, getArticleData, sendArticleData } = require('./middle')

router.get('/:slug?', validateSlugIsEmpty, [ fetchFromRedis, fetchStory ], getArticleData, sendArticleData)

module.exports = router