<template>
  <div class="listing-wrapper">
    <div class="filter">
      <div class="filter--title">
        <div class="filter--title_left"><span v-text="filterWording[ 'FILTER_TITLE' ]"></span></div>
        <current-filter class="filter--title_right" :currFilters="filterSets" v-on:delFilter="delFilter" v-on:delFilterAll="delFilterAll"></current-filter>
      </div>
      <div class="filter--items">
        <div class="item gender" ref="gender" :class="isOpenedClass[ 'gender' ]" @click="openFilter('gender')"><span v-text="filterWording[ 'FILTER_GENDER' ]"></span></div>
        <div class="item price" ref="price" :class="isOpenedClass[ 'price' ]" @click="openFilter('price')"><span v-text="filterWording[ 'FILTER_PRICE' ]"></span></div>
        <div class="item brand" ref="brand" :class="isOpenedClass[ 'brand' ]" @click="openFilter('brand')"><span v-text="filterWording[ 'FILTER_BRAND' ]"></span></div>
        <div class="item core" ref="core" :class="isOpenedClass[ 'core' ]" @click="openFilter('core')"><span v-text="filterWording[ 'FILTER_CORE' ]"></span></div>
        <div class="item material" ref="material" :class="isOpenedClass[ 'material' ]" @click="openFilter('material')"><span v-text="filterWording[ 'FILTER_MATERIAL' ]"></span></div>
        <div class="item function" ref="function" :class="isOpenedClass[ 'function' ]" @click="openFilter('function')"><span v-text="filterWording[ 'FILTER_FUNCTION' ]"></span></div>
      </div>
      <div class="filter--options" :class="fillterOptsClass">
        <option-list :isMultible="isFilterMultible(filter)" :filter="filter" :currFilters="filterSets" v-on:addFilter="addFilter"></option-list>
      </div>
    </div>
    <div class="items">
      <watch-item v-for="(item, index) in filteredWatchList" :item="item" :key="`item-${index}`" v-on:openLightbox="openLightbox"></watch-item>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import FilterCurrItem from './FilterCurrItem.vue'
  import FilterOptions from './FilterOptions.vue'
  import WatchItem from './WatchItem.vue'
  import numeral from 'numeral'
  import { FILTER_WORDING, FILTER_MULTI, FILTER_OPTIONS_PRICE } from '../../constants/watch101.js'
  import { isDescendant } from '../../util/comm'
  
  export default {
    components: {
      'current-filter': FilterCurrItem,
      'option-list': FilterOptions,
      'watch-item': WatchItem
    },
    computed: {
      fillterOptsClass () {
        return {
          'active': this.filterOpened
        }
      },
      filteredWatchList () {
        let filteredList = this.watchList
        this.filterSets.map((filter) => {
          switch (filter.name) {
            case 'function':
              filteredList = _.filter(filteredList, (watch) => {
                return _.filter(_.get(watch, [ 'watchfunction' ], { watchfunction: [] }), { name: filter.title }).length > 0
              })
              break
            case 'gender':
              filteredList = _.filter(filteredList, { sex: filter.title })
              break
            case 'price':
              const priceRange = _.get(_.filter(FILTER_OPTIONS_PRICE, { name: filter.title }), [ 0 ])
              if (priceRange) {
                filteredList = _.filter(filteredList, (watch) => {
                  const watchPrice = numeral(_.get(watch, [ 'price' ])).value()
                  if (watchPrice >= priceRange.from && (!priceRange.to || (watchPrice < priceRange.to))) {
                    return true
                  } else {
                    return false
                  }
                })
              }
              break
            case 'brand':
              filteredList = _.filter(filteredList, { brand: { name: filter.title }})
              break
            case 'core':
              filteredList = _.filter(filteredList, { movement: filter.title })
              break
            case 'material':
              filteredList = _.filter(filteredList, { material: filter.title })
              break
          }
        })
        return filteredList
      }
    },
    data () {
      return {
        filter: undefined,
        filterOpened: undefined,
        filterWording: FILTER_WORDING,
        filterSets: [],
        isOpenedClass: {
          'gender': { active: false },
          'price': { active: false },
          'brand': { active: false },
          'core': { active: false },
          'material': { active: false },
          'function': { active: false }
        }
      }
    },
    name: 'watch-list',
    methods: {
      addFilter (filterItem) {
        const oldFilterItem = _.get(_.filter(this.filterSets, { name: filterItem.filter }), [ 0 ])
        const isMultible = this.isFilterMultible(filterItem.filter)
        const isEverSelected = _.filter(this.filterSets, { name: filterItem.filter, title: filterItem.item }).length > 0

        if (!oldFilterItem || (!isEverSelected && isMultible)) {
          this.filterSets.push({ name: filterItem.filter, title: filterItem.item })
        } else if (!isMultible) {
          oldFilterItem.title = filterItem.item
        }
      },
      delFilter (filterItem) {
        this.filterSets = _.filter(this.filterSets, (item) => {
          return item.name !== filterItem.name || item.title !== filterItem.title
        })
      },
      delFilterAll () {
        this.filterSets = []
      },
      isFilterMultible (filter) {
        return _.filter(FILTER_MULTI, (item) => (item === filter)).length > 0
      },
      openFilter (item) {
        _.map(this.isOpenedClass, (object) => {
          object.active = false
        })
        this.filter = item
        this.isOpenedClass[ item ].active = true
        this.filterOpened = item
      },
      openLightbox (item) {
        this.$emit('openLightbox', item)
      },
      setupFullPageClickHandler () {
        return new Promise((resolve) => {
          window.addEventListener('click', (event) => {
            const targ = event.target
            const isDescendantFilterOpts = isDescendant(targ, { classname: 'filter--options' })
            const isDescendantFilterItems = isDescendant(targ, { classname: 'filter--items' })
            if (!isDescendantFilterOpts && !isDescendantFilterItems) {
              this.filterOpened = false
              _.map(this.isOpenedClass, (object) => {
                object.active = false
              })
            }
          })
          resolve()
        })
      }
    },
    mounted () {
      Promise.all([
        this.setupFullPageClickHandler()
      ])
    },
    props: [ 'watchList', 'viewport' ],
    watch: {
      watchList: function () {}
    }
  }
