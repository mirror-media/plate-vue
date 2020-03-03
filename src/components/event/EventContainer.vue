<template>
  <EventPresentational
    v-if="eventIsOngoing && showEvent"
    :event-iframe-html="eventIframeHtml"
    :event-type="eventType"
    :has-zoom-in="hasZoomIn"
    @close="close"
    @toggleZoomIn="toggleZoomIn"
  />
</template>
<script>
import { get } from 'lodash'
import { sendGaClickEvent } from 'src/util/comm'
import Cookie from 'vue-cookie'
import EventPresentational from 'src/components/event/EventPresentational.vue'
import moment from 'moment'

export default {
  name: 'EventContainer',
  components: {
    EventPresentational
  },
  props: {
    eventData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      hasZoomIn: false,
      showEvent: true
    }
  },
  computed: {
    cookieKey () {
      return `mm-${this.eventType}`
    },
    eventIframeHtml () {
      return get(this.eventData, 'embed')
    },
    eventType () {
      return get(this.eventData, 'eventType')
    },
    eventIsOngoing () {
      const now = moment()
      const eventStartTime = moment(new Date(get(this.eventData, 'startDate')))
      let eventEndTime = moment(new Date(get(this.eventData, 'endDate')))
      if (eventEndTime && (eventEndTime < eventStartTime)) {
        eventEndTime = moment(new Date(get(this.eventData, 'endDate'))).add(12, 'h')
      }
      return (eventStartTime && eventEndTime && (now >= eventStartTime) && (now <= eventEndTime))
    }
  },
  mounted () {
    const cookie = Cookie.get(this.cookieKey)
    this.showEvent = !cookie
  },
  methods: {
    close () {
      Cookie.set(this.cookieKey, 'true', { expires: '10m' })
      sendGaClickEvent('home', `${this.eventType} close`)
      this.showEvent = false
    },
    toggleZoomIn () {
      this.hasZoomIn = !this.hasZoomIn
      this.hasZoomIn ? sendGaClickEvent('home', `${this.eventType} open`) : sendGaClickEvent('home', `${this.eventType} close`)
    }
  }
}
</script>
