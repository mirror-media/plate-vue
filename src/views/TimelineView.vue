<template>
  <div class="timeline-view">
    <ul v-for="item in tweets" :id="item.id">
      <li>
        <a href="https://twitter.com/MirrorWatchTW/status/"><img v-if="item.heroImg" :src="item.heroImg"/></a>
        <div v-html="item.text"/>
      </li>
    </ul>
  </div>
</template>

<script>

function fetchData (url) {
  const superagent = require('superagent')

  let apiHost = '/api'

  return new Promise(resolve => {
    superagent
    .get(apiHost + url)
    .end((err, response) => {
      if (!err && response) {
        resolve(JSON.parse(response.text))
      } else {
        resolve('{\'error\':' + err + '}')
      }
    })
  })
}

import twitter from 'twitter-text'
import _ from 'lodash'

export default {
  name: 'timeline-view',
  data () {
    return {
      rep: ''
    }
  },
  computed: {
    tweets () {
      _.forEach(this.rep, (v,k)=>{
        this.rep[k].text = twitter.autoLink(v.text, {
          urlEntities: [
            _.get(v, ['entities', 'urls'], {})
          ],
          targetBlank: true
        })
        this.rep[k].heroImg = _.get(v, [ 'extended_entities', 'media', 0, 'media_url_https' ]);
      })
      return this.rep
    }
  },
  metaInfo () {
    const title = 'timeline ' + this.$route.params.title
    return {
      title,
      meta: [{ vmid: 'description', name: 'description', content: title }]
    }
  },
  // preFetch () {
  beforeMount () {
    fetchData('/twitter?screen_name=MirrorWatchTW&count=10').then(
      response => {
        this.rep = response
        console.log('Success!', response) //eslint-disable-line
      },
      error => {
        console.error('Failed!', error) //eslint-disable-line
      }
    )
  }
}
</script>

<style lang="stylus">
.timeline-view
  background-color #fff
  box-sizing border-box
  padding 2em 3em
  h1
    margin 0
    font-size 1.5em
  .meta
    list-style-type none
    padding 0
  .label
    display inline-block
    min-width 4em
  .about
    margin 1em 0
  .links a
    text-decoration underline
  img 
    max-width: 300px
</style>
