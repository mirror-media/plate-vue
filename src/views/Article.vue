<template>
  <vue-dfp-provider>
  <template scope="props" slot="dfpPos">
    <div id="fb-root"></div>
    <vue-dfp :is="props.vueDfp" id="PCHD" dimensions="970x90,970x250"></vue-dfp>
    <div><h2>{{ title }}</h2></div>
    <div v-if="heroImage">
      <img v-if="heroImage.image" class="heroimg" :src="getValue(heroImage, [ 'heroImage', 'image', 'resizedTargets', 'desktop', 'url' ])"
            :srcset="getValue(heroImage, [ 'image', 'resizedTargets', 'mobile', 'url' ]) + ' 800w, ' +
                      getValue(heroImage, [ 'image', 'resizedTargets', 'tablet', 'url' ]) + ' 1200w, ' +
                      getValue(heroImage, [ 'image', 'resizedTargets', 'desktop', 'url' ]) + ' 2000w'"/>
      <div class="heroimg-caption"></div>
    </div>
    <vue-dfp :is="props.vueDfp" id="PCE1" dimensions="300x250"></vue-dfp>
    <vue-dfp :is="props.vueDfp" id="PCE2" dimensions="300x250"></vue-dfp>
    <div>credit: {{ credit }}</div>
    <div v-html="content">
    </div>
    <vue-dfp :is="props.vueDfp" id="PCR1" dimensions="300x250"></vue-dfp>
    <vue-dfp :is="props.vueDfp" id="PCR2" dimensions="300x250,300x600"></vue-dfp>
    <vue-dfp :is="props.vueDfp" id="PCAR" dimensions="640x360"></vue-dfp>
    <div>相關文章：</div>
    <div v-for="(o, i) in relateds">
      <div><a href="">{{ o.title }}</a></div>
      <div><a href=""><img :src="getValue(o, [ 'heroImage', 'image', 'url' ])" style="width: 100%;"/></a></div>
    </div>
    <br>

    <vue-dfp :is="props.vueDfp" id="PCFT" dimensions="970x90"></vue-dfp>
    <div>熱門文章：</div>
    <div>
      <div v-for="(o, i) in popularlist">
        <div><a href="">{{ o.title }}</a></div>
        <div><a href=""><img :src="getValue(o, [ 'heroImage', 'image', 'url' ])" style="width: 100%;"/></a></div>
      </div>
    </div>
    <div style="margin: 1.5em 0;">
      <div class="fb-comments" v-bind:data-href="articleUrl" data-numposts="5" data-width="100%" data-order-by="reverse_time"></div>
    </div>
  </template>
  </vue-dfp-provider>
</template>
<script>
  import { DFP_UNITS } from '../constants'
  import _ from 'lodash'
  import sanitizeHtml from 'sanitize-html'
  import store from '../store'
  import truncate from 'truncate'
  import VueDfpProvider from '../tools/plate-vue-dfp/PlateDfpProvider.vue'


  const fetchArticles = (store) => {
    return store.dispatch('FETCH_ARTICLES', {
      params: {
        where: {
          '_id': store.state.route.params.id
        }
      }
    }).then(() => {
      return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
    })
  }
  const fetchPop = (store) => {
    return store.dispatch('FETCH_ARTICLES_POP_LIST', {})
  }

  export default {
    name: 'article-view',
    preFetch: fetchArticles,
    components: {
      'vue-dfp-provider': VueDfpProvider
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
            case 'image':
              return `<img src=${_.get(o.content, [ 0, 'url' ], '')}
                        srcset=\"${_.get(o.content, [ 0, 'mobile', 'url' ], '')} 800w, ${_.get(o.content, [ 0, 'tablet', 'url' ], '')} 1200w, ${_.get(o.content, [ 0, 'desktop', 'url' ], '')} 2000w\"
                      />`
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
      heroImage() {
        const { heroImage } = _.get(this.$store, [ 'state', 'articles', 'items', 0 ])
        return heroImage
      },
      heroVideo() {},
      popularlist() {
        const { report } = _.get(this.$store, [ 'state', 'articlesPopList' ])
        return report
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
      getPopList() {
        console.log('got pop...');
      },
      getValue(o = {}, p = []) {
        return _.get(o, p, '');
      },
    },
    mounted() {
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
