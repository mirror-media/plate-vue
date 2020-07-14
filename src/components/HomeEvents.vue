<template>
  <div class="home-events">
    <EventContainer
      v-if="embedded"
      :event-data="embedded"
    />
    <EventContainer
      v-if="mod"
      :event-data="mod"
    />
  </div>
</template>
<script>
import { get } from 'lodash'
import EventContainer from 'src/components/event/EventContainer.vue'

export default {
  name: 'HomeEvents',
  components: {
    EventContainer
  },
  computed: {
    embedded () {
      return get(this.$store, 'state.eventEmbedded.items.0')
    },
    mod () {
      return get(this.$store, 'state.eventMod.items.0')
    }
  }
}
</script>
<style lang="stylus" scoped>
.home-events
  position fixed
  bottom 10px
  right 10px
  z-index 999
  width calc(50% - 10px)
  > *
    & + *
      margin-top 10px

@media (min-width: 768px)
  .home-events
    width 33%

@media (min-width: 1024px)
  .home-events
    width 25%
</style>
