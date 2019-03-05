import {
  getArticleReadTime,
  getAuthor,
  getAuthorHref,
  getBrief,
  getHref,
  getHrefFull,
  getImage,
  getSection,
} from '../../../src/util/comm.js'
import { SITE_URL, SITE_PROJ_URL, } from '../../../src/constants'

describe('getArticleReadTime', () => {
  test('should return 0 min', () => {
    const paragraphs = [ { type: 'audio', content: [ '測試用字串' ] } ]
    const paragraphs_2 = [ { type: 'unstyled', content: [ '' ] } ]
    const paragraphs_3 = [ { type: 'unstyled', content: [ ' ' ] } ]
    const paragraphs_4 = [ 5 ]
    const paragraphs_5 = null
    expect(getArticleReadTime()).toBe(0)
    expect(getArticleReadTime([])).toBe(0)
    expect(getArticleReadTime(paragraphs)).toBe(0)
    expect(getArticleReadTime(paragraphs_2)).toBe(0)
    expect(getArticleReadTime(paragraphs_3)).toBe(0)
    expect(getArticleReadTime(paragraphs_4)).toBe(0)
    expect(getArticleReadTime(paragraphs_5)).toBe(0)
  })
  test('should return 1 min', () => {
    const paragraphs = [ { type: 'unstyled', content: [ '測試用字串' ] } ]
    expect(getArticleReadTime(paragraphs)).toBe(1)
  })
  test('should return 2 min', () => {
    const paragraphs = [ { type: 'unstyled', content: [ `測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串測試用字串
    測試用字串測試用字串測試用字串測試用字串` ] } ]
    expect(getArticleReadTime(paragraphs)).toBe(2)
  })
})

describe('getAuthor', () => {
  const article = {
    writers: [
      {
        id: "test123",
        name: "測試用",
      },
      {
        id: "test321",
        name: "測試測試",
      }
    ],
    photographers: [
      {
        name: "我是攝影",
      },
    ],
    designers: [
      {
        name: "我是設計",
      },
    ],
    engineers: [
      {
        name: "我是工程",
      },
    ],
    extendByline: '我是外部'
  }
  const expected = /(文｜)|測試用|測試測試|(攝影｜)|我是攝影|(設計｜)|我是設計|(工程｜)|我是工程|我是外部/
  test('return full info', () => {
    expect(getAuthor(article)).toMatch(expected)
  })
  test('return writers', () => {
    expect(getAuthor(article, 'writers')).toMatch(/(文｜)|測試用/)
    expect(getAuthor(article, 'writers')).not.toMatch(/(攝影｜)|(設計｜)|(工程｜)|我是外部/)
  })
  test('return specific delimiter', () => {
    expect(getAuthor(article, '', '!')).toMatch(/(文!)|(攝影!)|(設計!)|(工程!)/)
  })
})

describe('getAuthorHref', () => {
  const author = { id: "test123", name: "測試用", }
  test('return author page href', () => {
    expect(getAuthorHref(author)).toEqual('/author/test123')
  })
})

describe('getBrief', () => {
  const article = {
    brief: {
      html: '<p>台灣獨立遊戲《還願》因被眼尖玩家發現藏有暗諷中國國家主席習近平的場景素材，導致中國官方全面封殺。有中國媒體工作者評論，《還願》上市前盛大的ARG（Alternate reality game，另類實境遊戲）活動，也是引爆這次事件的遠因之一。 </p>',
    }
  }
  const article_only_brief = {
    brief: '<p>台灣獨立遊戲《還願》因被眼尖玩家發現藏有暗諷中國國家主席習近平的場景素材，導致中國官方全面封殺。有中國媒體工作者評論，《還願》上市前盛大的ARG（Alternate reality game，另類實境遊戲）活動，也是引爆這次事件的遠因之一。 </p>'
  }

  const article_only_ogDescription = {
    ogDescription: '台灣獨立遊戲《還願》因被眼尖玩家發現藏有暗諷中國國家主席習近平的場景素材，導致中國官方全面封殺。有中國媒體工作者評論，《還願》上市前盛大的ARG（Alternate reality game，另類實境遊戲）活動，也是引爆這次事件的遠因之一。 '
  }

  const article_empty = {}

  test('use article brief html to return truncated brief', () => {
    expect(getBrief(article)).toBeString()
    expect(getBrief(article).length).toEqual(31)
  })

  test('use article brief to return truncated brief', () => {
    expect(getBrief(article_only_brief)).toBeString()
    expect(getBrief(article_only_brief).length).toEqual(31)
  })

  test('use article ogDescription to return truncated brief', () => {
    expect(getBrief(article_only_ogDescription)).toBeString()
    expect(getBrief(article_only_ogDescription).length).toEqual(31)
  })

  test('return empty brief', () => {
    expect(getBrief(article_empty)).toBeString()
    expect(getBrief(article_empty).length).toEqual(0)
  })
})

