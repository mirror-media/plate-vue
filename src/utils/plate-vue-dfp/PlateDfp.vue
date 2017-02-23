<template>
  <div :class="`${className} ${extClass}`" :id="adunit" :adunit="adunit" :pos="pos"></div>
</template>
<script>
  import { DFP_UNITS } from '../../constants'
  export default {
    computed: {
      adunit() {
        return DFP_UNITS[ '57e1e0e5ee85930e00cad4e9' ][ this.pos ][ 'aduid' ]
      },
      className() {
        return DFP_UNITS[ '57e1e0e5ee85930e00cad4e9' ][ this.pos ][ 'cont-class' ].join(' ')
      },
    },
    name: 'ad-container',
    mounted() {
      // console.log('this.adunit', this.pos);
    },
    props: {
      pos: {
        default: ''
      },
      'extClass': {
        default: ''
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .ad-container {
    display: inline-block;
    margin-top: 20px;
    &.margin-top-30px {
      margin-top: 30px;
    }
    &.margin-top-0 {
      margin-top: 0;
    }
    &.center {
      display: flex;
      justify-content: center;
    }
  }
</style>
