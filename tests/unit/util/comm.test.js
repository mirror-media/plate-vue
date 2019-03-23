import {
  getArticleReadTime,
  getAuthor,
  getAuthorHref,
  getBrief,
  getHref,
  getHrefFull,
  getImage,
  getSection,
  getTruncatedVal,
  getValue,
  getHost,
  getClientOS,
  setMmCookie,
  extractSlugFromReferrer
} from '../../../src/util/comm.js'
import { SITE_URL, SITE_PROJ_URL, } from '../../../src/constants'

describe('getArticleReadTime', () => {
  test('should return 0 min', () => {
    const paragraphs1 = [ { type: 'audio', content: [ '測試用字串' ] } ]
    const paragraphs2 = [ { type: 'unstyled', content: [ '' ] } ]
    const paragraphs3 = [ { type: 'unstyled', content: [ ' ' ] } ]
    const paragraphs4 = [ 5 ]
    const paragraphs5 = null
    expect(getArticleReadTime()).toBe(0)
    expect(getArticleReadTime([])).toBe(0)
    expect(getArticleReadTime(paragraphs1)).toBe(0)
    expect(getArticleReadTime(paragraphs2)).toBe(0)
    expect(getArticleReadTime(paragraphs3)).toBe(0)
    expect(getArticleReadTime(paragraphs4)).toBe(0)
    expect(getArticleReadTime(paragraphs5)).toBe(0)
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
  const articleOnlyBrief = {
    brief: '<p>台灣獨立遊戲《還願》因被眼尖玩家發現藏有暗諷中國國家主席習近平的場景素材，導致中國官方全面封殺。有中國媒體工作者評論，《還願》上市前盛大的ARG（Alternate reality game，另類實境遊戲）活動，也是引爆這次事件的遠因之一。 </p>'
  }

  const articleOnlyOgDescription = {
    ogDescription: '台灣獨立遊戲《還願》因被眼尖玩家發現藏有暗諷中國國家主席習近平的場景素材，導致中國官方全面封殺。有中國媒體工作者評論，《還願》上市前盛大的ARG（Alternate reality game，另類實境遊戲）活動，也是引爆這次事件的遠因之一。 '
  }

  const articleIsEmpty = null

  test('use article brief html to return truncated brief', () => {
    expect(getBrief(article)).toBeString()
    expect(getBrief(article).length).toEqual(31)
  })

  test('use article brief to return truncated brief', () => {
    expect(getBrief(articleOnlyBrief)).toBeString()
    expect(getBrief(articleOnlyBrief).length).toEqual(31)
  })

  test('use article ogDescription to return truncated brief', () => {
    expect(getBrief(articleOnlyOgDescription)).toBeString()
    expect(getBrief(articleOnlyOgDescription).length).toEqual(31)
  })

  test('return empty brief', () => {
    expect(getBrief(articleIsEmpty)).toBeString()
    expect(getBrief(articleIsEmpty).length).toEqual(0)
  })
})

describe('getHref', () => {
  const article = {
    style: 'article',
    slug: "20190304gamearg",
  }

  const articleBelongCampaign = {
    style: 'campaign',
    slug: "20190304gamearg",
  }

  const articleBelongProjects = {
    style: 'projects',
    slug: "20190304gamearg",
  }

  test('return href', () => {
    expect(getHref(article)).toBeString()
    expect(getHref(article)).toEqual('/story/20190304gamearg/')
    expect(getHref(articleBelongCampaign)).toBeString()
    expect(getHref(articleBelongCampaign)).toEqual('/campaigns/20190304gamearg')
    expect(getHref(articleBelongProjects)).toBeString()
    expect(getHref(articleBelongProjects)).toEqual('/projects/20190304gamearg')
  })
})

describe('getHrefFull', () => {
  const article = {
    style: 'article',
    slug: "20190304gamearg",
  }

  const articleBelongCampaign = {
    style: 'campaign',
    slug: "20190304gamearg",
  }

  const articleBelongProjects = {
    style: 'projects',
    slug: "20190304gamearg",
  }

  const articleBelongReadr = {
    style: 'readr',
    slug: "20190304gamearg",
  }

  test('return href', () => {
    expect(getHrefFull(article)).toBeString()
    expect(getHrefFull(article)).toEqual(`${SITE_URL}/story/20190304gamearg/`)
    expect(getHrefFull(articleBelongCampaign)).toBeString()
    expect(getHrefFull(articleBelongCampaign)).toEqual(`${SITE_URL}/campaigns/20190304gamearg`)
    expect(getHrefFull(articleBelongProjects)).toBeString()
    expect(getHrefFull(articleBelongProjects)).toEqual(`${SITE_URL}/projects/20190304gamearg`)
    expect(getHrefFull(articleBelongReadr)).toBeString()
    expect(getHrefFull(articleBelongReadr)).toEqual(`${SITE_PROJ_URL}/project/20190304gamearg`)
  })
})

describe('getImage', () => {
  const article = {
    heroImage: {
      image: {
        resizedTargets: {
          desktop: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png' },
          mobile: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-mobile.png' },
          tablet: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tablet.png' },
          tiny: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tiny.png' },
        }
      }
    }
  }

  const articleOnlyOgImage = {
    ogImage: {
      image: {
        resizedTargets: {
          desktop: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png' },
          mobile: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-mobile.png' },
          tablet: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tablet.png' },
          tiny: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tiny.png' },
        }
      }
    }
  }

  const articleOnlyHeroVideo = {
    heroVideo: {
      coverPhoto: {
        image: {
          resizedTargets: {
            desktop: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png' },
            mobile: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-mobile.png' },
            tablet: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tablet.png' },
            tiny: { url: '/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-tiny.png' },
          }
        }
      }
    }
  }

  const articleWithoutImage = {}

  test('return hero image url', () => {
    expect(getImage(article)).toBeString()
    expect(getImage(article)).toEqual('/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png')
  })
  test('return og image url', () => {
    expect(getImage(articleOnlyOgImage)).toBeString()
    expect(getImage(articleOnlyOgImage)).toEqual('/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png')
  })
  test('return hero video cover photo url', () => {
    expect(getImage(articleOnlyHeroVideo)).toBeString()
    expect(getImage(articleOnlyHeroVideo)).toEqual('/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-desktop.png')
  })
  test('return not image url', () => {
    expect(getImage(articleWithoutImage)).toBeString()
    expect(getImage(articleWithoutImage)).toEqual('/assets/mirrormedia/notImage.png')
  })
  test('return specific image size', () => {
    expect(getImage(article, 'mobile')).toBeString()
    expect(getImage(article, 'mobile')).toEqual('/assets/images/20190304110037-5c9ca8da1b98d124699617535e34cefb-mobile.png')
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

  const articleBelongProjects = {
    style: "projects",
  }

  const articleIsEmpty = null

  test('return article section', () => {
    expect(getSection(article)).toBeString()
    expect(getSection(article)).toEqual('news')
  })
  test('return empty section', () => {
    expect(getSection(articleWithoutSection)).toBeString()
    expect(getSection(articleWithoutSection)).toEqual('')
  })
  test('return projects', () => {
    expect(getSection(articleBelongProjects)).toBeString()
    expect(getSection(articleBelongProjects)).toEqual('projects')
  })
  test('return other', () => {
    expect(getSection(articleIsEmpty)).toBeString()
    expect(getSection(articleIsEmpty)).toEqual('other')
  })
})

describe('getTruncatedVal', () => {
  const text1 = '台灣獨立遊戲《還願》因被眼尖玩家發現藏有暗諷中國國家主席習近平的場景素材，導致中國官方全面封殺。'
  const text2 = 'Devotion is a first-person atmospheric horror game depicting the life of a family shadowed by religious belief.'
  const text3 = '台灣獨立遊戲《還願》因被眼尖玩家發現藏有暗諷中國國家主席習近平的場景素材，導致中國官方全面封殺。有中國媒體工作者評論，《還願》上市前盛大的ARG（Alternate reality game，另類實境遊戲）活動，也是引爆這次事件的遠因之一。 '
  test('return truncated text', () => {
    expect(getTruncatedVal(text1, 10)).toBeString()
    expect(getTruncatedVal(text1, 10).length).toEqual(11)
    expect(getTruncatedVal(text2, 10)).toBeString()
    expect(getTruncatedVal(text2, 10).length).toEqual(11)
    expect(getTruncatedVal(text3, 10)).toBeString()
    expect(getTruncatedVal(text3, 10).length).toEqual(11)
  })
})

describe('getValue', () => {
  test('return value', () => {
    const test = { name: '小熊維尼' }
    expect(getValue(test, [ 'name' ])).toEqual('小熊維尼')
    expect(getValue(test, [ 'game' ], '跳跳虎')).toEqual('跳跳虎')
    expect(getValue(test, [ 'game' ])).toBeEmpty()
  })
})

describe('getHost', () => {
  test('return localhost', () => {
    expect(getHost()).toEqual('//localhost')
  })
})

describe('getClientOS', () => {
  test('return os', () => {
    expect(getClientOS()).toBeNil()
  })
})

describe('setMmCookie', () => {
  test('return uuid', () => {
    expect(setMmCookie()).toBeString()
    expect(setMmCookie().length).toEqual(36)
  })
})

describe('extractSlugFromReferrer', () => {
  test('return referrer', () => {
    expect(extractSlugFromReferrer('https://www.mirrormedia.mg/story/20190227edi004/')).toBeString()
    expect(extractSlugFromReferrer('https://www.mirrormedia.mg/story/20190227edi004/')).toEqual('20190227edi004')
  })
  test('return referrer N/A', () => {
    expect(extractSlugFromReferrer('https://www.mirrormedia.mg/')).toBeString()
    expect(extractSlugFromReferrer('https://www.mirrormedia.mg/')).toEqual('N/A')
    expect(extractSlugFromReferrer('')).toBeString()
    expect(extractSlugFromReferrer('')).toEqual('N/A')
    expect(extractSlugFromReferrer()).toBeString()
    expect(extractSlugFromReferrer()).toEqual('N/A')
  })
})
