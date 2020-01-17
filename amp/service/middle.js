require('@babel/register')

const _ = require('lodash')
const { handlerError } = require('../../api/comm')
const superagent = require('superagent')
const { redisFetching } = require('../../api/middle/ioredisHandler')
const { getDate, getSectionColorModifier, getCredit, getStoryHeroImageSrc, composeAnnotation, firstTwoUnstyledParagraph, getTweetIdFromEmbeddedCode } = require('./util')
const { API_PROTOCOL, API_HOST, API_PORT, API_TIMEOUT, API_DEADLINE, SERVER_PROTOCOL, SERVER_HOST } = require('../../api/config')
const { DFP_UNITS, DFP_ID, GA_ID, COMSCORE_C2_ID, MATCHED_CONTENT_AD_CLIENT, MATCHED_CONTENT_AD_SLOT, ALEXA_ATRK_ACCT, SITE_DOMAIN } = require('../../src/constants')

const apiHost = API_PROTOCOL + '://' + API_HOST + ':' + API_PORT

const errorDispatcher = (error, res) => {
  switch (error.status) {
    case 404:
      res.status(404).render('404')
      break
    case 500:
      res.status(500).render('500', { err: error, timestamp: (new Date()).toString() })
      break
    default:
      res.status(error.status).send({
        status: error.status,
        text: error.text
      })
  }
}
const validateSlugIsEmpty = (req, res, next) => {
  const slug = _.get(req, ['params', 'slug'], '')
  if (_.isEmpty(slug)) {
    res.status(404).render('404')
  } else {
    next()
  }
}

const fetchFromRedis = (req, res, next) => {
  const slug = req.params.slug
  const url = `/getposts?where={"slug":"${slug}","isAudioSiteOnly":false}&clean=content`
  req.fetchURL = url

  redisFetching(req.fetchURL, ({ error, data }) => {
    if (!error) {
      console.log('[AMP] Fetch data from Redis success\n[AMP]', req.fetchURL)
      res.redis = data
      next()
    } else {
      // const errWrapped = handlerError(error)
      // errorDispatcher(errWrapped, res)
      console.error('[AMP] Fetch data from Redis in fail\n[AMP]', req.fetchURL, '\n', error)
      next()
    }
  })
}

const fetchStory = async (req, res, next) => {
  if (res.redis) {
    const resData = JSON.parse(res.redis)
    res.resData = resData
    next()
  } else {
    const fetchURLAPI = `${apiHost}${req.fetchURL}`
    try {
      console.log(`[AMP] Start fetch data from API: ${fetchURLAPI}`)
      const response = await superagent
        .get(fetchURLAPI)
        .timeout(
          {
            response: API_TIMEOUT, // Wait 5 seconds for the server to start sending,
            deadline: API_DEADLINE || 60000 // but allow 1 minute for the file to finish loading.
          }
        )

      const data = JSON.parse(response.text)
      const dataAmount = _.get(data, '_meta.total')
      if (dataAmount && dataAmount > 0) {
        // /**
        //  * If req target is post, have the redis ttl be 7 days.
        //  */
        // const exp_post_query = /^\/getposts\?[A-Za-z0-9.*+?^=!:${}()#%~&_@\-`|\[\]\/\\]*/
        // redisWriting(req.fetchURL, response.text, null, exp_post_query.test(req.fetchURL) && 60 * 60 * 24 * 7)

        console.log(`[AMP] Data exist from API: ${fetchURLAPI}`)
        res.resData = data
        next()
      } else {
        console.warn(`[AMP] Data not exist from API: ${fetchURLAPI}`)
        res.status(404).render('404')
      }
    } catch (error) {
      const errWrapped = handlerError(error)
      errorDispatcher(errWrapped, res)

      if (errWrapped.status !== 404) {
        console.error('[AMP] Error occurred during fetching data from api.\n', `[AMP] ${fetchURLAPI}\n`, error)
      } else {
        console.warn(`[AMP] Not Found: ${fetchURLAPI}`)
      }
    }
  }
}

const getArticleData = (req, res, next) => {
  const data = res.resData
  const articleData = _.get(data, ['_items', 0], {})
  res.articleData = articleData
  next()
}

const validateArticle = (req, res, next) => {
  if (_.isEmpty(res.articleData)) {
    console.warn(`[AMP] Article data is empty, response 404: ${req.fetchURL}`)
    res.status(404).render('404')
  } else if (_.get(res.articleData, ['publishedDate'], '') === '') {
    console.warn(`[AMP] Article's publishedDate is empty, response 404: ${req.fetchURL}`)
    res.status(404).render('404')
  }

  next()
}

const sendArticleData = (req, res, next) => {
  const createArticleData = articleData => {
    const _sectionTitle = _.get(articleData, ['sections', 0, 'title'])
    const _sectionTitleCategories = _.get(articleData, ['categories', 0, 'title'], '')
    const _sectionId = _.get(articleData, ['sections', 0, '_id'])
    const _sectionDFPUnits = _.get(DFP_UNITS, [_sectionId, 'AMP'], _.get(DFP_UNITS, ['other', 'AMP'], {}))
    const _storyPublishedDate = _.get(articleData, ['publishedDate'], '')
    const _storyUpdatedAt = _.get(articleData, ['updatedAt'], '')
    const _storyTitle = _.get(articleData, ['title'], '')
    const _storySlug = _.get(articleData, ['slug'], '')
    const _storyHeroVideoSrc = _.get(articleData, ['heroVideo', 'video', 'url'], '')
    const _storyHeroCaption = _.get(articleData, ['heroCaption'], '')
    const _storyBriefs = _.get(articleData, ['brief', 'apiData'], [])
    const _storyBriefsAnnotation = _.get(_.find(_storyBriefs, ['type', 'annotation']), ['content'], '')
    const _storyContent = _.get(articleData, ['content', 'apiData'], [])
    const _storyContentsAnnotation = _.get(_.find(_storyContent, ['type', 'annotation']), ['content'], '')
    const _storyAdTrace = _.get(articleData, 'adTrace', '')
    const _storyRelateds = _.get(articleData, ['relateds'], [])

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
      showAMPAds: !_.get(articleData, 'hiddenAdvertised', false),
      AMPAds: {
        DFP_ID,
        DFPUnits: _sectionDFPUnits
      },
      GA_ID,
      COMSCORE_C2_ID,
      MATCHED_CONTENT_AD_CLIENT,
      MATCHED_CONTENT_AD_SLOT,
      ALEXA_ATRK_ACCT,
      SITE_DOMAIN
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
  validateArticle,
  sendArticleData
}
