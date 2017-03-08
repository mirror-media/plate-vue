<template>
  <div class="questionnaire-view">
    <template v-if="!startFlag">
      <div class="questionnaire__title">
        <div v-text="getValue(questionnaireData, ['title'], '')"></div>
      </div>
      <div class="questionnaire__cover">
        <img :src="getValue(questionnaireData, ['image', 'url'], '/public/notImage.png')" />
      </div>
      <div class="questionnaire__btn-start">
        <div @click="start">開始測驗</div>
      </div>
    </template>
    <template v-else-if="!finished">
      <div class="questionnaire__bar"></div>
      <div class="questionnaire__question">
        <question-container :index="(currQuestIndex + 1)" :content="currQuestion" :total="questions.length" />
      </div>
      <div class="questionnaire__options" @click="updateState">
        <template v-for="(o, i) in currOptions">
          <option-container :index="(i + 1)" :content="o.title" :designatedOptId="getValue(questions, [ currQuestIndex, 'designated_option' ], 'a2')" 
                            :optId="getValue(o, [ 'id' ], '')" :gameType="`quiz`" :questId="getValue(questions, [ currQuestIndex, 'id' ], '')" 
                            :showCorrectAnsFlag="showCorrectAnsFlag" />
        </template>      
      </div>
      <div class="questionnaire__description" :class="descShow">
        過名我性我為充是化海人際裡醫部空風其立友城親後現化用說了中方找太運的在說慢，所制斯之子目何望像思解。來皮方能了越的母國他學謝時本始年狀這阿民眾無等排議素資示業甚上處上手，光發。
      </div>
      <div class="questionnaire__btn-next">
        <div v-text="btnNextText" @click="goNextQuestion"></div>
      </div>
    </template>
    <template v-else>
      <div class="questionnaire__title">
        <div>
          <div><h3>結果</h3></div>
          <div v-text="getValue(getQuestionnaireResult(), ['title'], '')"></div>
        </div>
      </div>
      <div class="questionnaire__cover">
        <img :src="getValue(getQuestionnaireResult(), ['image', 'url'], '/public/notImage.png')" />
      </div>
      <div class="questionnaire__btn-bar">
        <div class="play-again" @click="playAgain">再玩一次</div><div class="share">分享結果</div>
      </div>
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
        startFlag: false,
        descShowFlag: this.$store.state.showDesc,
        showCorrectAnsFlag: this.$store.state.showCorrectAns
      }
    },
    computed: {
      btnNextText() {
        return ((this.currQuestIndex + 1) !== this.questions.length) ? '下一題' : '看結果'
      },
      questionnaireData() {
        return _.get(this.$store.state, [ 'questionnaire', 'tasduiiuah32hk2' ])
      },
      currOptions() {
        return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'options' ])
      },
      currQuestion() {
        return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'title' ], '')
      },
      descShow() {
        return {
          show: this.descShowFlag
        }
      },
      questions() {
        return _.get(this.questionnaireData, [ 'questions' ], [])
      },
      results() {
        return _.get(this.questionnaireData, [ 'results' ], [])
      },
    },
    methods: {
      getValue,
      smoothScroll,
      updateState() {
        this.descShowFlag = this.$store.state.showDesc
        this.showCorrectAnsFlag = this.$store.state.showCorrectAns
      },
      goNextQuestion(e) {
        if(!this.descShowFlag || !this.showCorrectAnsFlag) { return }
        this.finished = ((this.currQuestIndex + 1) !== this.questions.length) ? false : true
        this.smoothScroll(null, 1)
        this.descShowFlag = false
        this.showCorrectAnsFlag = false
        this.currQuestIndex = ((this.currQuestIndex + 1) !== this.questions.length) ? (this.currQuestIndex + 1) : 0
      },
      playAgain() {
        this.currQuestIndex = 0
        this.descShowFlag = false
        this.finished = false
        this.showCorrectAnsFlag = false
        this.startFlag = false
        this.$store.state.answers = []
        this.$store.state.showCorrectAns = false
        this.$store.state.showDesc = false
        this.smoothScroll(null, 1)
      },
      getAnswerSlip() {
        return this.$store.state.answers
      },
      getQuestionnaireResult() {
        const answerSlip = this.getAnswerSlip()
        const score = _.chain(this.questions)
                        .map((itm, idx) => {
                          let { options } = itm
                          let s = _.find(options, { id: answerSlip[ idx ][ 'optId' ] })[ 'score' ]
                          return s
                        }).reduce((t, n) => (t + n)).value()
        const rs = _.chain(this.results)
                    .filter((itm) => {
                      return (score >= itm.range.from && score < itm.range.to)
                    }).first().value()
        return rs
      },
      start() {
        this.startFlag = true
      }
    },
    mounted() {
      this.$store.state.answers = []
    },
    metaInfo: {
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: '桌遊小測驗' }
      ]
    },
    updated() {
    },
    watch: {

    }
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
        & > div
          height 100%
          width 100%
          display flex
          justify-content center
          align-items center

      &-bar
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
        & > div
          flex 1
          height 100%
          display flex
          justify-content center
          align-items center

          &:not(:last-child)
            border-right 1px solid #d2d2d2
    
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
        justify-content center
        align-items flex-start
        bottom 0
        height 30vh
        overflow hidden
        z-index 1
        background-color #064f77
        flex-direction column
        
        div
          h3
            margin 0 0 1rem

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
        content ''
        background linear-gradient(170deg, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0.1), rgba(0,0,0,1), rgba(0,0,0,1), rgba(0,0,0,1))
        width 400%
        height 70vh
        position absolute
        top -65vh
        left 0
        z-index -1
    
    
    
    .questionnaire__options
      display flex
      flex-direction column
      justify-content center
      align-items center

      & > div
        width 80%
      
      .option__content
        flex 9

    .questionnaire__description
      width 80%
      margin 1.5rem auto 4rem
      padding 10px
      border 1px solid #e4e4e4
      background-color #f9f9f9
      font-size 1rem
      line-height 1.5rem
      display none

      &.show
        display block

</style>
