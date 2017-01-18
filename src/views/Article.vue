<template>
  <div>
    <div id="fb-root"></div>
    <div id="mm_pc_ent_ap_970x250_HD" adunit="test_pc_np_ap_970x250_HD" dimensions="970x250"></div>
    <div><h2>{{ title }}</h2></div>
    <div id="test_pc_np_ap_300x250_E1" adunit="test_pc_np_ap_300x250_E1" dimensions="300x250"></div>
    <div id="test_pc_np_ap_300x250_E2" adunit="test_pc_np_ap_300x250_E2" dimensions="300x250"></div>
    <div>credit: {{ credit }}</div>
    <div v-html="content">
    </div>
    <div id="test_pc_np_ap_300x250_R1" adunit="test_pc_np_ap_300x250_R1" dimensions="300x250"></div>
    <div id="test_pc_np_ap_300x250_R2" adunit="test_pc_np_ap_300x250_R2" dimensions="300x250"></div>
    <div>相關新聞：</div>
    <div v-for="(o, i) in relateds">
      - <a href="">{{ o.title }}</a>
    </div>
    <div id="test_pc_np_ap_970x90_FT" adunit="test_pc_np_ap_970x90_FT" dimensions="970x90"></div>
    <div style="margin: 1.5em 0;">
      <div class="fb-comments" v-bind:data-href="articleUrl" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>
    </div>
  </div>
