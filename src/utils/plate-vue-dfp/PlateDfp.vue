<template>
  <div :class="className" :id="adunit" :adunit="adunit" :pos="pos"></div>
</template>
<script>
  import { DFP_UNITS } from '../../constants'
  export default {
    computed: {
      adunit() {
        return DFP_UNITS[ this.pos ][ 'aduid' ]
      },
      className() {
        return DFP_UNITS[ this.pos ][ 'cont-class' ]
      },
    },
    name: 'ad-container',
    mounted() {
      // console.log('this.adunit', this.pos);
    },
    props: {
      pos: ''
    }
  }
</script>
<style lang="stylus" scoped>
  .ad-container {
    display: inline-block;
    margin-top: 20px;
    &.magin-top-30px {
      margin-top: 30px;
    }
    &.center {
      display: flex;
      justify-content: center;
    }
  }
</style>
