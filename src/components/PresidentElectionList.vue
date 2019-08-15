<template>
  <section class="candidates">
    <article v-for="cand in candidateData" :key="cand.tagId" class="candidate-card">
      <div class="candidate-card__wrapper">
        <div class="candidate-card__head">
          <div class="candidate-card__img" :style="{ backgroundImage: `url(${cand.img})`} "></div>
          <h2 :style="{ backgroundColor: cand.color }">{{cand.title}}</h2>
        </div>
        <div class="candidate-card__body">
          <template v-for="art in cand.articles">
            <a :href="`/story/${art.slug}`" target="_blank" :key="`a-${art.id}`">{{getArtTitle(art.title)}}</a>
            <hr :style="{ backgroundColor: cand.color }" :key="`hr-${art.id}`" />
          </template>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  name: 'PresidentElectionList',
  props: [ 'candidateData' ],
  data () {
    return {
      artTitleEl: null,
      artTitleW: 0,
      timer: null
    }
  },
  beforeMount () {
    this.artTitleEl = document.querySelector('.candidate-card__body')
    this.artTitleW = this.artTitleEl.clientWidth
    window.addEventListener('resize', this.alterArtTitleW)
  },
  destroyed () {
    window.removeEventListener('resize', this.alterArtTitleW)
  },
  methods: {
    alterArtTitleW () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.artTitleW = this.artTitleEl.clientWidth
      }, 300)
    },
    getArtTitle (title) {
      const titleFontSize = window.innerWidth >= 768 ? 18 : 15
      const titleFontNum = Math.floor(this.artTitleW / titleFontSize) * 2 - 3
      return title.length <= titleFontNum ? title : title.substr(0, titleFontNum).concat('⋯')
    }
  }
}
</script>

<style lang="stylus" scoped>
.candidates
  max-width 1920px
  display flex
  flex-wrap wrap
  padding 0 8px 16px 8px
  margin-left auto
  margin-right auto
.candidate-card
  flex 0 0 100%
  @media (min-width: 768px)
    flex-basis 50%
    padding-right 8px
    padding-left 8px
  @media (min-width: 992px)
    flex-basis 25%
  &__wrapper
    display: flex
    align-items center
    background-color #fff
    box-shadow 0 0 6px 0 rgba(0, 0, 0, 0.1);
    padding 15px
    @media (min-width: 768px)
      flex-wrap wrap
    & > div
      flex 1 1 50%
      @media (min-width: 768px)
        flex-basis 100%
  &__head
    margin-right 8px
    @media (min-width: 768px)
      margin-right 0
      margin-bottom 15px
  &__body
    height 180px
    margin-left 8px
    display flex
    flex-direction column
    justify-content space-between
    @media (min-width: 768px)
      margin-left 0
      height 260px
  &__img
    border-top-right-radius 8px
    border-top-left-radius 8px
    height 146px
    background-size cover
    background-position center
    background-repeat no-repeat
    @media (min-width: 992px)
      height 248px
  & + &
    margin-top 10px
    @media (min-width: 768px)
      margin-top 0
.candidate-card
  @media (min-width: 768px) and (max-width: 991.98px)
    &:nth-child(1), &:nth-child(2)
      margin-bottom 16px
h2
  height 34px
  display flex
  justify-content center
  align-items center
  margin 0
  border-bottom-right-radius 8px
  border-bottom-left-radius 8px
  font-size 15px
  font-weight 600
  color #fff
  text-shadow 0 0 1px rgba(0, 0, 0, 0.2)
  @media (min-width: 345px)
    font-size 17px
  @media (min-width: 768px)
    font-size 22px
    height 52px
a
  height 50px
  text-align justify
  display flex
  align-items center
  cursor pointer
  font-size 15px
  line-height 1.67
  color rgba(0, 0, 0, 0.9)
  @media (min-width: 768px)
    font-size 18px
    line-height 1.89
    height 62px
hr
  margin 0
  height 2px
  border 0
  border-radius 1px
</style>
