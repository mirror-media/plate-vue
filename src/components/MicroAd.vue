<template>
  <div :id="`compass-fit-${id}`"></div>
</template>
<script>
  import { insertMicroAd } from '../util/comm'
  export default {
    name: 'micro-ad',
    props: [ 'id', 'currEnv', 'currUrl' ],
    data () {
      return {
        microAdLoded: false
      }
    },
    methods: {
      runMicroAd () {
        this.microAdLoded = insertMicroAd({ adId: this.id, currEnv: this.currEnv, microAdLoded: this.microAdLoded })
        return true
      }
    },
    mounted () {
      this.runMicroAd()
    },
    watch: {
      currUrl: function () {
        this.microAdLoded = false
        this.microAdLoded = insertMicroAd({ adId: this.id, currEnv: this.currEnv, microAdLoded: this.microAdLoded })
      }
    }
  }
</script>
<style lang="stylus"></style>
