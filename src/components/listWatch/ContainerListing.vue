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
  data () {
    return {
      title: '鐘錶列表'
    }
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
.list
  list-style none

.list-item
  &__link
    display block
    width max-content
    height max-content
</style>