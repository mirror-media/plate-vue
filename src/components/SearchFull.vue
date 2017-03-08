<template>
 <div class="searchFull">
    <div class="searchFull-container">
      <input type="text" placeholder="Search">
      <a @click="closeSearchBar()">
        <img src="~public/icon/close.png">
      </a>
    </div>
    <div class="searchFull-curtain" @click="closeSearchBar()"></div>
  </div>
</template>

<script>

export default {
  name: 'searchFull',
  props: {
  },
  methods: {
    closeSearchBar () {
      this.$emit('closeSearchBar')
    },
  },
}
  
</script>
<style lang="stylus" scoped>

.searchFull
  &-container
    position fixed
    top 0
    left 0
    z-index 520
    display flex
    justify-content space-between
    align-items center
    width 100%
    height 55px
    padding 0 22px 0 30px
    background-color #dcdcdc
    > input
      flex-grow 1
      height 22px
      padding 0
      font-size 20px
      color #8c8c8c
      background-color transparent
      border none
      box-shadow none
    > a
      font-size 0
      
  &-curtain
    position fixed
    top 0
    left 0
    z-index 510
    width 100%
    height 100%
    background-color rgba(0, 0, 0, .5)

@media (min-width: 1200px)
  .searchFull
    &-container
      top 60px
      justify-content flex-end
      height 52px
      > input
        text-align right
      > a
        margin-left 50px
</style>