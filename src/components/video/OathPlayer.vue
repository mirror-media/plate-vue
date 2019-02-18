<template>
  <div class="oath-player">
    <div class="vdb_player"></div>
  </div>
</template>
<script>

export default {
  naem: 'OathPlayer',
  props: {
    combinedId: {
      type: String,
      required: true
    },
    scriptSrc: {
      type: String,
      required: true
    }
  },
  watch: {
    combinedId (newValue, oldValue) {
      document.querySelector('.vdb_player').classList.remove(`vdb_${oldValue}`)
      this.embedScript()
    }
  },
  beforeMount () {
    this.embedScript()
  },
  methods: {
    embedScript () {
      const container = document.querySelector('.vdb_player')
      container.innerHTML = ''
      container.classList.add(`vdb_${this.combinedId}`)
      const script = document.createElement("script")
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', this.scriptSrc)
      container.appendChild(script)
    }
  }
}
</script>
<style lang="stylus" scoped>
.oath-player
  position relative
  padding-top 56.25%
  background-color #000
  .vdb_player
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    width 100%

</style>
