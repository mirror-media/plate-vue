<template>
  <div class="questionnaire-view">
    <template v-if="!startFlag">
      <div class="questionnaire__cover">
        <img :src="questionnaireImg" />
      </div>
      <div class="questionnaire__title">
        <div v-text="questionnaireTitle"></div>
      </div>
      <div class="questionnaire__btn-start">
        <div @click="start">開始測驗</div>
      </div>
    </template>
    <template v-else-if="!finished">
      <div class="questionnaire__bar"></div>
      <div class="questionnaire__question">
        <question-container :index="(currQuestIndex + 1)" :content="currQuestion" :total="questions.length" :leadingData="currQuestionLeadingData" :leadingType="questionLeadingType" />
      </div>
      <div class="questionnaire__options" >
        <template v-for="(o, i) in currOptions">
          <option-container :index="(i + 1)" :content="o.title" :designatedOptId="designatedOption" 
                            :optId="getValue(o, [ 'id' ], '')" :gameType="gameType" :questId="getValue(questions, [ currQuestIndex, 'id' ], '')" 
                            :showCorrectAnsFlag="showCorrectAnsFlag" @optPick="updateState" :lockPickFlag="lockPickFlag" />
        </template>      
      </div>
      <div class="questionnaire__description" :class="descShow" v-text="currQuestionExplanation"></div>
      <div class="questionnaire__btn-next">
        <div v-text="btnNextText" @click="goNextQuestion"></div>
      </div>
    </template>
    <template v-else>
      <div class="questionnaire__cover">
        <img :src="getValue(currResult, ['image', 'url'], '/public/notImage.png')" />
      </div>
      <div class="questionnaire__title">
        <div>
          <div><h3>結果</h3></div>
          <div v-text="getValue(currResult, ['title'], '')"></div>
        </div>
      </div>
      <div class="questionnaire__btn-bar">
        <div class="play-again" @click="playAgain">再玩一次</div><div class="share" @click="openShareTools">分享結果</div>
      </div>
    </template>
    <aside class="desktop-only">
      <aside-tab :index="(currQuestIndex + 1)" :total="questions.length" :title="getValue(questionnaireData, ['title'], '')" />
    </aside>
    <div class="share-toolbox" :class="shareToolboxClass">
      <share-toolbox @closeShareTools="closeShareTools" :questionnaireId="questionnaireId" :result="currResult" />
    </div>
  </div>
