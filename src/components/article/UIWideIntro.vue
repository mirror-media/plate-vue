<template>
  <section class="wide-intro">
    <picture>
      <source
        :srcset="heroImageDesktop"
        media="(min-width: 768px)"
        type="image/jpeg"
      >
      <img
        :src="heroImageMobile"
        :alt="titleWithoutBreakLine"
        loading="lazy"
      >
    </picture>
    <div class="wide-intro__gradient" />
    <h1 v-html="article.title" />
    <div class="wide-intro__brief-credit">
      <div class="wide-intro__datetime-credit">
        <p>發布時間 / {{ article.publishedDate }}</p>
        <div class="wide-intro__credit">
          <span v-if="article.writers">
            記者 / {{ article.writers }}
          </span>
          <span v-if="article.photographers">
            攝影 / {{ article.photographers }}
          </span>
          <span v-if="article.cameraMan">
            影音 / {{ article.cameraMan }}
          </span>
          <span
            v-if="article.extendByline"
            v-text="article.extendByline"
          />
        </div>
      </div>
      <div class="wide-intro__brief" v-html="article.brief" />
    </div>
  </section>
</template>

<script>
import { get } from 'lodash'

export default {
  naem: 'UIWideIntro',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    heroImageDesktop () {
      return get(this.article, 'heroImage.desktop.url')
    },
    heroImageMobile () {
      return get(this.article, 'heroImage.mobile.url')
    },
    titleWithoutBreakLine () {
      return this.article.title.replace(/<br>/g, '')
    }
  }
}
</script>

<style lang="stylus" scoped>
.wide-intro {
  position: relative;
  padding: 94px calc((100% - 266px) / 2) 50px;
  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 700px;
    padding: 0 120px 0;
  }
  @media (min-width: 1024px) {
    min-height: 900px;
    padding: 0;
  }
  picture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    width: 100%;
    height: 80%;
    @media (min-width: 768px) {
      height: 100%;
    }
    @media (min-width: 1200px) {
      z-index: 0;
      object-position: 50% bottom;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% center;
    }
  }
  h1, .wide-intro__brief-credit {
    position: relative;
    z-index: 0;
    @media (min-width: 1024px) {
      left: 15%;
    }
  }
  h1 {
    width: 200px;
    font-size: 46px;
    font-weight: 900;
    font-family: source-han-serif-tc, Songti, 'Microsoft YaHei', serif;
    line-height: normal;
    @media (min-width: 768px) {
      width: 300px;
      >>> br {
        display: none;
      }
    }
    @media (min-width: 1024px) {
      width: auto;
      max-width: 634px;
      font-size: 66px;
      line-height: 1.27;
    }
  }
  >>> p {
    text-align: justify;
    @media (min-width: 1024px) {
      font-size: 18px;
    }
  }

  &__brief-credit {
    margin-top: 60px;
    @media (min-width: 768px) {
      max-width: 300px;
    }
    @media (min-width: 1024px) {
      display: flex;
      flex-direction: column;
      max-width: 500px;
      margin-top: 47px;
    }
    @media (min-width: 1200px) {
      max-width: 634px;
    }
  }

  &__datetime-credit {
    @media (min-width: 1024px) {
      order: 2;
      margin-top: 40px;
    }
    p, span {
      color: rgba(0, 0, 0, 0.66);
      font-size: 13px;
      line-height: 1.5;
    }
  }

  &__credit {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    span {
      margin: 0 2em 0 0;
    }
  }

  &__brief {
    margin-top: 40px;
    @media (min-width: 768px) {
      margin-top: 20px;
    }
    @media (min-width: 1024px) {
      order: 1;
      margin-top: 0;
    }
  }

  &__gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255,0) 0%, rgba(255, 255, 255,0) 35%, rgba(255, 255, 255,1) 80%);
    @media (min-width: 768px) {
      background: linear-gradient(to bottom, rgba(255, 255, 255,0) 0%, rgba(255, 255, 255,0) 35%, rgba(255, 255, 255,1) 95%);
    }
  }

}
</style>
