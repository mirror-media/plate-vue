<script>
import { get } from 'lodash'

export default {
  props: {
    audio: {
      type: Object,
      required: true
    }
  },
  computed: {
    sound () {
      return {
        title: get(this.audio, 'title', ''),
        src: get(this.audio, 'url', '')
      }
    }
  },
  render () {
    return this.$scopedSlots.default({
      sound: this.sound
    })
  }
}
</script>
