<template>
  <section class="editorChoice container">
    <div class="grid grid-4-fifth">
      <div :id="'slide-' + index" class="editorChoice-image" v-for="(item, index) in editorChoice.items"
        :style="{ backgroundImage: 'url(' + item.heroImage.image.resizedTargets.mobile.url + ')' }">
      </div>
    </div>
    <div class="editorChoice-list grid grid-1-fifth">
      <a v-for="item in editorChoice.items" href="">
        <div class="editorChoice-list__item">
          <span v-text="item.title"></span>
        </div>
      </a>
    </div>
  </section>
</template>
<script>

import _ from 'lodash'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import truncate from 'truncate'

export default {
  name: 'editorChoice',
  data () {
    return {
    }
  },
  props: {
    editorChoice: this.editorChoice
  },
  computed: {
    
  },
  methods: {
    getSrcSet(img) {
      return `${img.resizedTargets.mobile.url} 600w, ${img.resizedTargets.tablet.url} 900w, ${img.resizedTargets.desktop.url} 1200w`
    }
  },
  beforeMount () {
    
  },
  mounted() {
  }
}

</script>
<style lang="stylus" scoped>

.editorChoice
  &.container
    height 500px
    margin-bottom 40px

  .grid
    position relative
    overflow hidden

  &-image
    position absolute
    width 100%
    height 100%
    background-position 50% 50%
    background-repeat no-repeat
    background-size cover

    & img
      width 100%
      height 100%

  &-list
    height 100%
    background-color #f6f6f6
    a:last-child
      div
        border-bottom none

    &__item
      display flex
      flex-direction: column
      justify-content: center
      height 20%
      padding 0 1em
      border-bottom 1px solid #ccc

</style>