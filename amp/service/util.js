require('@babel/register')

const moment = require('moment')
const { get } = require('lodash')
const { SERVER_PROTOCOL, SERVER_HOST } = require('../../api/config')
const { SECTION_MAP } = require('../../src/constants')

const getDate = (date, offsetHour = 0) => {
  try {
    const normalizedDt = new Date(date)
    const datetime = moment(normalizedDt).add(offsetHour, 'hours').format('YYYY.MM.DD HH:mm')
    return {
      dateFormatted: datetime,
      dateISO: normalizedDt.toISOString()
    }
  } catch (e) {
    console.warn(`[AMP] Invalid time value encounter in getDate: ${date}`)
    console.warn('[AMP] Return current time')
    return {
      dateFormatted: moment().add(offsetHour, 'hours').format('YYYY.MM.DD HH:mm'),
      dateISO: new Date().toISOString()
    }
  }
}

const getSectionColorModifier = (sectionId) => {
  return get(SECTION_MAP, [sectionId, 'sectionName'], '')
}

const getCredit = ({ camera_man: cameraMan = [], designers = [], engineers = [], extend_byline: extendByline = '', photographers = [], writers = [] }) => {
  const getCreditStr = (peopleRole) => peopleRole.filter((person) => person).map((person) => `<a href="/author/${person._id}">${person.name}</a>`).join('&nbsp;')
  const writerStr = (writers.length > 0) ? getCreditStr(writers) : ''
  const creditWriterStr = (writerStr || extendByline) ? `文/${writerStr}${(writerStr && extendByline) ? '&nbsp;' : ''}${extendByline}` : ''
  const creditPhotoStr = (photographers.length > 0) ? `攝影/${getCreditStr(photographers)}` : ''
  const creditDesignStr = (designers.length > 0) ? `設計/${getCreditStr(designers)}` : ''
  const creditEnginStr = (engineers.length > 0) ? `工程/${getCreditStr(engineers)}` : ''
  const creditCamStr = (cameraMan.length > 0) ? `影音/${getCreditStr(cameraMan)}` : ''
  return [creditWriterStr, creditPhotoStr, creditDesignStr, creditEnginStr, creditCamStr].filter((o) => o).join('&nbsp;&nbsp;&nbsp;&nbsp;')
}

const getStoryHeroImageSrc = (heroImage) => {
  const dimensions = {
    desktop: get(heroImage, 'image.resizedTargets.desktop.url', get(heroImage, 'image.url', `${SERVER_PROTOCOL}://${SERVER_HOST}/assets/mirrormedia/notImage.png`)),
    tablet: get(heroImage, 'image.resizedTargets.tablet.url', get(heroImage, 'image.url', `${SERVER_PROTOCOL}://${SERVER_HOST}/assets/mirrormedia/notImage.png`)),
    mobile: get(heroImage, 'image.resizedTargets.mobile.url', get(heroImage, 'image.url', `${SERVER_PROTOCOL}://${SERVER_HOST}/assets/mirrormedia/notImage.png`)),
    tiny: get(heroImage, 'image.resizedTargets.tiny.url', get(heroImage, 'image.url', `${SERVER_PROTOCOL}://${SERVER_HOST}/assets/mirrormedia/notImage.png`))
  }
  return dimensions
}

const annotationTextTagStart = '<!--__ANNOTATION__='
const annotationTextTagEnd = '-->'
const hasAnnotation = (paragraph) => {
  const annotationContentStart = paragraph.toString().indexOf(annotationTextTagStart)
  const annotationContentEnd = paragraph.toString().indexOf(annotationTextTagEnd)

  return (annotationContentStart > -1 && annotationContentEnd > -1)
}

const composeAnnotation = (annotationStr) => {
  const annotationContentStart = annotationStr.toString().indexOf(annotationTextTagStart)
  const annotationContentEnd = annotationStr.toString().indexOf(annotationTextTagEnd)

  const annotationContent = hasAnnotation(annotationStr) ? annotationStr.toString().substring(annotationContentStart + '<!--__ANNOTATION__='.length, annotationContentEnd) : '{}'

  const annotationContentObj = JSON.parse(annotationContent)

  let paragraph = annotationStr.toString()

  if (get(annotationContentObj, ['text'])) {
    paragraph = paragraph.replace(`--><!--${annotationContentObj.text}-->`, '')
  }

  return {
    annotationPart1: annotationStr.toString().substring(0, annotationContentStart),
    annotationPart2: annotationContentObj.text,
    annotationPart3: hasAnnotation(paragraph.substring(annotationContentEnd)) ? composeAnnotation(paragraph.substring(annotationContentEnd)) : paragraph.substring(annotationContentEnd),
    annotationText: get(annotationContentObj, ['pureAnnotationText'], '')
  }
}

const firstTwoUnstyledParagraph = (apiData) => {
  // const { content } = articleData
  const records = []
  let count = 0
  let index = 0
  let lastUnstyled = 0
  while (count < 2 && index < apiData.length) {
    if (apiData[index].type === 'unstyled' && (lastUnstyled + 4) < index) {
      count++
      lastUnstyled = index
      records.push(index)
    }
    index++
  }
  return records
}

const getTweetIdFromURL = (url) => {
  if (!url.includes('twitter')) { return url }

  if (url.includes('?')) {
    url = url.split('?')[0]
  }

  url = url.replace('https://', '').split('/')
  return url[url.length - 1]
}

const getTweetIdFromEmbeddedCode = (code) => {
  if (code === '') { return '' }

  const regex = /href=["']([^"']*)["']/g
  let m
  const matchs = []

  while ((m = regex.exec(code)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        matchs.push(match)
      }
    })
  }

  return getTweetIdFromURL(matchs[matchs.length - 1])
}

module.exports = {
  getDate,
  getSectionColorModifier,
  getCredit,
  getStoryHeroImageSrc,
  composeAnnotation,
  firstTwoUnstyledParagraph,
  getTweetIdFromEmbeddedCode
}
