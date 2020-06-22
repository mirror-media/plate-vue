<template>
  <div class="wide-relateds">
    <h2>延伸閱讀</h2>
    <div class="wide-relateds__items">
      <div
        v-for="item in items"
        :key="item.slug"
        class="related"
      >
        <a
          :href="`/story/${item.slug}`"
          class="related__image"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="getImageUrl(item)"
            :alt="item.title"
          >
        </a>
        <a
          :href="`/story/${item.slug}`"
          class="related__title"
          target="_blank"
          rel="noopener noreferrer"
          v-text="item.title"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'

export default {
  name: 'UIWideRelateds',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    getImageUrl (item) {
      return get(item, 'image.image.resizedTargets.mobile.url')
    }
  }
}
</script>

<style lang="stylus" scoped>
.wide-relateds {
  width: 300px;
  margin: 0 auto;
  padding-bottom: 63px;
  @media (min-width: 768px) {
    width: 700px;
  }
  h2 {
    width: 266px;
    margin-left: auto;
    margin-right: auto;
    color: rgba(0, 0, 0, 0.87);
    font-size: 28px;
    font-weight: 900;
    font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
    @media (min-width: 768px) {
      width: 634px;
    }
  }
  a {
    display: block;
  }
  &__items {
    margin-top: 40px;
    @media (min-width: 768px) {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
    }
  }
}

.related {
  display: flex;
  @media (min-width: 768px) {
    display: block;
    width: calc( (100% - 30px) / 3);
    margin: 20px 10px 0;
  }
  & + .related {
    margin-top: 20px;
  }
  &__image {
    position: relative;
    display: block;
    width: 116px;
    padding-top: calc(116px * 0.6666);
    @media (min-width: 768px) {
      width: 100%;
      padding-top: 66.66%;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
  &__title {
    flex: 1;
    margin-left: 10px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 15px;
    font-weight: 900;
    font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
    line-height: 1.73;
    @media (min-width: 768px) {
      margin: 10px 0 0;
    }
  }
}

</style>
