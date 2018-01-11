import { mount } from 'avoriaz'
import RelatedListWithRecommendList from 'src/components/article/RelatedListWithRecommendList.vue'
import Vue from 'vue'

describe('RelatedListWithRecommendList.vue', () => {
  const RelatedListWithRecommendListComp = mount(RelatedListWithRecommendList)
  it('component RelatedListWithRecommendList should have class=\'related-list\'', () => {
    expect(RelatedListWithRecommendListComp.hasClass('related-list')).to.equal(true)
  })
  it('component should contain title \'相關文章\'', () => {
    const relatedsTitle = RelatedListWithRecommendListComp.first('.related-list__list__title')
    const wording = relatedsTitle.first('h4')
    expect(relatedsTitle).to.not.be.undefined
    expect(wording.text()).to.be.string('相關文章')
  })
  const relatedsMock = [
    {
      "style": "article",
      "name": "20171222game_hs",
      "heroImage": "5a3ca8a34be59110005c6afb",
      "title": "《爐石戰記》全明星賽週末開戰　各國好手競逐近300萬元賽事總獎金",
      "brief": { "html": "<p>《爐石戰記》2017全明星賽將於12/23、24日火熱開戰，八位世界頂尖選手將與台灣、香港共八位菁英選手捉對廝殺，賽事總獎金高達美金9萬8000美元，折合新台幣約294萬元，冠軍可獨得2萬美元獎金（約60萬元新台幣）。</p>" },
      "_id": "5a3ca8db4be59110005c6afd",
      "slug": "20171222game_hs",
    },
    {
      "style": "article",
      "name": "20170718game_game",
      "heroImage": "596d98afe531830d00e32232",
      "publishedDate": "Tue, 18 Jul 2017 07:50:00 GMT",
      "brief": {
        "html": "<p>兩個月前，應中國法規要求，暴雪在中國公布了《鬥陣特攻》、《爐石戰記》和《暴雪英霸》的遊戲掉寶率，當時大部分的玩家都猜測各地區的掉寶率應該差不多。</p><p>現在謎底揭曉，暴雪在南韓伺服器也公布了這幾款遊戲的掉寶率，一模一樣。</p>"
      },
      "title": "【遊戲】暴雪在南韓《鬥陣特攻》《爐石戰記》掉寶率同中國",
      "_id": "596d9616e531830d00e32231",
      "slug": "20170718game_game",
    }
  ]
  it('component should render correct relateds', () => {
    RelatedListWithRecommendListComp.setProps({
      relateds: relatedsMock
    })
    const relateds = RelatedListWithRecommendListComp.find('.related-list__list__item[id^="related-"]')
    expect(relateds.length).to.equal(2)
    for (let i = 0; i < 2; i += 1) {
      expect(relateds[ i ].text()).to.equal(relatedsMock[ i ].title)
    }
  })

  const recommendsMock = []
  for(let i = 0; i < 20; i += 1) {
    recommendsMock.push({
      "style": "article",
      "title": "《爐石戰記》全明星賽週末開戰　各國好手競逐近300萬元賽事總獎金" + i,
      "href": "posts/5a3ca8db4be59110005c6afd" + i,
      "_id": "5a3ca8db4be59110005c6afd" + i,
      "slug": "20171222game_hs" + i,
    })
  }
  it('component should render correct recommends', () => {
    RelatedListWithRecommendListComp.setProps({
      relateds: relatedsMock,
      recommends: recommendsMock
    })
    const recommends = RelatedListWithRecommendListComp.find('.related-list__list__item[id^="recommend-"]')
    const recommendsLen = 10 - relatedsMock.length
    const filteredRecommends = RelatedListWithRecommendListComp.vm.filteredRecommends
    expect(recommends.length).to.equal(recommendsLen)
    expect(recommends.length).to.equal(filteredRecommends.length)
    for (let i = 0; i < recommendsLen; i += 1) {
      expect(recommends[ i ].text()).to.equal(recommendsMock[ i ].title)
      expect(recommends[ i ].text()).to.equal(filteredRecommends[ i ].title)
    }
  })
  it('recommends should not contain referrer article and current article', () => {
    const recommendsMockJoinedByRelatedsMock = [ ...relatedsMock, ...recommendsMock ]
    RelatedListWithRecommendListComp.setProps({
      relateds: relatedsMock,
      recommends: recommendsMockJoinedByRelatedsMock,
      excludingArticle: '20171222game_hs0'
    })
    RelatedListWithRecommendListComp.setData({
      referrerSlug: '20171222game_hs1'
    })
    const recommends = RelatedListWithRecommendListComp.find('.related-list__list__item[id^="recommend-"]')
    const filteredRecommends = RelatedListWithRecommendListComp.vm.filteredRecommends
    expect(recommends.length).to.equal(filteredRecommends.length)
    for (let i = 0; i < recommends.length; i += 1) {
      expect(recommends[ i ].text()).to.equal(filteredRecommends[ i ].title)
      expect(filteredRecommends[ i ].slug).to.not.equal('20171222game_hs0')
      expect(filteredRecommends[ i ].slug).to.not.equal('20171222game_hs1')
      expect(filteredRecommends[ i ].slug).to.not.equal(relatedsMock[ 0 ].slug)
      expect(filteredRecommends[ i ].slug).to.not.equal(relatedsMock[ 1 ].slug)
    }
  })
})