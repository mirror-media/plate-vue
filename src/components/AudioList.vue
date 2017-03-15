<template>
  <section class="audioList container">
    <div class="audioList-block" v-for="item in audios">
      <div class="audioList-block__time">
        
      </div>
      <div class="audioList-block__proress">
        
      </div>
      <div class="audioList-block__content">
        <div class="audioList-block__content--cover">
          
        </div>
        <div class="audioList-block__content--text">
          <h2 v-text="item.title"></h2>
        </div>
        <audio :ref="item.id" :id="item.id" :src="item.audio.url" ></audio>
      </div>
    </div>
  </section>
</template>

<script>

import { getBrief, getHref, getImage, getSection, getTruncatedVal } from '../utils/comm'
import _ from 'lodash'

export default {
  name: 'audioList',
  props: ['audios'],
  methods: {
    getDuration(itemID) {
      let el = _.get(this.$refs, [itemID, '0', 'duration'])
      // el.addEventListener('loadedmetadata', () => {
      //   return el.duration
      // })
      
    }
  },
  mounted() {
    // console.log( _.get(this.$refs, ['57f1c6b7a89ee20d00cc487f', '0']) )
    // this.$refs['57f1c6b7a89ee20d00cc487f'].addEventListener('loadedmetadata', () => {
    //   console.log(_.get(this.$refs, ['57f1c6b7a89ee20d00cc487f', '0', 'duration']))
    // })
    //console.log(this.$refs['57f1c6b7a89ee20d00cc487f'])
  }
  
}
  
</script>
<style lang="stylus" scoped>

.audioList
  &.container
    flex-direction row
    flex-wrap wrap
  &-block
    width calc( (100% - 40px)/2 )
    margin 0 10px

</style>