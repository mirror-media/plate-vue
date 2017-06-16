<template >
  <div class="articleListBlock">
    <template v-if="articleType === 'projects'">
      <figure class="articleListBlock__figure">
        <a :href="`https://www.mirrormedia.mg${getHref(article)}`" :id="`latest-${getValue(article, [ 'slug' ])}-img`">
          <img v-lazy="getImage(article)" :alt="getValue(article, [ 'title' ])" />
        </a>
        <div class="articleListBlock__figure--colorBlock" :style="{ backgroundColor: sectionColor }" v-text="colorBlockTitle" />
      </figure>
      <div class="articleListBlock__content">
        <h2><a :href="`https://www.mirrormedia.mg${getHref(article)}`" :id="`latest-${getValue(article, [ 'slug' ])}-title`" v-text="getValue(article, [ 'title' ])" /></h2>
        <p><a :href="`https://www.mirrormedia.mg${getHref(article)}`" :id="`latest-${getValue(article, [ 'slug' ])}-descr`" v-text="getBrief(article, 45)" /></p>
      </div>
    </template>
    <template v-else-if="articleType === 'video'">
      <figure class="articleListBlock__figure">
        <a :href="`https://youtu.be/${getValue(article, [ 'snippet', 'resourceId', 'videoId' ])}`" :id="`latest-${getValue(article, [ 'snippet', 'resourceId', 'videoId' ])}-img`" target="_blank">
          <img v-lazy="getValue(article, [ 'snippet', 'thumbnails', 'high', 'url' ])" :alt="getValue(article, [ 'snippet', 'title' ])" />
        </a>
        <div class="articleListBlock__figure--colorBlock" :style="{ backgroundColor: sectionColor }">Video</div>
      </figure>
      <div class="articleListBlock__content">
        <h2><a :href="`https://youtu.be/${getValue(article, [ 'snippet', 'resourceId', 'videoId' ])}`" :id="`latest-${getValue(article, [ 'snippet', 'resourceId', 'videoId' ])}-title`" v-text="getValue(article, [ 'snippet', 'title' ])" target="_blank" /></h2>
        <p><a :href="`https://youtu.be/${getValue(article, [ 'snippet', 'resourceId', 'videoId' ])}`" :id="`latest-${getValue(article, [ 'snippet', 'resourceId', 'videoId' ])}-descr`" v-text="getTruncatedVal(getValue(article, [ 'snippet', 'description' ]), 45)" target="_blank" /></p>
      </div>
    </template>
    <template v-else>
      <figure class="articleListBlock__figure">
        <router-link :to="getHref(article)" :id="`latest-${getValue(article, [ 'slug' ])}-img`">
          <img v-lazy="getImage(article)" :alt="getValue(article, [ 'title' ])" />
        </router-link>
        <div class="articleListBlock__figure--colorBlock" :style="{ backgroundColor: sectionColor }" v-text="colorBlockTitle" />
      </figure>
      <div class="articleListBlock__content">
        <h2><router-link :to="getHref(article)" :id="`latest-${getValue(article, [ 'slug' ])}-title`" v-text="getValue(article, [ 'title' ])" /></h2>
        <p><router-link :to="getHref(article)" :id="`latest-${getValue(article, [ 'slug' ])}-descr`" v-text="getBrief(article, 45)" /></p>
      </div>
    </template>
  </div>
</template>

<script>

import { SECTION_MAP } from '../../constants'
import { getBrief, getHref, getImage, getTruncatedVal, getValue } from '../../util/comm'
import _ from 'lodash'

export default {
  props: [ 'initialArticle' ],
  computed: {
    article () {
      return this.initialArticle
    },
    articleType () {
      if (this.initialArticle.kind) {
        return 'video'
      }
      return _.get(this.initialArticle, [ 'style' ], 'article')
    },
    colorBlockTitle () {
      if (this.initialArticle.sections && _.get(this.initialArticle, [ 'sections', 'length' ], 0) > 0) {
        return _.get(this.initialArticle, [ 'sections', '0', 'title' ])
      } else {
        return _.get(this.initialArticle, [ 'categories', '0', 'title' ])
      }
    },
    sectionColor () {
      return _.get(SECTION_MAP, [ _.get(this.article, [ 'sections', '0', 'id' ]), 'bgcolor' ], '#bcbcbc')
    }
  },
  methods: {
    getBrief,
    getHref,
    getImage,
    getTruncatedVal,
    getValue
  }
}

</script>
<style lang="stylus" scoped>

.articleListBlock
  width 100%
  margin-bottom 40px
  background-color #fff
  box-shadow 5px 5px 5px #bcbcbc
  transition all .3s ease-in-out
  
  &__figure
    position relative
    width 100%
    padding-top 66.66%
    margin 0
    overflow hidden
    img
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      width 100%
      height 100%
      object-fit cover
      object-position 50% 50%
    &--colorBlock
      position absolute
      left 0
      bottom 0
      padding .5em
      color #fff
      letter-spacing 1px

  &__content
    padding 0 30px 15px
    text-align justify
    h2
      margin 0
      padding 0.5em 0
      font-size 1.3rem
      font-weight 300
      text-align justify
      line-height 1.3
    p
      margin 0
      font-size 1rem
      font-weight 300
      text-align justify
      line-height 1.5
      a
        color #999

@media (min-width: 600px)
  .articleListBlock
    width calc( (100% - 40px) / 2 )
    margin 0 10px 40px
    &:hover
      transform translateY(-20px)
      box-shadow 5px 15px 5px #bcbcbc
    &__content
      height auto
      h2
        min-height 78px

@media (min-width: 1200px)
  .articleListBlock
    width calc( (100% - 60px) / 3 )


</style>