</script>
<style lang="stylus" scoped>
  .listing-wrapper
    padding-bottom 40px
    .filter
      border-bottom 1px solid #000
      &--title
        padding 0 20px
        font-size 1.5rem
        margin 20px auto
        
        &_left, &_right
          vertical-align top
          width 49%
          display inline-block
      &--items
        display flex
        flex-wrap wrap
        .item
          width 50%
          border-top 1px solid #000
          padding 20px 0
          display flex
          justify-content center 
          cursor pointer
          &.active
            background-color rgba(0, 0, 0, 0.8)
            color #fff
            > span
              &::after
                border-color: #fff transparent transparent transparent
          &:nth-child(odd)
            border-right 1px solid #000
          > span
            position relative
            text-align center
            &::after
              content ''
              position absolute
              right -1.4rem
              top 0.2rem
              height 0.6rem
              border-style solid
              border-width 0.6rem 0.5rem 0 0.5rem
              border-color: #000 transparent transparent transparent
              // border
      &--options
        // min-height 100px
        background-color rgba(0, 0, 0, 0.8)
        display none
        padding-bottom 20px
        cursor pointer
        &.active
          display block
  @media (min-width: 769px)
    .listing-wrapper
      .filter
        &--title
          border-bottom 1px solid #000
          padding 0 0 25px
          font-weight bold
          margin 0 auto
          &_left
            width auto
            margin-right 15px
          &_right
            width 80%
        &--items
          .item
            width 16%
            border-top none
            padding 10px 0
            justify-content flex-start
            
            &.active
              color #000
              background-color #fff
              > span
                &::after
                  top 0.3rem
                  border-width 0.5rem 0.4rem 0.5rem 0.4rem
                  border-color: #000 transparent transparent transparent                  
            &:nth-child(odd)
              border-right none
            > span
              &::after
                top 0.15rem
                border-width 0.4rem 0.5rem 0.4rem 0.5rem
                border-color: transparent transparent transparent #000
        &--options
          padding 10px 0
</style>