describe('getHref', () => {
  const article = {
    style: 'article',
    slug: "20190304gamearg",
  }

  const article_campaign = {
    style: 'campaign',
    slug: "20190304gamearg",
  }

  const article_projects = {
    style: 'projects',
    slug: "20190304gamearg",
  }

  test('return href', () => {
    expect(getHref(article)).toBeString()
    expect(getHref(article)).toEqual('/story/20190304gamearg/')
    expect(getHref(article_campaign)).toBeString()
    expect(getHref(article_campaign)).toEqual('/campaigns/20190304gamearg')
    expect(getHref(article_projects)).toBeString()
    expect(getHref(article_projects)).toEqual('/projects/20190304gamearg')
  })
})

describe('getHrefFull', () => {
  const article = {
    style: 'article',
    slug: "20190304gamearg",
  }

  const article_campaign = {
    style: 'campaign',
    slug: "20190304gamearg",
  }

  const article_projects = {
    style: 'projects',
    slug: "20190304gamearg",
  }

  const article_readr = {
    style: 'readr',
    slug: "20190304gamearg",
  }

  test('return href', () => {
    expect(getHrefFull(article)).toBeString()
    expect(getHrefFull(article)).toEqual(`${SITE_URL}/story/20190304gamearg/`)
    expect(getHrefFull(article_campaign)).toBeString()
    expect(getHrefFull(article_campaign)).toEqual(`${SITE_URL}/campaigns/20190304gamearg`)
    expect(getHrefFull(article_projects)).toBeString()
    expect(getHrefFull(article_projects)).toEqual(`${SITE_URL}/projects/20190304gamearg`)
    expect(getHrefFull(article_readr)).toBeString()
    expect(getHrefFull(article_readr)).toEqual(`${SITE_PROJ_URL}/project/20190304gamearg`)
  })
})

describe('getImage', () => {
  const article = {
    heroImage: {
      image: {
        resizedTargets: {
          desktop: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png' },
          mobile: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-mobile.png' },
          tablet: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tablet.png' },
          tiny: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tiny.png' },
        }
      }
    }
  }

  const article_ogImage = {
    ogImage: {
      image: {
        resizedTargets: {
          desktop: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png' },
          mobile: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-mobile.png' },
          tablet: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tablet.png' },
          tiny: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tiny.png' },
        }
      }
    }
  }

  const article_heroVideo = {
    heroVideo: {
      coverPhoto: {
        image: {
          resizedTargets: {
            desktop: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png' },
            mobile: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-mobile.png' },
            tablet: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tablet.png' },
            tiny: { url: 'https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tiny.png' },
          }
        }
      }
    }
  }

  const article_notImage = {}

  test('return hero image url', () => {
    expect(getImage(article)).toBeString()
    expect(getImage(article)).toEqual('https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png')
  })
  test('return og image url', () => {
    expect(getImage(article_ogImage)).toBeString()
    expect(getImage(article_ogImage)).toEqual('https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png')
  })
  test('return hero video cover photo url', () => {
    expect(getImage(article_heroVideo)).toBeString()
    expect(getImage(article_heroVideo)).toEqual('https://www.mirrormedia.com.tw/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png')
  })
  test('return not image url', () => {
    expect(getImage(article_notImage)).toBeString()
    expect(getImage(article_notImage)).toEqual('/assets/mirrormedia/notImage.png')
  })
})

describe('getSection', () => {
  const article = {
    style: "article",
    sections: [
      {
        name: "news"
      }
    ]
  }

  const articleWithoutSection = {
    style: "article",
  }

  const article_projects = {
    style: "projects",
  }

  const article_empty = null

  test('return article section', () => {
    expect(getSection(article)).toBeString()
    expect(getSection(article)).toEqual('news')
  })
  test('return empty section', () => {
    expect(getSection(articleWithoutSection)).toBeString()
    expect(getSection(articleWithoutSection)).toEqual('')
  })
  test('return projects', () => {
    expect(getSection(article_projects)).toBeString()
    expect(getSection(article_projects)).toEqual('projects')
  })
  test('return other', () => {
    expect(getSection(article_empty)).toBeString()
    expect(getSection(article_empty)).toEqual('other')
  })
})
