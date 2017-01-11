<template>
  <div class="section-view">
    <ul v-for="item in articles" :id="item.id">
      <li v-html="item.title"/>
    </ul>
  </div>
</template>

<script>

function fetchArticles (url) {
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

import _ from 'lodash'

export default {
  name: 'section-view',
  data () {
    return {
      rep: ''
    }
  },
  computed: {
    articles () {
      return this.rep
    }
  },
  metaInfo () {
    const title = 'section ' + this.$route.params.title
    return {
      title
    }
  },
  beforeMount () {
    ///meta?where=%7B%22sections%22%3A%7B%22%24in%22%3A%5B%22watch%22%5D%7D%7D&max_results=10&page=1&sort=-publishedDate&related=full
    fetchArticles('/meta?where={"sections":"57e1e0e5ee85930e00cad4e9"}&sort=-publishedDate').then(
      response => {
        this.rep = response._items
        console.log('Success!', response._items)
      },
      error => {
        console.error('Failed!', error)
      }
    )
  }
}
  
</script>
