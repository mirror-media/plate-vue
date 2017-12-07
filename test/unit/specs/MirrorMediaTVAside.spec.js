import { mount } from 'avoriaz'
import MirrorMediaTVAside from 'src/components/MirrorMediaTVAside.vue'
import Vue from 'vue'

describe('MirrorMediaTVAside.vue', () => {
  it('MirrorMediaTVAside should render container .mmtv-aside', () => {
    const Constructor = Vue.extend(MirrorMediaTVAside)
    const MirrorMediaTVAsideComponent = new Constructor().$mount()
    expect(MirrorMediaTVAsideComponent.$el.className).to.contain('mmtv-aside')
  })
  it('MirrorMediaTVAside should render div .mmtv-aside--container containing a iframe', () => {
    // arrange

    const MirrorMediaTVAsideComponent = mount(MirrorMediaTVAside)

    // act
    const targString = '<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/crc0JH42Lwk\" frameborder=\"0\" allowfullscreen></iframe>'
    MirrorMediaTVAsideComponent.setProps({
      mediaData: {
        '_updated': 'Thu, 01 Jan 1970 00:00:00 GMT',
        'startDate': 'Mon, 04 Dec 2017 12:00:00 GMT',
        'endDate': 'Tue, 05 Dec 2017 11:59:59 GMT',
        'name': '20171204靖天直播',
        'isFeatured': true,
        'eventType': 'mod',
        'state': 'published',
        '_links': {
          'self': {
            'href': 'event/5a24f3ea0c5bc40f006d6944',
            'title': 'event'
          }
        },
        '_created': 'Thu, 01 Jan 1970 00:00:00 GMT',
        'embed': targString,
        '_id': '5a24f3ea0c5bc40f006d6944',
        'sections': []
      }
    })
    const mmTvContainer = MirrorMediaTVAsideComponent.find('.mmtv-aside--container')[0]

    // assert
    expect(mmTvContainer).to.not.be.undefined
    expect(mmTvContainer.html()).to.have.string('<iframe width="560" height="315" src="https://www.youtube.com/embed/crc0JH42Lwk" frameborder="0" allowfullscreen=""></iframe>')
  })
})
