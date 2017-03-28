import { SITE_URL } from '../constants'
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
    let brief
    if (_.split(_.get(article, ['href']), '/')[1] == 'topic') {
        brief = _.get(article, ['ogDescription'])
    } else {
        brief = sanitizeHtml(_.get(article, ['brief', 'html'], ''), { allowedTags: [] })
    }
    return truncate(brief, count)
}

export function getHref(relAritlcle = {}) {
    const { href, style = '', slug } = relAritlcle
    switch (style) {
        case "projects":
            return `/projects/${slug}`
        default:
            if (_.split(href, '/')[1] == 'topic') {
                return href
            } else {
                return `/story/${slug}/`
            }
    }
}

export function getImage(article, size) {
    let image
    if (article.heroImage && article.heroImage.image) {
        image = article.heroImage
    } else {
        image = article.ogImage
    }
    switch (size) {
        case 'desktop':
            return _.get(image, ['image', 'resizedTargets', 'desktop', 'url'], '/public/notImage.png')
        case 'mobile':
            return _.get(image, ['image', 'resizedTargets', 'mobile', 'url'], '/public/notImage.png')
        case 'tablet':
            return _.get(image, ['image', 'resizedTargets', 'tablet', 'url'], '/public/notImage.png')
        case 'tiny':
            return _.get(image, ['image', 'resizedTargets', 'tiny', 'url'], '/public/notImage.png')
        default:
            return _.get(image, ['image', 'resizedTargets', 'desktop', 'url'], '/public/notImage.png')
    }
}

export function getName(article) {
    return _.get(article, ['name'])
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
    window.open(`https://plus.google.com/share?url=${SITE_URL}/${route}`);
    shared && shared()
}

export function shareLine({ title, route, shared }) {
    window.open(`https://line.naver.jp/R/msg/text/?${encodeURIComponent(title)}%0D%0A${encodeURIComponent(SITE_URL + '/' + route)}`)
    shared && shared()
}

export function shareFacebook({ route, shared }) {
    window.open(`https://www.facebook.com/share.php?u=${SITE_URL}/${route}`)
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