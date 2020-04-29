<template>
  <section class="section">
    <h1 v-text="title" />
    <ol class="list">
      <li class="list__list-item list-item">
        <a
          class="list-item__link"
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UIWatch
            :imgSrc="'https://storage.googleapis.com/mirrormedia-files/assets/images/20171129173717-e2fe0fe2e3a5ac9536a2e99ad8acb6d2-tablet.jpg'"
            :name="'Marine Équation Marchante 5887'"
            :brand="'BREGUET 寶璣'"
            :price="87878787"
          />
        </a>
      </li>
    </ol>
  </section>
</template>

<script>
import UIWatch from './UIWatch.vue'

export default {
  components: {
    UIWatch
  },
  data () {
    return {
      title: '鐘錶列表'
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