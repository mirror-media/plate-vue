<template>
  <div class="watch">
    <img
      class="watch__image"
      :src="imgSrc"
      alt="watch image"
    >
    <h1
      class="watch__name"
      v-text="name"
    />
    <h2
      class="watch__brand"
      v-text="brand"
    />
    <div
      v-if="showBottomWrapper"
      class="watch__bottom-wrapper bottom-wrapper"
    >
      <p
        class="bottom-wrapper__price"
      >
        {{ price | formatPrice }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    formatPrice (value) {
      return `NT$${value.toLocaleString()}`
    }
  },
  props: {
    imgSrc: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0,
      validator (value) {
        return value >= 0
      }
    }
  },
  computed: {
    showBottomWrapper () {
      return this.price > 0
    }
  }
}
</script>

<style lang="stylus" scoped>
.watch
  width 130px
  color rgba(0, 0, 0, 0.87)
  text-align center
  &__image
    width 100%
    height 194px
    object-fit contain
  &__name
    font-size 16px
    font-weight 600
    line-height 1.38
    margin 8px 0 0 0
  &__brand
    font-size 14px
    font-size normal
    line-height 1.38
    margin 8px 0 0 0
  &__bottom-wrapper
    margin 10px 0 0 0

.bottom-wrapper
  display flex
  flex-direction column
  align-items center
  &:before
    content ''
    display block
    width 40px
    height 1px
    background-color black
  &__price
    font-size 16px
    font-weight 600
    margin 10px 0 0 0

@media (min-width: 1200px)
  .watch
    width 200px
    &__image
      width 100%
      height 267px
    &__name
      font-size 18px
      line-height 1.44
    &__brand
      line-height 1.44
      margin 16px 0 0 0
    &__bottom-wrapper
      margin 16px 0 0 0

  .bottom-wrapper
    &:before
      width 30px
      height 2px
    &__price
      margin 16px 0 0 0
</style>