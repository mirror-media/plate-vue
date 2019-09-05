<template>
  <div class="media-farmer">
    <div
      id="herbsapi"
      hb-width="100"
      hb-height="auto"
      hb-icon="https://mediafarmers.org/api/images/icon_2.png"
    />
    <span>喜歡這篇文章嗎？<br>歡迎灌溉支持喔！</span>
  </div>
</template>
<script>
export default {
  name: 'MediaFarmer',
  mounted () {
    this.insertMediafarmersScript()
  },
  watch: {
    '$route.fullPath' () {
      this.updateMediafarmersScript()
    }
  },
  methods: {
    insertMediafarmersScript () {
      const mediafarmersScript = document.createElement('script')
      mediafarmersScript.setAttribute('id', 'mediafarmersJS')
      mediafarmersScript.setAttribute('src', 'https://mediafarmers.org/api/api.js')
      if (!document.getElementById('mediafarmersJS')) {
        document.querySelector('body').appendChild(mediafarmersScript)
      }
    },
    updateMediafarmersScript () {
      const mediafarmersScript = document.querySelector('#mediafarmersJS')
      document.querySelector('body').removeChild(mediafarmersScript)
      this.insertMediafarmersScript()
    },
  }
}
</script>
<style lang="stylus" scoped>
.media-farmer
  display flex
  justify-content center
  align-items center
  padding 15px 0
  border-top 1px solid rgba(2,2,2,0.5)
  border-bottom 1px solid rgba(2,2,2,0.5)
  #herbsapi
    font-size 0
  span
    margin-left 20px

@media (min-width 768px)
  .media-farmer
    justify-content flex-start
    span
      br
        display none
</style>