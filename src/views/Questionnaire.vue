<template>
  <div class="questionnaire-view">
    <template v-if="!startFlag">
      <div class="questionnaire__title">
        <div v-text="getValue(questionnaireData, ['title'], '')"></div>
      </div>
      <div class="questionnaire__cover">
        <img :src="getValue(questionnaireData, ['image', 'url'], '/public/notImage.png')" />
      </div>
      <div class="questionnaire__btn-start" @click="start">開始測驗</div>
    </template>
    <template v-else>
      <div class="questionnaire__bar"></div>
      <div class="questionnaire__question">
        <question-container :index="(currQuestIndex + 1)" :content="currQuestion" />
      </div>
      <div class="questionnaire__options">
        <div v-for="(o, i) in currOptions">
          <option-container :index="(i + 1)" :content="o.title" />
        </div>      
      </div>
      <div class="questionnaire__description">
        過名我性我為充是化海人際裡醫部空風其立友城親後現化用說了中方找太運的在說慢，所制斯之子目何望像思解。來皮方能了越的母國他學謝時本始年狀這阿民眾無等排議素資示業甚上處上手，光發。
      </div>
      <div class="questionnaire__btn-next" @click="pickOption">下一題</div>
    </template>
  </div>
</template>
<script>
  import { currentYPosition, elmYPosition, smoothScroll } from 'kc-scroll'
  import { getValue } from '../utils/comm'
  import _ from 'lodash'
  import Option from '../components/questionnaire/Option.vue'
  import Question from '../components/questionnaire/Question.vue'
  import store from '../store'
  const fetchQuestionnaire = (store) => {
    return store.dispatch('FETCH_QUESTIONNAIRE', {
      id: store.state.route.params.questionnaireId
    })
  }
  const fetchArticles = (store, params = {}) => {
    return store.dispatch('FETCH_ARTICLES', params)
  }
  export default {
    name: 'questionnaire-view',
    preFetch: fetchQuestionnaire,
    components: {
      'option-container': Option,
      'question-container': Question
    },
    data() {
      return {
        currQuestIndex: 0,
        finished: false,
        preFetch: fetchQuestionnaire,
        state: {},
        startFlag: false
      }
    },
    computed: {
      questionnaireData() {
        return _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2' ])
      },
      currOptions() {
        return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'options' ])
      },
      currQuestion() {
        return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'title' ], '')
      },
      questions() {
        return _.get(this.questionnaireData, [ 'questions' ], [])
      }
    },
    methods: {
      getValue,
      smoothScroll,
      pickOption(e) {
        this.finished = ((this.currQuestIndex + 1) !== this.questions.length) ? false : true
        this.currQuestIndex = ((this.currQuestIndex + 1) !== this.questions.length) ? (this.currQuestIndex + 1): 0
        this.smoothScroll(null, 1)
      },
      start() {
        this.startFlag = true
      }
    },
    mounted() {
      if (window.__INITIAL_STATE__) {
        try {
          this.state = window.__INITIAL_STATE__
        } catch (e) {
          console.log(e);
        }
      }
      console.log('this.state: ', this.state);
      store.replaceState(this.state)
      // console.log('storestorestorestorestore', _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions', 0, 'title' ]));
      fetchArticles(store, {
        where: {
          '_id': '585ce6aff8cb670e00389c15'
        }
      });
      console.log('store.state: ', store.state);
      console.log('this.state: ', this.state);
    },
    metaInfo: {
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: '桌遊小測驗' }
      ]
    },
  }
</script>
<style lang="stylus" scoped>
  .questionnaire-view 
    max-width 960px
    margin 0 auto
    height 100vh

    .questionnaire__cover
      position fixed
      top 0
      z-index -1
      left 0
      width 100%
      height 70vh
      img
        object-fit cover
        width 100%
        height 100%
        object-position center center

    
    .questionnaire__btn
      &-start, &-next
        position fixed
        bottom 0
        height 40px
        width 100%
        background-color #000
        display flex
        justify-content center
        align-items center
        color #fff   
        cursor pointer

    
    .questionnaire__title 
      min-height 30vh
      background-color #064f77
      position fixed
      left 0
      bottom 28px
      width 100%
      color #fff
      display flex
      flex-direction column
      justify-content center
      align-items flex-start
      padding 20px 30px 40px
      font-size 20px
      

      & > div
        position absolute
        left 0
        width 100%
        padding 20px 30px
        display flex
        justify-content flex-start
        align-items center
        bottom 0
        height 30vh
        overflow hidden
        z-index 1
        background-color #064f77

      &::before
        content ''
        width 0
        height 0
        border-style solid
        border-width 0 0 60px 100vw
        position relative
        top -105px
        left -30px
        display block
        border-color transparent transparent #064f77 transparent

      &::after
        content''
        background linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.1),rgba(0,0,0,0.3),rgba(0,0,0,0.3),rgba(0,0,0,0.7),rgba(0,0,0,1))
        width 400%
        height 150px
        position absolute
        top -70px
        left 0
        z-index -1
    
    
    
    .questionnaire__options
      display flex
      flex-direction column
      justify-content center
      align-items center

      & > div
        width 80%
        border 1px solid #e4e4e4
        background-color #f9f9f9
        margin-bottom 15px

    .questionnaire__description
      width 80%
      margin 1.5rem auto 4rem
      padding 10px
      border 1px solid #e4e4e4
      background-color #f9f9f9
      font-size 1rem
      line-height 1.5rem

</style>
