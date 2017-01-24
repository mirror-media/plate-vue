<template>
  <div class="ad-container" :id="adunit" :adunit="adunit" :dimensions="dimensions"></div>
</template>
<script>
  export default {
    name: 'ad-container',
    props: {
      adunit: '',
      dimensions: ''
    },
    mounted() {

    }
  }
</script>
<style lang="stylus" scoped>
</style>
