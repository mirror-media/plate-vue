<template>
  <div
    ref="navBtn"
    @click="clickHandler"
  />
</template>
<script>
export default {
  name: 'NavBtn',
  props: ['clickHandlerEvt'],
  mounted () {
    Promise.all([this.stopNavBtnBehavior()])
  },
  methods: {
    clickHandler () {
      this.$emit(this.clickHandlerEvt)
    },
    stopNavBtnBehavior () {
      return new Promise((resolve) => {
        this.$refs.navBtn.ondragstart = function () { return false }
        this.$refs.navBtn.onselectstart = function () { return false }
        resolve()
      })
    }
  }
}
</script>
