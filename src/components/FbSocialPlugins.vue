<template>
  <div class="fb-social-plugins">
    <div
      class="fb-page"
      data-href="https://www.facebook.com/mirrormediamg"
      data-tabs="timeline"
      data-small-header="false"
      data-adapt-container-width="true"
      data-hide-cover="false"
      data-show-facepile="false"
    >
      <blockquote
        cite="https://www.facebook.com/mirrormediamg"
        class="fb-xfbml-parse-ignore"
      >
        <a href="https://www.facebook.com/mirrormediamg">鏡週刊</a>
      </blockquote>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FbSocialPlugins'
}
</script>
<style lang="stylus" scoped>
.fb-social-plugins
  text-align center
  .fb-page
    display block !important
</style>
