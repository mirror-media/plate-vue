<template>
  <div ref="navBtn" @click="clickHandler"></div>
</template>
<script>
  export default {
    name: 'nav-btn',
    methods: {
      clickHandler () {
        this.$emit(this.clickHandlerEvt)
      },
      stopNavBtnBehavior () {
        return new Promise((resolve) => {
          this.$refs[ 'navBtn' ].ondragstart = function () { return false }
          this.$refs[ 'navBtn' ].onselectstart = function () { return false }
          resolve()
        })
      }
    },
    mounted () {
      Promise.all([ this.stopNavBtnBehavior() ])
    },
    props: [ 'clickHandlerEvt' ]
  }
</script>
