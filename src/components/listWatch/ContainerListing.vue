<template>
  <section class="section">
    <h1
      class="title"
      v-text="title"
    />
    <ol class="list">
      <li
        v-for="item in listItems"
        :key="getListItem(item)._id"
        class="list__list-item list-item"
      >
        <a
          class="list-item__link"
          :href="getWatchHref(item)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UIWatch
            :imgSrc="getListItem(item).imgSrc"
            :name="getListItem(item).name"
            :brand="getListItem(item).brand"
            :price="getListItem(item).price"
          />
        </a>
      </li>
    </ol>
  </section>
</template>

<script>
import UIWatch from './UIWatch.vue'
import _ from 'lodash'

export default {
  components: {
    UIWatch
  },
  computed: {
    title () {
      return _.get(this.$store.state, ['commonData', 'categories', 'watchsingle', 'title'], '')
    },
    listItems () {
      return this.$store.getters['watches/items']
    }
  },
  methods: {
    getListItem (listItem) {
      return {
        _id: _.get(listItem, '_id', ''),
        imgSrc: _.get(listItem, ['watchImage', 'image', 'resizedTargets', 'mobile', 'url'], ''),
        name: _.get(listItem, 'type', ''),
        brand: _.get(listItem, ['brand', 'name'], ''),
        price: parseInt(_.get(listItem, 'price', '0'))
      }
    },
    getWatchHref (listItem) {
      const slug = _.get(listItem, 'name', '')
      return `/watch/${slug}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.title
  font-size 26px
  font-weight 900
  color rgba(0, 0, 0, 0.87)
  padding 0 0 0 13px
  border-left 16px solid black
  height 68px
  display flex
  align-items center

.list
  list-style none
  padding 0
  width 100%
  display flex
  flex-wrap wrap
  justify-content space-around
  margin -2px 0 20px -12px
  &__list-item
    margin 22px 0 0 12px

.list-item
  &__link
    display block
    width max-content
    height max-content

@media (min-width: 768px)
  .section
    max-width 768px
    margin 0 auto

  .list
    margin 20px 0 72px -12px
    justify-content flex-start

  .list-item
    padding 0 24px

@media (min-width: 1200px)
  .section
    max-width 1024px
    margin 0 auto

  .title
    font-size 36px
    padding 0 0 0 22px
    border-left 24px solid black
    height 76px

  .list
    margin 20px 0 72px 0
    &__list-item
      display flex
      align-items center
      margin 52px 0 0 0
      &:not(:first-child):not(:nth-child(5n))
        &:before
          content ''
          display block
          width 2px
          height 274px
          background-color rgba(0, 0, 0, 0.1)
          margin 0 30px 0 0

  .list-item
    padding 0 30px 0 0
</style>