
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from 'src/constants'
import { get } from 'lodash'

function generateJSONLDNewsArticle (post) {
  const url = `${SITE_URL}/story/${get(post, 'slug')}/`
  const image = get(post, 'ogImage.image.resizedTargets.desktop')
  const sectionTitle = get(post, 'sections.0.title')
  const tags = get(post, 'tags') || []
  return `
    {
      "@context": "http://schema.org", "@type": "NewsArticle", "headline": "${get(post, 'title')}",
      "url": "${url}",
      "thumbnailUrl": "${get(image, 'url')}",
      "articleSection": "${sectionTitle}",
      "keywords": [ ${tags.map(tag => tag.name)} ],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${url}"
      },
      "image": {
        "@type": "ImageObject",
        "url": "${get(image, 'url')}",
        "height": ${get(image, 'height')},
        "width": ${get(image, 'width')}
      },
      "datePublished": "${get(post, 'publishedDate')}",
      "dateModified": "${get(post, 'updatedAt')}",
      "author": {
        "@type": "Person",
        "name": "${get(post, 'writers.0.name')}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "${SITE_TITLE}",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.mirrormedia.mg/assets/images/logo.png"
        }
      },
      "description": "${get(post, 'brief.apiData.0.content.0')}"
    }
  `
}

function generateJSONLDPerson (post) {
  return `
    {
      "@context": "http://schema.org",
      "@type": "Person",
      "name": "${get(post, 'writers.0.name')}",
      "url": "${SITE_URL}/author/${get(post, 'writers.0.id')}",
      "brand": {
        "@type": "Brand",
        "name": "${SITE_TITLE}",
        "url": "${SITE_URL}",
        "image": "https://www.mirrormedia.mg/assets/mirrormedia/logo.svg",
        "logo": "https://www.mirrormedia.mg/assets/mirrormedia/logo.svg",
        "description": "${SITE_DESCRIPTION}"
      }
    }
  `
}

function generateJsonLDBreadcrumbList (post) {
  return `
    {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@id": "${SITE_URL}",
            "name": "${SITE_TITLE}"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@id": "${SITE_URL}/section/${get(post, 'sections.0.name')}",
            "name": "${get(post, 'sections.0.title')}"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@id": "${SITE_URL}/story/${get(post, 'slug')}",
            "name": "${get(post, 'title')}"
          }
        }
      ]
    }
  `
}

export function insertJSONLDScript (post) {
  if (document) {
    const newsArticleScript = document.createElement('script')
    const personScript = document.createElement('script')
    const breadcrumbScript = document.createElement('script')
    newsArticleScript.setAttribute('id', 'js-newsArticle')
    newsArticleScript.setAttribute('type', 'application/ld+json')
    newsArticleScript.innerHTML = generateJSONLDNewsArticle(post)
    personScript.setAttribute('id', 'js-person')
    personScript.setAttribute('type', 'application/ld+json')
    personScript.innerHTML = generateJSONLDPerson(post)
    breadcrumbScript.setAttribute('id', 'js-breadcrumb')
    breadcrumbScript.setAttribute('type', 'application/ld+json')
    breadcrumbScript.innerHTML = generateJsonLDBreadcrumbList(post)
    if (!document.getElementById('js-newsArticle')) {
      document.querySelector('head').appendChild(newsArticleScript)
    }
    if (!document.getElementById('js-person')) {
      document.querySelector('head').appendChild(personScript)
    }
    if (!document.getElementById('js-breadcrumb')) {
      document.querySelector('head').appendChild(breadcrumbScript)
    }
  }
}