</template>
<script>
  import { DFP_UNIT_ID } from '../constants'
  import _ from 'lodash'
  import sanitizeHtml from 'sanitize-html'
  import store from '../store'
  import truncate from 'truncate'

  const fetchArticles = (store) => {
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        where: {
          '_id': store.state.route.params.id
        }
      }
    })
  }
  export default {
    name: 'article-view',
    preFetch: fetchArticles,
    compenents: {
      // 'vue-dfp': VueDfp(require('vue'), { dfpID: '421342134' })
      // 'qoption': Option
    },
    data() {
      return {
        state: {},
        dfpConst: {
          adUnitPath: '/421342134/test_pc_np_ap_970x250_HD',
          adSize: [ [ 970, 250 ] ],
          adElementId: 'test_pc_np_ap_970x250_HD'
        }
      }
    },
    computed: {
      articleUrl() {
        const { name } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return `https://www.mirrormedia.mg/story/${name}`
      },
      content() {
        const { brief, content : { apiData = [] }, tags, title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const paragraph = apiData.map((o) => {
          switch(o.type) {
            case 'unstyled':
              return '<p>' + o.content.toString() + '</p>'
            case 'slideshow':
              return o.content.map((i) => {
                return '<img src=\"' + i.url + '\"/><br>'
              }).join('')
            default:
              return
          }

        })
        return paragraph.join('<br>')
      },
      credit() {
        const { cameraMan, designers, engineers, photographers, writers } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        const credit = [ cameraMan, designers, engineers, photographers, writers ].map((o) => {
          const names = (o.length > 0) ? o.map((i) => (i.name)) : 0
          return (names.length > 0) ? names.join('、') : null
        })
        let creditStr = ''
        for(let i in credit) {
          if(credit[ i ]) {
            creditStr += ' ' + credit[ i ]
          }
        }
        return creditStr
      },
      relateds() {
        const { relateds } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return relateds
      },
      title() {
        const { title } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return title
      },
    },
    beforeMount() {
    },
    methods: {
      loadDfp(e) {
        window.googletag = window.googletag || {};
        window.googletag.cmd = window.googletag.cmd || [];
        window.googletag.defineSlot('/40175602/' + DFP_UNIT_ID[ 'PCE1' ][ 'aduid' ], [300, 250], '' + DFP_UNIT_ID[ 'PCE1' ][ 'aduid' ]).addService(window.googletag.pubads());
        window.googletag.defineSlot('/40175602/' + DFP_UNIT_ID[ 'PCE2' ][ 'aduid' ], [300, 250], '' + DFP_UNIT_ID[ 'PCE2' ][ 'aduid' ]).addService(window.googletag.pubads());
        window.googletag.defineSlot('/40175602/' + DFP_UNIT_ID[ 'PCR1' ][ 'aduid' ], [300, 250], '' + DFP_UNIT_ID[ 'PCR1' ][ 'aduid' ]).addService(window.googletag.pubads());
        window.googletag.defineSlot('/40175602/' + DFP_UNIT_ID[ 'PCR2' ][ 'aduid' ], [[300, 250], [300, 600]], '' + DFP_UNIT_ID[ 'PCR2' ][ 'aduid' ]).addService(window.googletag.pubads());
        window.googletag.defineSlot('/40175602/' + DFP_UNIT_ID[ 'PCHD' ][ 'aduid' ], [[970, 90], [970, 250]], '' + DFP_UNIT_ID[ 'PCHD' ][ 'aduid' ]).addService(window.googletag.pubads());
        window.googletag.defineSlot('/40175602/' + DFP_UNIT_ID[ 'PCFT' ][ 'aduid' ], [970, 90], '' + DFP_UNIT_ID[ 'PCFT' ][ 'aduid' ]).addService(window.googletag.pubads());
        window.googletag.pubads().enableSingleRequest();
        window.googletag.pubads().collapseEmptyDivs();
        window.googletag.enableServices();
        window.googletag.cmd.push(function() { window.googletag.display(DFP_UNIT_ID[ 'PCE1' ][ 'aduid' ]); });
        window.googletag.cmd.push(function() { window.googletag.display(DFP_UNIT_ID[ 'PCE2' ][ 'aduid' ]); });
        window.googletag.cmd.push(function() { window.googletag.display(DFP_UNIT_ID[ 'PCR1' ][ 'aduid' ]); });
        window.googletag.cmd.push(function() { window.googletag.display(DFP_UNIT_ID[ 'PCR2' ][ 'aduid' ]); });
        window.googletag.cmd.push(function() { window.googletag.display(DFP_UNIT_ID[ 'PCHD' ][ 'aduid' ]); });
        window.googletag.cmd.push(function() { window.googletag.display(DFP_UNIT_ID[ 'PCFT' ][ 'aduid' ]); });
      },
      initDfp(googletag) {
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
      }
    },
    mounted() {
      const { dfpId, fbAppId } = _.get(this.$store, [ 'state' ])
      const dfpScript = document.createElement('script')
      dfpScript.type = "text\/javascript";
      dfpScript.onerror = function(){
        console.log('err');
      };
      window.onload = (e) => {
        this.loadDfp(e)
      }
      document.querySelector('head').appendChild(dfpScript)
      dfpScript.src = 'https://www.googletagservices.com/tag/js/gpt.js'

      const fbSdkScript = document.createElement('script')
      fbSdkScript.innerHTML = '(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.8&appId=' + fbAppId + '\"; fjs.parentNode.insertBefore(js, fjs); }(document, \'script\', \'facebook-jssdk\'));'
      document.querySelector('body').insertBefore(fbSdkScript, document.querySelector('body').children[0])
    },
    metaInfo() {
      const { brief, categories, dfpId, fbAppId, fbPagesId, heroImage, id, ogDescription, ogImage, ogTitle, sections, tags, title, topics } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
      const categorieId = _.get(categories, [ 0, 'id' ], '')
      const imageUrl = _.get(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const ogImageUrl = _.get(ogImage, [ 'image', 'resizedTargets', 'mobile', 'url' ], '')
      const pureBrief = truncate(sanitizeHtml(_.get(brief, [ 'html' ], ''), { allowedTags: [ 'em' ] }), 200)
      const pureTags = tags.map((t) => (t.name))
      const sectionId = _.get(sections, [ 0, 'id' ], '')
      const topicId = _.get(topics, [ '_id' ], '')

      return {
        title: title,
        meta: [
          { name: 'keywords', content: '鏡週刊,鏡傳媒,mirror media,新聞,人物,調查報導,娛樂,美食,旅遊,精品,動漫,網路趨勢,趨勢,國際,兩岸,政治,明星,文學,劇本,新詩,散文,小說,' + pureTags.toString() },
          { name: 'description', content: pureBrief },
          { name: 'section-id', content: sectionId },
          { name: 'category-id', content: categorieId },
          { name: 'topic-id', content: topicId },
          { name: 'DFPIP', content: dfpId },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: (ogTitle.length > 0) ? ogTitle : title },
          { name: 'twitter:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { name: 'twitter:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
          { property: 'fb:app_id', content: fbAppId },
          { property: 'fb:pages', content: fbPagesId },
          { property: 'og:site_name', content: '鏡傳媒 Mirror Media' },
          { property: 'og:locale', content: 'zh_TW' },
          { property: 'og:type', content: 'article' },
          { property: 'og:title', content: (ogTitle.length > 0) ? ogTitle : title },
          { property: 'og:description', content: (ogDescription.length > 0) ? ogDescription : pureBrief },
          { property: 'og:url', content: '/posts/' + id },
          { property: 'og:image', content: (ogImageUrl.length > 0) ? ogImageUrl : ((imageUrl.length > 0) ? imageUrl : '/asset/logo.png') },
        ]
      }
    }
  }

</script>
<style lang="stylus" scoped>
</style>
