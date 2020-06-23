<template>
  <section
    :class="{ active: openIndex }"
    class="wide-index"
  >
    <div
      class="wide-index__btn"
      @click="$emit('openIndex')"
    >
      <img
        v-lazy="`https://www.mirrormedia.mg/assets/mirrormedia/icon/hamburger.svg`"
        alt="開啟"
      >
    </div>
    <div class="wide-index__index">
      <div class="index-container">
        <button
          class="index__close"
          @click="$emit('closeIndex')"
        >
          <img
            v-lazy="`https://www.mirrormedia.mg/assets/mirrormedia/icon/close.svg`"
            alt="關閉"
          >
        </button>
        <div
          v-if="hasItems"
          class="index"
        >
          <ul>
            <li
              v-for="(item, index) in items"
              :key="item.id"
              :class="{ active: current === index + 1 }"
              @click="$emit('scrollTo', item.id)"
            >
              <span v-text="item.content" />
            </li>
          </ul>
        </div>
        <div
          v-show="isMounted"
          class="share"
        >
          <p>分享到：</p>
          <a
            :href="`https://www.facebook.com/share.php?u=${shareUrl}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              v-lazy="`https://www.mirrormedia.mg/assets/mirrormedia/icon/facebook.svg`"
              alt="分享到 facebook"
            >
          </a>
          <a
            :href="`https://line.me/R/msg/text/?${shareUrl}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              v-lazy="`https://www.mirrormedia.mg/assets/mirrormedia/icon/line.svg`"
              alt="分享到 line"
            >
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: 'UIWideIndex',
  props: {
    current: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    openIndex: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isMounted: false
    }
  },
  computed: {
    hasItems () {
      return this.items.length > 0
    },
    shareUrl () {
      return this.isMounted && location.href
    }
  },
  mounted () {
    this.isMounted = true
  }
}
</script>

<style lang="stylus" scoped>
.wide-index {
  @media (min-width: 1200px) {
    position: -webkit-sticky;
    position: sticky;
  }
  &.active {
    .wide-index__index {
      display: block;
    }
  }
  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 500;
    width: 44px;
    height: 44px;
    background-color: #191919;
    border-radius: 50%;
    cursor: pointer;
    @media (min-width: 1200px) {
      display: none;
    }
  }
  &__index  {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 510;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    @media (min-width: 1200px) {
      display: inline-block;
      top: 50%;
      left: calc((100% - 634px) / 4);
      right: auto;
      bottom: auto;
      transform: translate(-50%, -50%);
      background-color: transparent;
      width: auto;
      height: auto;
    }
    .index-container {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      top: 0;
      right: 0;
      width: auto;
      height: 100%;
      padding: 0 12px;
      background-color: #fff;
      @media (min-width: 1200px) {
        position: static;
        padding: 0;
        background-color: transparent;
      }
    }
  }
}

.index {
  display: inline-block;
  + * {
    margin-top: 48px;
  }
  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    background-color: #191919;
    border-radius: 50%;
    @media (min-width: 1200px) {
      display: none;
    }
  }
  ul {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    width: 190px;
    margin: 0;
    padding: 0;
    @media (min-width: 1200px) {
      width: 240px;
    }
    li {
      display: inline;
      font-size: 18px;
      font-weight: 900;
      font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
      cursor: pointer;
      &.active {
        span {
          border-bottom: solid 2px #dec5a2;
        }
      }
      & + li {
        margin-top: 19px;
      }
    }
  }
}

.share {
  display: flex;
  align-items: center;
  font-size: 15px;
  p + a {
    margin-left: 18px;
  }
  a + a {
    margin-left: 17px;
  }
  img {
    display: block;
  }
}

</style>
