<script>
import { get } from 'lodash'

export default {
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      defaultTitle: '全文朗讀',
      TTS_CONFIG: {
        TTS_BASEURL: 'https://www.mirrormedia.mg/assets/audios',
        TTS_DEFAULT_EXT: 'wav'
      }
    }
  },
  computed: {
    sound() {
      const title = this.defaultTitle
      const src = this.getSingleSoundSrc(this.post)

      return {
        title,
        src
      }
    },
    hasVocals() {
      return get(this.post, 'vocals', []).length > 0
    }
  },
  methods: {
    getSingleSoundSrc(post) {
      const { TTS_BASEURL, TTS_DEFAULT_EXT } = this.TTS_CONFIG
      const customAudio = get(post, [ 'audio', 'audio', 'url' ], '')
      const id = get(post, 'id', '')
      return customAudio !== ''
        ? customAudio
        : `${TTS_BASEURL}/${id}.${TTS_DEFAULT_EXT}`
    }
  },
  render() {
    return this.$scopedSlots.default({
      sound: this.sound,
      showPlayer: this.hasVocals
    })
  }
}
</script>
