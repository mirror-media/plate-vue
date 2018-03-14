<template>
  <section id="editorChoice" class="editorChoice">
    <h2 v-text="$t('homepage.editor_choice')"></h2>
    <div class="editorChoice__container">
      <div class="editorChoice__left">
        <template v-for="post in editorChoiceLeft">
          <LinkTool :post="post" :target="target" :id="'choices-' + post.name" class="editorChoice__item">
            <div class="editorChoice__item__img" slot="content">
              <img :alt="get(post, 'title', '')" 
                :src="get(post, 'heroImage.image.resizedTargets.mobile.url', '')"
                :srcset="`${get(post, 'heroImage.image.resizedTargets.mobile.url', '')} 800w,
                            ${get(post, 'heroImage.image.resizedTargets.tablet.url', '')} 1200w,
                            ${get(post, 'heroImage.image.resizedTargets.desktop.url', '')} 2000w`">
            </div>
            <div class="editorChoice__item__content" slot="content">
              <span class="section" v-text="get(post, [ 'sections', 0, 'title' ], get(post, [ 'categories', 0, 'title' ]))"></span>
              <span class="title" v-text="get(post, 'title', '')"></span>
            </div>
          </LinkTool>
        </template>
      </div>
      <div class="editorChoice__right">
        <template v-for="post in editorChoiceRight">
          <LinkTool :post="post" :target="target" :id="'choices-' + post.name" class="editorChoice__item">
            <div class="editorChoice__item__img" slot="content">
              <img :alt="get(post, 'title', '')" 
                :src="get(post, 'heroImage.image.resizedTargets.mobile.url', '')"
                :srcset="`${get(post, 'heroImage.image.resizedTargets.mobile.url', '')} 800w,
                            ${get(post, 'heroImage.image.resizedTargets.tablet.url', '')} 1200w,
                            ${get(post, 'heroImage.image.resizedTargets.desktop.url', '')} 2000w`">
            </div>
            <div class="editorChoice__item__content" slot="content">
              <span class="section" v-text="get(post, [ 'sections', 0, 'title' ], get(post, [ 'categories', 0, 'title' ]))"></span>
              <span class="title" v-text="get(post, 'title', '')"></span>
            </div>
          </LinkTool>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import { SECTION_MAP } from '../constants'
import { getHref, getHrefFull, getImage, getSection, getTitle, getTruncatedVal } from '../util/comm'
import { get, slice, take } from 'lodash'
import LinkTool from './LinkTool.vue'

export default {
  name: 'EditorChoiceB',
  components: {
    LinkTool
  },
  computed: {
    editorChoiceLeft () {
      return take(this.editorChoice, 3)
    },
    editorChoiceRight () {
      return slice(this.editorChoice, 3, 5)
    }
  },
  props: {
    editorChoice: {
      default: () => { return this.editorChoice }
    },
    target: {
      default: () => ('_self')
    },
    viewport: {
      default: () => { return undefined }
    }
  },
  methods: {
    getHref,
    getHrefFull,
    getSrcSet (img) {
      return `${img.resizedTargets.mobile.url} 600w, ${img.resizedTargets.tablet.url} 900w, ${img.resizedTargets.desktop.url} 1200w`
    },
    getImage,
    getSection,
    getTitle,
    getTruncatedVal,
    get,
    getSectionStyle (sect) {
      const sectionId = _.get(sect, [ 'id' ])
      const style = {
        backgroundColor: _.get(SECTION_MAP, [ sectionId, 'bgcolor' ], '#bcbcbc')
      }
      return style
    },
    styleFor1stitem (sect) {
      return {
        borderLeft: SECTION_MAP[ sect ][ 'borderLeft' ]
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
.editorChoice
  margin-bottom 20px
  > h2
    display block
    margin 0 0 10px
    color #356d9c
    font-size 1.3rem
    line-height 1.15
    font-weight 400
  &__container
    display flex
  &__left
    margin-right 20px
    flex 1
  &__right
    flex 1
  &__item
    margin 20px 0
    display flex
    height 110px
    width 100%
    &__img
      width 40%
      > img
        width 100%
        height 100%
        object-fit cover
        object-position center center
    &__content
      width 60%
      font-size 1rem
      line-height 1.375rem
      padding-left 10px
      display flex
      flex-direction column
      justify-content center
      > span
        display block
      .section
        color #244765
        margin-bottom 3px
        border-bottom 1px solid #d8d8d8
        padding-bottom 5px
        font-weight 600
      .title
        color #797979
        text-shadow 0 0 5px #f3f3f3
        padding-top 5px
    

// @media (min-width: 600px)
//   .editorChoice
    

// @media (min-width: 1200px)
//   .editorChoice
    
</style>

