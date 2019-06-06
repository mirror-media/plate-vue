const express = require('express')
const router = express.Router()
const {
  validateSlugIsEmpty,
  fetchFromRedis,
  fetchStory,
  getArticleData,
  validateArticle,
  sendArticleData
} = require('./middle')

router.get(
  '/:slug?',
  validateSlugIsEmpty,
  [ fetchFromRedis, fetchStory ],
  getArticleData,
  validateArticle,
  sendArticleData
)

module.exports = router