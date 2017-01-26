<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<style lang="stylus">

html
  box-sizing border-box

*, *:before, *:after
  box-sizing inherit;

body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  background-color #f5f5f5
  margin 0
  color #34495e
  overflow-y scroll

a
  color #34495e
  text-decoration none

.view
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

@media (max-width 1199px)
  .mobile-hide
    display none !important

@media (min-width 1200px)
  .mobile-only
    display none !important

</style>
