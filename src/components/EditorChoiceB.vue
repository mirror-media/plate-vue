<template>
  <section id="editorChoice" class="editorChoice">
    <h2>編輯精選</h2>
    <div class="editorChoice__flat">
      <router-link 
        v-if="editorChoice[0].style !== 'projects' && editorChoice[0].style !== 'campaign' && editorChoice[0].style !== 'readr'"
        class="editorChoice__flat--highlight-choice" 
        :id="'choices-' + editorChoice[0].name"
        :to="getHref(editorChoice[0])"
        :target="target">
        <figure v-lazy:background-image="getImage(editorChoice[0], 'desktop')">
          <figcaption>
            <p v-text="getTitle(editorChoice[0])"></p>
          </figcaption>
        </figure>
      </router-link>
      <a
        v-if="editorChoice[0].style === 'projects' || editorChoice[0].style === 'campaign' || editorChoice[0].style === 'readr'"
        class="editorChoice__flat--highlight-choice"
        :id="'choices-' + editorChoice[0].name"
        :href="getHrefFull(editorChoice[0])"
        :target="target">
        <figure v-lazy:background-image="getImage(editorChoice[0], 'desktop')">
          <figcaption>
            <p v-text="getTitle(editorChoice[0])"></p>
          </figcaption>
        </figure>
      </a>
      <ul class="editorChoice__flat--list-choice">
        <li v-for="(item, index) in editorChoice.slice(1)">
          <router-link 
            v-if="item.style !== 'projects' && item.style !== 'campaign' && item.style !== 'readr'"
            :to="getHref(item)" 
            :id="'choices-' + item.name" 
            :target="target"
            v-text="getTitle(item, 24)">
          </router-link>
          <a 
            v-if="item.style === 'projects' || item.style === 'campaign' || item.style === 'readr'"
            :href="getHrefFull(item)" 
            :id="'choices-' + item.name"
            :target="target"
            v-text="getTitle(item, 24)">
          </a>
        </li>
      </ul>
    </div>
    <div class="editorChoice--mobile">
      <div class="editorChoice__eyebrow"><h2>編輯精選</h2></div>
      <div v-for="(item, index) in editorChoice" :href="getHref(item)" class="editorChoice__block">
        <template>
          <router-link
            :to="getHref(item)"
            :id="'choices-' + item.name"
            class="editorChoice__block--img"
            v-if="item.style !== 'projects'"
            :target="target">
            <figure v-lazy:background-image="getImage(item, 'mobile')" :title="item.title"></figure>
            <div :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
          </router-link>
          <a
            :href="`https://www.mirrormedia.mg${getHref(item)}`"
            :id="'choices-' + item.name"
            class="editorChoice__block--img"
            v-if="item.style === 'projects'"
            :target="target">
            <figure v-lazy:background-image="getImage(item, 'mobile')" :title="item.title"></figure>
            <div :style="getSectionStyle(getValue(item, [ 'sections', 0 ], ''))" v-text="getValue(item, [ 'sections', 0, 'title' ], '')"></div>
          </a>
        </template>
        <div class="editorChoice__block--title" :class="getSection(item)">
          <template>
            <router-link
              :to="getHref(item)"
              :id="'choices-' + item.name"
              v-if="item.style !== 'projects' && item.style !== 'campaign' && item.style !== 'readr'"
              :target="target">
              <h2 v-text="getTitle(item, 24)"></h2>
            </router-link>
            <a
              :href="getHrefFull(item)"
              :id="'choices-' + item.name"
              v-if="item.style === 'projects' || item.style === 'campaign' || item.style === 'readr'"
              :target="target">
              <h2 v-text="getTitle(item, 24)"></h2>
            </a>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { SECTION_MAP } from '../constants'
import { getHref, getHrefFull, getImage, getSection, getTitle, getTruncatedVal, getValue } from '../util/comm'
import _ from 'lodash'

export default {
  name: 'editorChoiceB',
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
    getValue,
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
  > h2
    display none
  &__flat
    display none
  &--mobile
    display flex
    flex-direction column
    width 90%
    margin 0 auto
    > div:not(:last-child):not(:first-child)
      margin-bottom 20px
    .editorChoice__block--img
      position relative
      color #fff
      display block
      figure
        width 100%
        padding-top 66.66%
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
      > div
        position absolute
        height 35px
        background-color #000
        display flex 
        justify-content center
        align-items center 
        font-size 1.2rem       
        top auto
        bottom 0
        left 0
        white-space nowrap
        padding 0 20px !important
    .editorChoice__block--title
      padding 0.5em 0
      h2
        margin 0
        font-size 1.25rem
        line-height 1.6rem
        font-weight normal
    
  &__eyebrow
    width 100%
    margin-bottom 10px
    color #356d9c
    h2
      margin 0
      overflow hidden
      &::after
        content ""
        display inline-block
        height .5em
        vertical-align middle
        width 100%
        margin-right -100%
        margin-left 10px
        border-top 5px solid #356d9c

@media (min-width: 600px)
  .editorChoice
    &--mobile
      flex-direction row
      flex-wrap wrap
      justify-content space-between
      width 100%
      > div:nth-child(2)
        width 100%
      > div:not(:first-child):not(:nth-child(2))
        width calc( (100% - 30px)/2 )
      .editorChoice__block--title
        height 65px

@media (min-width: 1200px)
  .editorChoice
    display block
    position relative
    width 100%
    margin-bottom 15px
    > h2
      display block
      margin 0 0 10px
      color #356d9c
      font-size 1.3rem
      line-height 1.15
      font-weight 400
    &__flat
      height 340px
      border 1px solid #d3d3d3
      display flex
      &--highlight-choice
        width 65%
        height 339px
        figure
          height 339px
          margin 0
          background-repeat no-repeat
          background-size 100% 100%
          position relative
          figcaption
            position absolute
            bottom 0
            color white
            width 100%
            height 68px
            background-color rgba(0, 0, 0, 0.3)
            font-size 20px
            font-weight 600
            display flex
            align-items center
            padding 0 40px 0 40px
            p
              letter-spacing 1px
              text-align justify
      &--list-choice
        width 35%
        margin 0
        padding 20px 15px
        list-style none
        display flex
        flex-direction column
        li
          flex 1 1 auto
          display flex
          align-items center
          a
            font-size 16px
            color black
            text-align justify
            line-height 1.25
        li + li
          border-top 1px solid #d3d3d3
    &--mobile
      display none
</style>

