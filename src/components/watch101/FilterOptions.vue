<template>
  <div class="option-list" :class="className">
    <div class="option-list--item" v-for="(opt, ind) in options()" v-text="opt.name" @click="select(ind)" :class="isSelectedClass[ ind ]"></div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {
    FILTER_OPTIONS_CORE,
    FILTER_OPTIONS_GENDER,
    FILTER_OPTIONS_MATERIAL,
    FILTER_OPTIONS_PRICE
   } from '../../constants/watch101.js'

  export default {
    computed: {
      className () {
        return {
          price: this.isTypePrice
        }
      }
    },
    data () {
      return {
        isSelectedClass: FILTER_OPTIONS_PRICE.map((opt) => ({ name: opt.namem, id: opt.id, active: false })),
        isTypePrice: false
      }
    },
    name: 'option-list',
    methods: {
      options () {
        let opts
        switch (this.filter) {
          case 'brand':
            opts = this.$store.state.watchBrands
            break
          case 'core':
            opts = FILTER_OPTIONS_CORE
            break
          case 'function':
            opts = this.$store.state.watchFunctions
            break
          case 'gender':
            opts = FILTER_OPTIONS_GENDER
            break
          case 'material':
            opts = FILTER_OPTIONS_MATERIAL
            break
          case 'price':
            opts = FILTER_OPTIONS_PRICE
            break
          default:
            opts = FILTER_OPTIONS_PRICE
        }
        return opts
      },
      select (index) {
        if (!this.isMultible) {
          this.isSelectedClass.map((item) => {
            item.active = false
          })
        }
        this.isSelectedClass[ index ].active = true
        this.$emit('addFilter', { filter: this.filter, item: this.options()[ index ].name })
      },
      setUpSelectedStatus () {
        if (!this.isMultible) {
          const selectedOpt = _.get(_.filter(this.currFilters, { name: this.filter }), [ 0 ])
          this.isSelectedClass = this.options().map((opt) => {
            if (selectedOpt && selectedOpt.title === opt.name) {
              return { name: opt.name, id: opt.id, active: true }
            } else {
              return { name: opt.name, id: opt.id, active: false }
            }
          })
        } else {
          this.isSelectedClass = this.options().map((opt) => {
            const selectedOpt = _.get(_.filter(this.currFilters, { name: this.filter, title: opt.name }), [ 0 ])
            if (selectedOpt) {
              return { name: opt.name, id: opt.id, active: true }
            } else {
              return { name: opt.name, id: opt.id, active: false }
            }
          })
        }
      }
    },
    mounted () {},
    props: [ 'filter', 'currFilters', 'isMultible' ],
    watch: {
      filter: function () {
        this.setUpSelectedStatus()
        this.isTypePrice = this.filter === 'price'
      },
      currFilters: function () {
        this.setUpSelectedStatus()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .option-list
    color #fff
    display flex
    flex-wrap wrap
    &--item
      width 50%
      // padding 0 20px
      padding 10px 20px 0
      font-size 0.9rem
      word-break break-word
      line-height 1.1rem
      // margin 10px 0 0
      margin 0
      cursor pointer
      &:nth-child(1), &:nth-child(2)
        margin 20px 0 0
        padding 0 20px
      &:nth-child(odd)
        border-right 1px solid #fff
      &.active
        color #b3b3b3
  @media (min-width: 769px)
    .option-list
      &--item
        width auto
        // min-width 16%
        // max-width 16%
        margin 5px 0
        &:nth-child(1), &:nth-child(2)
          margin 5px 0
        &:nth-child(odd)
          border-right none
        display flex
        align-items center
        padding 0 20px
      &.price
        flex-wrap nowrap
        flex-direction column
</style>
