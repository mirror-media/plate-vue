<template>
  <div class="timeline-view">
  {{ rep }}
  </div>
</template>

<script>

// function fetchUser (store) {
//   return store.dispatch('FETCH_USER', {
//     id: store.state.route.params.id
//   })
// }
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

export default {
  name: 'timeline-view',
  data () {
    return {
      rep: ''
    }
  },
  // computed: {
  //   user () {
  //     return this.$store.state.users[this.$route.params.id]
  //   }
  // },
  metaInfo () {
    const title = this.$route.params.title
    return {
      title,
      meta: [{ vmid: 'description', name: 'description', content: title }]
    }
  },
  // preFetch: fetchUser,
  beforeMount () {
    // fetchUser(this.$store)
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
</style>
