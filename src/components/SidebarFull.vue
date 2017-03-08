<template>
 <div class="sidebarFull" >
    <div class="sidebarFull-container" :class="{ open: openSide }">
      <div class="sidebarFull__close">
        <a class="sidebarFull__close--icon" @click="closeSideBar()">
          <img src="~public/icon/close.png">
        </a>
        <a class="sidebarFull__close--text" @click="closeSideBar()">CLOSE THE MENU</a>
      </div>
      <nav class="sidebarFull__menu">
        <a :href="'/section/' + section" class="sidebarFull__menu--main">主頁</a>
        <div class="sidebarFull__menu--horizDivider"></div>
        <a class="sidebarFull__menu--item" :href="item.href" v-for="item in menuItem" v-text="item.title"></a>
      </nav>
    </div>
    <div class="sidebarFull-curtain" @click="closeSideBar()" v-show="openSide"></div>
 </div>
</template>

<script>

import _ from 'lodash'

export default {
  name: 'sidebarFull',
  props: ['openSide', 'section', 'sections'],
  methods: {
    closeSideBar () {
      this.$emit('closeSideBar')
    },
  },
  computed: {
    menuItem () {
      return _.get( _.find( _.get(this.sections, ['items']), { 'name': this.section } ), ['categories'])
    }
  }
}
  
</script>
<style lang="stylus" scoped>

.sidebarFull
  &-container
    position fixed
    top 0
    z-index 530
    width 100%
    height 100%
    padding 20px 25px 0
    background-color #333
    transform translate3d(-100%,0,0)
    transition .5s ease
    &.open
      transform translate3d(0,0,0)
      transition .5s ease
  &-curtain
    position fixed
    top 0
    left 0
    z-index 520
    width 100%
    height 100%
    background-color rgba(0, 0, 0, .5)
  &__close
    display flex
    align-items center
    margin-bottom 46px
    a
      color #fff
    &--iconf
      font-size 0
    &--text
      margin-left 10px
      font-size 13px
  &__menu
    display flex
    flex-direction column
    align-items center
    &--main
      font-size 15px
      color #7e7e7e
      margin-bottom 20px
    &--horizDivider
      width 100%
      height 1px
      margin-bottom 28px
      background-color #fff
    &--item
      font-size 18px
      color #fff
      margin-bottom 48px

@media (min-width 1200px)
  .sidebarFull
    &-container
      width 365px
</style>