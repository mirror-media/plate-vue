<template>
  <UIWatchArticle :watch="watch" />
</template>
<script>
import UIWatchArticle from './UIWatchArticle.vue'
import _ from 'lodash'

export default {
  name: 'ContainerWatchArticle',
  components: {
    UIWatchArticle
  },
  computed: {
    watch () {
      const data = _.cloneDeep(_.get(this.$store.state, 'watches.watch'))
      data.price = Number.isNaN(data.price) ? data.price : Number.parseInt(data.price)
      data.brand = _.get(data, 'brand.name')
      data.content = _.get(data, 'content.html')
      data.watchImage = {
        desktop: _.get(data, 'watchImage.image.resizedTargets.desktop.url'),
        tablet: _.get(data, 'watchImage.image.resizedTargets.tablet.url'),
        mobile: _.get(data, 'watchImage.image.resizedTargets.mobile.url')
      }
      data.watchfunction = [...data.watchfunction].map(feature => feature.name)
      data.embedYoutube = data.youtube ? data.youtube.replace('watch?v=', 'embed/') : data.youtube
      return data
    }
  }
}
</script>
