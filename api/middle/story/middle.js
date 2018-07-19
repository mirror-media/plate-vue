require('babel-core/register')
require('babel-polyfill')

const _ = require('lodash')
const { get, isEmpty, find, } = require('lodash')
const superagent = require('superagent')
const { redisFetching, redisWriting, } = require('../redisHandler')
const { getDate, getSectionColorModifier, getCredit, getStoryHeroImageSrc, composeAnnotation, firstTwoUnstyledParagraph } = require('./util')
const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, API_DEADLINE, SERVER_PROTOCOL, SERVER_HOST } = require('../../config')
const { DFP_UNITS, DFP_ID } = require('../../../src/constants')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT

const validateSlugIsEmpty = (req, res, next) => {
  const slug = get(req, [ 'params', 'slug' ], '')
  if (isEmpty(slug)) {
    res.status(404).render('404')
  } else {
    next()
  }
}

const fetchFromRedis = (req, res, next) => {
  const slug = req.params.slug
  const url = `${apiHost}/posts?where={"slug":{"$in":["${slug}"]}}&clean=content`
  req.fetchURL = url
  
  redisFetching(req.fetchURL, ({ error, data }) => {
     if (!error) {
       res.redis = data
       next()
     } else {
       console.error('>>> Fetch data from Redis in fail')
       console.error('>>>', req.fetchURL)
       next(error)
     }
   })
 }

const fetchStory = (req, res, next) => {
  if (res.redis) {
    const resData = JSON.parse(res.redis)
    res.resData = resData
    next()
  } else {
    superagent
    .get(req.fetchURL)
    .timeout({
      response: API_TIMEOUT,  // Wait 5 seconds for the server to start sending,
      deadline: API_DEADLINE ? API_DEADLINE : 60000, // but allow 1 minute for the file to finish loading.
    })
    .end((error, response) => {
      if (!error && response) {
        let res_data

        try {
          res_data = JSON.parse(response.text)
        } catch (e) {
          res.send(e)
          console.error(`>>> Got bad data from api.`)
          console.error(`>>> ${req.url}`)
          console.error(e) 
          return 
        }
        res.resData = res_data

        const res_num = get(res_data, [ '_meta', 'total' ])
        if (res_num && res_num > 0) {
          res.dataString = response.text
          redisWriting(req.fetchURL, res.dataString, () => {
            next()
          })
        }
      } else {
        const status = get(response, 'status') || get(error, 'status') || 500
        res.header('Cache-Control', 'no-cache')
        res.status(status).send(error)
        if (status !== 404) {
          console.error(`>>> Error occurred during fetching data from api.`)
          console.error(`>>> ${url}`)
          console.error(error)  
        } else {
          console.error(`Not Found: ${url}`)
        }
      }
    })
  }
}

const getArticleData = (req, res, next) => {
  const data = res.resData
  const articleData = get(data, [ '_items', 0 ], {})
  res.articleData = articleData
  next()
}

const sendArticleData = (req, res, next) => {
  const articleData = {
    storyInfo: {
      sectionName: get(res.articleData, [ 'categories', 0, 'title' ], get(res.articleData, [ 'sections', 0, 'title' ], '')),
      sectionColorModifier: getSectionColorModifier(get(res.articleData, [ 'sections', 0, '_id' ])),
      storyDatePublished: getDate(get(res.articleData, [ 'publishedDate' ], '')),
      storyDateUpdated: getDate(get(res.articleData, [ 'updatedAt' ], '')),
      storyTitle: get(res.articleData, [ 'title' ], ''),
      storySlug: get(res.articleData, [ 'slug' ], ''),
      storyURL: `${SERVER_PROTOCOL}://${SERVER_HOST}/story/${get(res.articleData, [ 'slug' ], '')}`,
      storyURLAMP: `${SERVER_PROTOCOL}://${SERVER_HOST}/story/amp/${get(res.articleData, [ 'slug' ], '')}`,
      storyCredits: getCredit(res.articleData)
    },
    storyHeroVideo: {
      src: get(res.articleData, [ 'heroVideo', 'video', 'url' ], '')
    },
    storyHeroImage: {
      src: getStoryHeroImageSrc(res.articleData.heroImage),
      caption: get(res.articleData, [ 'heroCaption' ], '')
    },
    storyBriefs: get(res.articleData, [ 'brief', 'apiData' ], []),
    storyBriefAnnotation: composeAnnotation(get(find(get(res.articleData, [ 'brief', 'apiData' ], []), [ 'type', 'annotation' ]), [ 'content' ], '')),
    storyContent: get(res.articleData, [ 'content', 'apiData' ], []),

    // For Ads usage:
    storyContentFirstTwoUnstyledParagraph: firstTwoUnstyledParagraph(get(res.articleData, [ 'content', 'apiData' ], [])),

    storyContentAnnotation: composeAnnotation(get(find(get(res.articleData, [ 'content', 'apiData' ], []), [ 'type', 'annotation' ]), [ 'content' ], '')),
    storyRelateds: get(res.articleData, [ 'relateds' ], []),
    showAMPAds: !isEmpty(get(DFP_UNITS, [ get(res.articleData, [ 'sections', 0, '_id' ]), 'AMP' ], {})),
    AMPAds: {
      DFP_ID,
      DFPUnits: get(DFP_UNITS, [ get(res.articleData, [ 'sections', 0, '_id' ]), 'AMP' ], {})
    }
  }

  // Let ejs can use lodash methods
  res.locals._ = _
  
  res.status(200).render('amp/index.amp.ejs', articleData)
}

module.exports = {
  validateSlugIsEmpty,
  fetchFromRedis,
  fetchStory,
  getArticleData,
  sendArticleData
}