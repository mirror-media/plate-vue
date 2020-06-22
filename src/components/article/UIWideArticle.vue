<template>
  <article class="wide-article">
    <template v-for="item in content">
      <h2
        v-if="item.type === 'header-one' && get(item, 'content.0')"
        :id="`header-${item.id}`"
        :key="item.id"
        v-html="item.content[0]"
      />
      <h3
        v-if="item.type === 'header-two'"
        :key="item.id"
        v-html="item.content[0]"
      />
      <p
        v-if="item.type === 'unstyled'"
        :key="item.id"
        v-html="item.content[0]"
      />
      <figure
        v-if="item.type === 'image'"
        :key="item.id"
      >
        <img
          v-lazy="processImageData(item).url"
          :alt="processImageData(item).description"
        >
        <figcaption v-text="processImageData(item).description" />
      </figure>
      <UIWideAnnotation
        v-if="item.type === 'annotation'"
        :key="item.id"
        :item="item"
      />
    </template>
  </article>
</template>

<script>
import { get } from 'lodash'
import UIWideAnnotation from './UIWideAnnotation.vue'

export default {
  name: 'UIWideArticle',
  components: {
    UIWideAnnotation
  },
  props: {
    content: {
      type: Array,
      required: true
    }
  },
  methods: {
    get,
    processImageData (image) {
      return {
        description: get(image, 'content.0.description'),
        url: get(image, 'content.0.tablet.url')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.wide-article {
  width: 300px;
  margin: 0 auto;
  padding: 50px 0 40px;
  border-top: solid 1px #979797;
  @media (min-width: 768px) {
    width: 700px;
    padding: 0 0 62px;
    border-top: none;
  }
  @media (min-width: 1024px) {
    width: 700px;
    padding: 73px 0 62px;
    border-top: none;
  }
  > * {
    width: 266px;
    margin-left: auto;
    margin-right: auto;
    @media (min-width: 768px) {
      width: 634px;
    }
    & + * {
      margin-top: 30px;
    }
    & + p {
      margin-top: 40px;
    }
  }
  h2, h3 {
    font-weight: 900;
    font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
    line-height: 1.5;
  }
  h2 {
    font-size: 28px;
     @media (min-width: 1024px) {
      font-size: 30px;
    }
  }
  h3 {
    font-size: 18px;
    & + .article__lightbox {
      margin-top: 40px;
    }
  }
  p {
    text-align: justify;
    & + p {
      margin-top: 2em;
    }
    & + .article__lightbox {
      margin-top: 40px;
    }
    &.figcaption {
      padding-top: 10px;
      color: rgba(0, 0, 0, 0.66);
      font-size: 13px;
      line-height: 1.5;
      letter-spacing: 1px;
      border-top: solid 1px #979797;
    }
  }

  >>> a {
    color: rgba(199, 159, 101, 0.87);
    text-decoration: underline;
  }

  figure {
    width: 100%;
    img {
      width: 100%;
      min-height: 100px;
      font-size: 13px;
      border-radius: 4px;
    }
    figcaption {
      width: 266px;
      margin: 12px auto 0;
      padding-top: 10px;
      color: rgba(0,0,0,.66);
      font-size: 13px;
      line-height: 1.5;
      letter-spacing: 1px;
      border-top: 1px solid #979797;
      @media (min-width: 768px) {
        width: 634px;
      }
      @media (min-width: 1024px) {
        margin-top: 16px;
      }
    }
  }
}
</style>
