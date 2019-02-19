require("@babel/register")
require("@babel/polyfill")

const _ = require('lodash')
const { get, isEmpty, find, } = require('lodash')
const superagent = require('superagent')
const { redisFetching, redisWriting, } = require('../../api/middle/redisHandler')
const { getDate, getSectionColorModifier, getCredit, getStoryHeroImageSrc, composeAnnotation, firstTwoUnstyledParagraph, getTweetIdFromEmbeddedCode } = require('./util')
const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, API_DEADLINE, SERVER_PROTOCOL, SERVER_HOST } = require('../../api/config')
const { DFP_UNITS, DFP_ID, GA_ID, COMSCORE_C2_ID, MATCHED_CONTENT_AD_CLIENT, MATCHED_CONTENT_AD_SLOT, ALEXA_ATRK_ACCT, SITE_DOMAIN } = require('../../src/constants')

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
          console.error(`>>> ${req.url}`)
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
  const createArticleData = articleData => {
    const _sectionTitle =            get(articleData, [ 'sections', 0, 'title' ])
    const _sectionTitleCategories =  get(articleData, [ 'categories', 0, 'title' ], '')
    const _sectionId =               get(articleData, [ 'sections', 0, '_id' ])
    const _sectionDFPUnits =         get(DFP_UNITS, [ _sectionId, 'AMP' ], get(DFP_UNITS, [ 'other', 'AMP' ], {}))
    const _storyPublishedDate =      get(articleData, [ 'publishedDate' ], '')
    const _storyUpdatedAt =          get(articleData, [ 'updatedAt' ], '')
    const _storyTitle =              get(articleData, [ 'title' ], '')
    const _storySlug =               get(articleData, [ 'slug' ], '')
    const _storyHeroVideoSrc =       get(articleData, [ 'heroVideo', 'video', 'url' ], '')
    const _storyHeroCaption =        get(articleData, [ 'heroCaption' ], '')
    const _storyBriefs =             get(articleData, [ 'brief', 'apiData' ], [])
    const _storyBriefsAnnotation =   get(find(_storyBriefs, [ 'type', 'annotation' ]), [ 'content' ], '')
    const _storyContent =            get(articleData, [ 'content', 'apiData' ], [])
    const _storyContentsAnnotation = get(find(_storyContent, [ 'type', 'annotation' ]), [ 'content' ], '')
    const _storyAdTrace =            get(articleData, 'adTrace', '')
    const _storyRelateds =           get(articleData, [ 'relateds' ], [])

    return {
      storyInfo: {
        sectionName: _sectionTitle || _sectionTitleCategories,
        sectionColorModifier: getSectionColorModifier(_sectionId),
        storyDatePublished: getDate(_storyPublishedDate, 8), // add 8 hours offsets to sending correct date from server
        storyDateUpdated: getDate(_storyUpdatedAt, 8),
        storyTitle: _storyTitle,
        storySlug: _storySlug,
        storyURL: `${SERVER_PROTOCOL}://${SERVER_HOST}/story/${_storySlug}`,
        storyURLAMP: `${SERVER_PROTOCOL}://${SERVER_HOST}/story/amp/${_storySlug}`,
        storyCredits: getCredit(articleData)
      },
      storyHeroVideo: {
        src: _storyHeroVideoSrc
      },
      storyHeroImage: {
        src: getStoryHeroImageSrc(articleData.heroImage),
        caption: _storyHeroCaption
      },
      storyBriefs: _storyBriefs,
      storyBriefAnnotation: composeAnnotation(_storyBriefsAnnotation),
      storyContent: _storyContent,
      storyContentAnnotation: composeAnnotation(_storyContentsAnnotation),
      storyContentFirstTwoUnstyledParagraph: firstTwoUnstyledParagraph(_storyContent),
      storyAdTrace: _storyAdTrace,
      storyRelateds: _storyRelateds,
      showAMPAds: !get(articleData, 'hiddenAdvertised', false),
      AMPAds: {
        DFP_ID,
        DFPUnits: _sectionDFPUnits
      },
      GA_ID,
      COMSCORE_C2_ID,
      MATCHED_CONTENT_AD_CLIENT,
      MATCHED_CONTENT_AD_SLOT,
      ALEXA_ATRK_ACCT,
      SITE_DOMAIN,
    }
  }

  const articleData = createArticleData(res.articleData)

  // Let ejs can use lodash methods
  res.locals._ = _
  res.locals.getTweetIdFromEmbeddedCode = getTweetIdFromEmbeddedCode
  
  res.status(200).render('amp/index.amp.ejs', articleData)
}

module.exports = {
  validateSlugIsEmpty,
  fetchFromRedis,
  fetchStory,
  getArticleData,
  sendArticleData
}