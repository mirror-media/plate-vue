import { mount } from 'avoriaz'
import RecommendList from 'src/components/article/RecommendList.vue'
import Vue from 'vue'

describe('RecommendList.vue', () => {
  it('RecommendList should render container .recommend-main-container', () => {
    const Constructor = Vue.extend(RecommendList)
    const RecommendListComponent = new Constructor().$mount()
    expect(RecommendListComponent.$el.className).to.contain('recommend-main-container')
  })
  it('RecommendList should render div .recommend-list if leng of recommendList is more than 0', () => {
    // arrange
    // mock component
    const mockRouterLink = {
      name: 'router-link',
      render: h => h('div')
    }

    Vue.component('router-link', mockRouterLink)
    const RecommendListComponent = mount(RecommendList)

    // act
    RecommendListComponent.setProps({
      recommendList: [
        {
          'title': '【球星再傳腥】陽岱鋼拒再借錢　陽耀勳回應被網友酸爆',
          'url': 'https://api.mirrormedia.mg/posts/5a0d206f1a53670d0048c2ec'
        }
      ]
    })
    const recommendList = RecommendListComponent.find('.recommend-list')[0]

    // assert
    expect(recommendList).to.not.be.undefined
  })
  it('RecommendList should not render div .recommend-list if leng of recommendList is 0', () => {
    // arrange
    // mock component
    const mockRouterLink = {
      name: 'router-link',
      render: h => h('div')
    }

    Vue.component('router-link', mockRouterLink)
    const RecommendListComponent = mount(RecommendList)

    // act
    const recommendList = RecommendListComponent.find('.recommend-list')[0]

    // assert
    expect(recommendList).to.be.undefined
  })
  it('RecpmmendLost is not supposed to render more than 9 items', () => {
    // arrange
    // mock component
    const mockRouterLink = {
      name: 'router-link',
      render: h => h('div')
    }
    Vue.component('router-link', mockRouterLink)
    const RecommendListComponent = mount(RecommendList)

    // act
    const recommendLostData = []
    for (let i = 0; i < 20; i += 1) { recommendLostData.push({ title: `title-${i}`, url: `href-${i}` }) }
    RecommendListComponent.setProps({
      recommendList: recommendLostData
    })
    const recommendListChildren = RecommendListComponent.find('.recommend-list_item')

    // assert
    expect(recommendListChildren.length).to.be.below(10)
  })
})
