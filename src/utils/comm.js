import { MIRROR_MEDIA } from '../constants'
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export function getAuthor(article, option = '') {
    let writers = (_.get(article, ['writers', 'length'], 0) > 0) ?
        '文｜' + _.map(article.writers, (n) => { return '<a href="' + getAuthorHref(n) + '">' + _.get(n, ['name'], null) + '</a>' }).join('、') : ''
    let photographers = (_.get(article, ['photographers', 'length'], 0) > 0) ?
        '<br>攝影｜' + _.map(article.photographers, (n) => { return _.get(n, ['name'], null) }).join('、') : ''
    let designers = (_.get(article, ['designers', 'length'], 0) > 0) ?
        '<br>設計｜' + _.map(article.designers, (n) => { return _.get(n, ['name'], null) }).join('、') : ''
    let engineers = (_.get(article, ['engineers', 'length'], 0) > 0) ?
        '<br>工程｜' + _.map(article.engineers, (n) => { return _.get(n, ['name'], null) }).join('、') : ''
    let external = '<br>' + _.get(article, 'extendByline', '')
    switch (option) {
        case 'writers':
            return writers
            break
        default:
            return (writers + photographers + designers + engineers + external)
    }
}

export function getAuthorHref(author = {}) {
    return '/author/' + author.id
}

export function getBrief(article, count = 30) {
    let brief = sanitizeHtml(_.get(article, ['brief', 'html'], ''), { allowedTags: [] })
    return truncate(brief, count)
}

export function getHref(relAritlcle = {}) {
    const { style = '', slug } = relAritlcle
    switch (style) {
        case "projects":
            return `/projects/${slug}`
        default:
            return `/story/${slug}`
    }
}

export function getImage(article, size) {
    switch (size) {
        case 'desktop':
            return _.get(article, ['heroImage', 'image', 'resizedTargets', 'desktop', 'url'])
        case 'mobile':
            return _.get(article, ['heroImage', 'image', 'resizedTargets', 'mobile', 'url'])
        case 'tablet':
            return _.get(article, ['heroImage', 'image', 'resizedTargets', 'tablet', 'url'])
        case 'tiny':
            return _.get(article, ['heroImage', 'image', 'resizedTargets', 'tiny', 'url'])
        default:
            return _.get(article, ['heroImage', 'image', 'resizedTargets', 'desktop', 'url'])
    }
}

export function getSection(article) {
    switch (_.get(article, ['style'])) {
        case 'article':
            return _.get(article, 'sections[0].name') ? _.get(article, 'sections[0].name') : ''
        case 'projects':
            return 'projects'
        default:
            return 'other'
    }
}

export function shareGooglePlus({ route, shared }) {
    window.open(`https://plus.google.com/share?url=${MIRROR_MEDIA}/${route}`);
    shared && shared()
}

export function shareLine({ title, route, shared }) {
    window.open(`https://line.naver.jp/R/msg/text/?${encodeURIComponent(title)}%0D%0A${encodeURIComponent(MIRROR_MEDIA + '/' + route)}`)
    shared && shared()
}

export function shareFacebook({ route, shared }) {
    window.open(`https://www.facebook.com/share.php?u=${MIRROR_MEDIA}/${route}`)
    shared && shared()
}

export function getTitle(article, count = 30) {
    return truncate(_.get(article, ['title']), count)
}

export function getTruncatedVal(oVal, count) {
    return truncate(oVal, count)
}

export function getValue(o = {}, p = [], d = '') {
    return _.get(o, p, d)
}

export function getHost() {
    const browser = typeof window !== 'undefined'
    if (browser) {
        return `//${location.host}`
    } else {
        const host = process.env.HOST || 'localhost'
        const port = parseInt(process.env.PORT) || 8080
        return `${host}:${port}`
    }
}