</template>
<script>
  import { FB_APP_ID, FB_PAGE_ID, SITE_KEYWORDS, SITE_TITLE, SITE_URL } from '../constants'
  import { smoothScroll } from 'kc-scroll'
  import { getValue, unLockJS } from '../util/comm'
  import _ from 'lodash'
  import AsideTab from '../components/questionnaire/AsideTab.vue'
  import Option from '../components/questionnaire/Option.vue'
  import Question from '../components/questionnaire/Question.vue'
  import ShareToolbox from '../components/questionnaire/ShareToolbox.vue'
  import titleMetaMixin from '../util/mixinTitleMeta'

  const fetchQuestionnaire = (store) => {
    return store.dispatch('FETCH_QUESTIONNAIRE', {
      id: store.state.route.params.questionnaireId
    })
  }

  export default {
    components: {
      'aside-tab': AsideTab,
      'option-container': Option,
      'question-container': Question,
      'share-toolbox': ShareToolbox
    },
    data () {
      return {
        answerSlip: {},
        currQuestIndex: 0,
        currResult: {},
        descShowFlag: this.$store.state.showDesc,
        finished: false,
        lockPickFlag: false,
        preFetch: fetchQuestionnaire,
        questionnaireId: this.$store.state.route.params.questionnaireId,
        resultId: this.$store.state.route.params.resultId,
        selectedOpt: '',
        shareToolboxFlag: false,
        startFlag: false,
        showCorrectAnsFlag: this.$store.state.showCorrectAns
      }
    },
    computed: {
      btnNextText () {
        return ((this.currQuestIndex + 1) !== this.questions.length) ? '下一題' : '看結果'
      },
      currOptions () {
        return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'options' ])
      },
      currQuestion () {
        return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'title' ], '')
      },
      currQuestionExplanation () {
        return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'explanation' ], '')
      },
      currQuestionLeadingData () {
        switch (this.questionLeadingType) {
          case 'audio':
            return _.get(this.questionnaireData, [ 'questions', this.currQuestIndex, 'audio' ], '')
          default:
            return
        }
      },
      descShow () {
        return {
          show: (this.currQuestionExplanation.length > 0 && this.descShowFlag)
        }
      },
      designatedOption () {
        return (this.gameType !== 'mind') ? _.get(this.questions, [ this.currQuestIndex, 'designated_option' ], '') : this.selectedOpt
      },
      gameType () {
        return _.get(this.questionnaireData, [ 'type' ], 'mind')
      },
      questionnaireData () {
        return _.get(this.$store.state, [ 'questionnaire', this.questionnaireId ])
      },
      questionnaireDesc () {
        return _.get(this.questionnaireData, [ 'subtitle' ], '來玩玩看鏡傳媒小測驗吧')
      },
      questionnaireImg () {
        return _.get(this.questionnaireData, [ 'image', 'url' ], '/public/notImage.png')
      },
      questionnaireTitle () {
        return _.get(this.questionnaireData, [ 'title' ], '鏡傳媒小測驗')
      },
      questions () {
        return _.get(this.questionnaireData, [ 'questions' ], [])
      },
      questionLeadingType () {
        return _.get(this.questionnaireData, [ 'leading' ], 'none')
      },
      results () {
        return _.get(this.questionnaireData, [ 'results' ], [])
      },
      shareToolboxClass () {
        return {
          show: this.shareToolboxFlag
        }
      }
    },
    methods: {
      checkIfLockJS () {
        unLockJS()
      },
      closeShareTools () {
        this.shareToolboxFlag = false
      },
      getValue,
      smoothScroll,
      updateState ({ showDesc, showCorrectAns, answer }) {
        this.descShowFlag = showDesc
        if (this.gameType !== 'mind') {
          this.lockPickFlag = true
        } else {
          this.selectedOpt = answer.optId
        }
        this.showCorrectAnsFlag = showCorrectAns
        this.answerSlip[ answer.questId ] = answer
      },
      goNextQuestion (e) {
        if (((!this.descShowFlag || !this.showCorrectAnsFlag) && this.gameType !== 'mind') ||
          (this.gameType === 'mind' && !this.answerSlip[ this.questions[ this.currQuestIndex ][ 'id' ] ])) { return }

        this.currQuestIndex = (this.currQuestIndex !== this.questions.length) ? (this.currQuestIndex + 1) : 0
        this.descShowFlag = false
        this.finished = (this.currQuestIndex === this.questions.length)
        this.lockPickFlag = false
        this.smoothScroll(null, 1)
        this.showCorrectAnsFlag = false

        this.currResult = (this.finished) ? this.getQuestionnaireResult() : {}
      },
      openShareTools () {
        this.shareToolboxFlag = true
      },
      playAgain () {
        this.currQuestIndex = 0
        this.descShowFlag = false
        this.finished = false
        this.showCorrectAnsFlag = false
        this.startFlag = false
        this.answerSlip = {}
        this.smoothScroll(null, 1)
      },
      getAnswerSlip () {
        return this.answerSlip
      },
      getQuestionnaireResult () {
        const answerSlip = this.getAnswerSlip()
        const score = _.chain(this.questions)
                        .map((itm, idx) => {
                          const { id, options } = itm
                          const s = _.find(options, { id: answerSlip[ id ][ 'optId' ] })[ 'score' ]
                          return s
                        }).reduce((t, n) => (t + n)).value()
        const rs = _.chain(this.results)
                    .filter((itm) => {
                      return (score >= itm.range.from && score < itm.range.to)
                    }).first().value()
        return rs
      },
      start () {
        this.startFlag = true
      }
    },
    mounted () {
      this.checkIfLockJS()
    },
    name: 'questionnaire-view',
    asyncData ({ store }) {
      return fetchQuestionnaire(store)
    },
    mixins: [ titleMetaMixin ],
    metaSet () {
      if (!this.questionnaireData && process.env.VUE_ENV === 'server') {
        const e = new Error()
        e.massage = 'Page Not Found'
        e.code = '404'
        throw e
      }
      const _specificResult = _.find(this.results, { id: this.resultId })
      const _description = _.get(_specificResult, [ 'title' ], this.questionnaireDesc)
      const _image = _.get(_specificResult, [ 'image', 'url' ], this.questionnaireImg)
      const _title = this.questionnaireTitle
      return {
        title: this.questionnaireTitle + ` - ${SITE_TITLE}`,
        meta: `
          <meta name="keywords" content="${SITE_KEYWORDS}">
          <meta name="description" content="${_description}">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${_title + ' - ' + SITE_TITLE}">
          <meta name="twitter:description" content="${_description}">
          <meta name="twitter:image" content="${_image}">
          <meta property="fb:app_id" content="${FB_APP_ID}">
          <meta property="fb:pages" content="${FB_PAGE_ID}">
          <meta property="og:site_name" content="${SITE_TITLE}">
          <meta property="og:locale" content="zh_TW">
          <meta property="og:type" content="article">
          <meta property="og:title" content="${_title + ' - ' + SITE_TITLE}">
          <meta property="og:description" content="${_description}">
          <meta property="og:url" content="${SITE_URL + '/q/' + this.questionnaireId}">
          <meta property="og:image" content="${_image}">
        `
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .questionnaire-view 
    margin 0 auto
    height 100vh

    .questionnaire__cover
      position fixed
      top 0
      z-index -1
      left 0
      width 100%
      height 75vh
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
        z-index 10
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
        z-index 10
        & > div
          flex 1
          height 100%
          display flex
          justify-content center
          align-items center

          &:not(:last-child)
            border-right 1px solid #d2d2d2
    
    .questionnaire__title 
      position relative
      left 0
      top 75vh
      width 100%
      color #fff
      display flex
      flex-direction column
      justify-content center
      align-items flex-start
      font-size 20px
      margin-top -60px
      

      & > div
        position relative
        left 0
        width 100%
        padding 20px 30px 60px
        display flex
        justify-content center
        align-items flex-start
        bottom 0
        z-index 2
        background-color #064f77
        flex-direction column
        min-height 25vh
        top -1px
        
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
        left 0
        display block
        border-color transparent transparent #064f77 transparent
        z-index 2

      &::after
        content ''
        background linear-gradient(170deg, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.1), #000, #000, #000)
        background-size 400% 100%
        background-repeat no-repeat
        width 100%
        height 100vh
        position absolute
        left 0
        z-index 1
        bottom 0
    
    
    
    .questionnaire__options
      display flex
      flex-direction column
      justify-content center
      align-items center
      margin-top 20px

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

    .share-toolbox
      display none
      &.show
        display block

  @media (min-width 768px)
    .questionnaire-view
      .questionnaire__description
        font-size 1.4rem
        line-height 2rem

  @media (min-width 1200px)
    .questionnaire-view 
      width 93vw
      left 7vw
      margin 0

      .questionnaire__cover
        position relative
        padding 40px
        height 50vh
        text-align center
        z-index 1

        img 
          width 80%

      .questionnaire__title
        top auto
        padding 0 40px
        margin-top 0

        & > div
          background-color transparent
          color #000
          width 80%
          margin 0 auto
          padding 0
          align-items flex-start
          justify-content flex-start
          min-height auto

        &::before
          border-style none

        &::after
          width 0
          height 0

      .questionnaire__btn

        &-start
          position relative
          padding 0 40px
          background-color transparent
          color #007cbf
          cursor none
          margin-top 40px

          & > div
            width 80%
            justify-content flex-start
            font-size 1.2rem
            text-decoration underline
            cursor pointer

        &-next
          position relative
          padding 0 40px
          background-color transparent
          color #007cbf
          cursor none
          margin-top 40px
          
          & > div
            width 80%
            justify-content flex-end
            font-size 1.2rem
            text-decoration underline
            cursor pointer

        &-bar
          position relative
          padding 0 40px
          background-color transparent
          color #007cbf
          cursor none
          margin-top 40px
          display block
          margin 40px auto 60px
          width 80%

          & > div
            width 15%
            justify-content flex-start
            font-size 1.2rem
            text-decoration underline
            cursor pointer
            display inline-block

            &:not(:last-child)
              border none

      .questionnaire__question
        width 80%
        margin 0 auto

      .questionnaire__description
        margin-top 40px
        padding 25px

      .questionnaire__options
        z-index 1
        position relative

      aside
        width 7vw
        background-color #064f77
        position fixed
        top 0
        left 0
        height 100vh

        &::before
          content ''
          width 100%
          height 100%
          position absolute
          right -100%
          box-shadow 0 0 10px rgba(65, 65, 65, 0.76)
          z-index 99
      
      &::before
        content ''
        position absolute
        width 100%
        height 100%
        background-color #fff
        z-index 1

</style>
