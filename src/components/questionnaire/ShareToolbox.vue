<template>
  <div class="share-toolbox-container">
    <div class="modal" @click="closeShareTools"></div>
    <div class="buttons">
      <i class="icon facebook" @click="shareFacebook"></i>
      <i class="icon line" @click="shareFacebook"></i>
      <i class="icon g-plus" @click="shareGooglePlus"></i>
    </div>
  </div>
</template>
<script>
  import { shareGooglePlus, shareLine, shareFacebook } from '../../util/comm'
  import _ from 'lodash'

  export default {
    computed: {
      resultId () {
        return _.get(this.result, [ 'id' ], '')
      },
      resultTitle () {
        return _.get(this.result, [ 'title' ], '')
      }
    },
    data () {
      return {}
    },
    methods: {
      closeShareTools () {
        this.$emit('closeShareTools')
      },
      shareGooglePlus () {
        shareGooglePlus({
          route: `q/${this.questionnaireId}/${this.resultId}`,
          shared: () => {
            this.$emit('closeShareTools')
          }
        })
      },
      shareLine () {
        shareLine({
          route: `q/${this.questionnaireId}/${this.resultId}`,
          title: document.querySelector('meta[property="og:title"]').getAttribute('content'),
          shared: () => {
            this.$emit('closeShareTools')
          }
        })
      },
      shareFacebook () {
        shareFacebook({
          route: `q/${this.questionnaireId}/${this.resultId}`,
          shared: () => {
            this.$emit('closeShareTools')
          }
        })
      }
    },
    name: 'share-toolbox',
    props: {
      questionnaireId: {
        default: () => { return '' }
      },
      result: {
        default: () => { return {} }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .share-toolbox-container
    .modal
      position fixed
      top 0
      left 0
      z-index 1010
      background-color rgba(0, 0, 0, 0.75)
      width 100%
      height 100%
    
    .buttons
      position fixed
      top 50vh
      left 50vw
      z-index 1011
      display flex
      margin-left -75px

      .icon
        height 50px
        width 50px
        display block
        background-repeat no-repeat
        background-size contain
        background-position center center
        border-radius 10px
        cursor pointer
        
        &:not(:last-child)
          margin-right 10px

        &.facebook
          background-image url(/public/icon/facebook_white.png)
          background-color #017eb9
          background-size 45%

          &:hover
            background-color #005780

        &.line
          background-image url(/public/icon/line_white.png)
          background-color #0cca00
          background-size 80%

          &:hover
            background-color #099200

        &.g-plus
          background-image url(/public/icon/google-plus.png)
          background-color #c00
          background-size 80%

          &:hover
            background-color #8a0000

</style>
