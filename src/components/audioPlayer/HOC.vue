<script>
import { get, intersection } from 'lodash'
import { CATEGORIES_HIDE_PLAYER } from './constants'

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
    },

    postCategories() {
      return get(this.post, 'categories', []).map(item => item.name)
    },
    isCategoriesShouldHidePlayer() {
      return intersection(this.postCategories, CATEGORIES_HIDE_PLAYER).length > 0
    },

    showPlayer () {
      return !this.isCategoriesShouldHidePlayer && this.hasVocals
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
      showPlayer: this.showPlayer
    })
  }
}
</script>
