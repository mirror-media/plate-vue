<template>
  <div id="app" v-show="showPage">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        showPage: false
      }
    },
    mounted() {
      window.addEventListener('load', (e) => {
        this.showPage = true
      })
    }
  }
</script>
<style lang="stylus">
html
  box-sizing border-box
  font-size 16px

*, *:before, *:after
  box-sizing inherit;

body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  background-color #fff
  color #34495e
  overflow-y scroll

a
  color #34495e
  text-decoration none
  cursor pointer
  &.white
    &, &:hover, &:link, &:visited
      color #fff
  &.blue
    &, &:hover, &:link, &:visited
      color #0b4fa2

section.tweet 
  .content
    a, a:hover, a:link, a:visited
        color #0b4fa2

button
  cursor pointer

button:disabled
  cursor not-allowed

input:focus,
select:focus,
textarea:focus,
button:focus {
    outline: none
}

.container
  width 320px
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin 0 auto

.grid-1-fourth
  width 25%

.grid-2-fourth
  width 50%

.grid-1-fifth
  width 20%

.grid-2-fifth
  width 40%

.grid-3-fifth
  width 60%

.grid-4-fifth
  width 80%

.view
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

.dfp-test
  width 970px
  height 250px
  margin 20px auto 20px
  background-color #a8dadc

@media (min-width 600px)
  .container
    width 768px

@media (min-width 900px)
  .container
    width 768px

@media (max-width 1199px)
  .mobile-hide
    display none !important

@media (min-width 1200px)
  .mobile-only
    display none !important

  .container
    width 1024px

@media (min-width 1800px)
  .container
    width 1200px

</style>
