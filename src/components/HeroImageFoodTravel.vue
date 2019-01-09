<template>
  <div class="heroimageFoodTravel">
    <div class="heroimage-container">
      <!--<img class="heroimage" src="/assets/mirrormedia/foodtravelheroimg.jpg" alt="">-->
      <img class="heroimage" :src="getValue(leadingImg, [ 'image', 'resizedTargets', 'desktop', 'url' ])" alt="">
    </div>
    <img class="section-title" :src="getSectionLogoUrl()" alt="">
  </div>
</template>

<script>
import { getValue } from '../util/comm'
import _ from 'lodash'

export default {
  computed: {
    leadingImg () {
      return _.get(this.commonData.sections.items.find((o) => o.name === 'foodtravel'), [ 'heroImage' ])
    },
    sectionLogo () {
      return _.get(_.find(_.get(this.commonData, [ 'sections', 'items' ]), { name: this.sectionName }), [ 'image' ], null)
    }
  },
  methods: {
    getValue,
    getSectionLogoUrl () {
      return _.get(this.sectionLogo, [ 'image', 'url' ]) ? _.get(this.sectionLogo, [ 'image', 'url' ]) : '/asset/logo.png'
    }
  },
  props: [ 'commonData', 'sectionName' ]
}
</script>

<style lang="stylus" scoped>
.heroimageFoodTravel
  position relative
  margin-top 50px
  .heroimage-container
    display flex
    align-items center
    overflow hidden
    .heroimage
      width 100%

  .section-title
    position absolute
    width 40%
    left 5%
    bottom 2%

@media (min-width: 1200px)
  .heroimageFoodTravel
    .heroimage-container
      .heroimage
        object-fit cover
        height calc(80vh - 75px)
    .section-title
      width 20%
      left 8.3%

</style>
