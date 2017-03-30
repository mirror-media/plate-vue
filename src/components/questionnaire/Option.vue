<template>
  <div class="option-container" :class="optClass" @click="optPick" :optId="optId" :questId="questId">
    <div class="option">
      <div class="option__checkbox"><span><i></i></span></div>
      <div class="option__content">{{ content }}</div>
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      optClass () {
        return {
          correct: (this.status && this.correctFlag) || (this.showCorrectAnsFlag && this.optId === this.designatedOptId) || (this.gameType === 'mind' && this.correctFlag),
          wrong: this.status && this.wrongFlag
        }
      }
    },
    data () {
      return {
        correctFlag: false,
        status: false,
        showDesc: false,
        showCorrectAns: false,
        thisQuestId: this.questId,
        wrongFlag: false
      }
    },
    name: 'option-container',
    methods: {
      optPick () {
        if (!this.lockPickFlag && (!this.status || (this.status && this.gameType === 'mind'))) {
          if (this.gameType !== 'mind') {
            if (this.optId !== this.designatedOptId) {
              this.status = true
              this.correctFlag = false
              this.showCorrectAns = true
              this.showDesc = true
              this.wrongFlag = true
            } else {
              this.correctFlag = true
              this.showCorrectAns = true
              this.showDesc = true
              this.status = true
              this.wrongFlag = false
            }
          } else {
            this.correctFlag = true
          }
          this.$emit('optPick', { showDesc: this.showDesc, showCorrectAns: this.showCorrectAns, answer: { questId: this.questId, optId: this.optId }})
        }
      }
    },
    props: {
      content: {},
      designatedOptId: {
        default: () => { return 'o2' }
      },
      gameType: {
        default: () => { return 'quiz' }
      },
      index: {},
      lockPickFlag: {
        default: () => { return false }
      },
      optId: {
        default: () => { return '' }
      },
      questId: {
        default: () => { return '' }
      },
      showCorrectAnsFlag: {
        default: () => { return false }
      }
    },
    updated () {
      if (this.thisQuestId !== this.questId) {
        this.correctFlag = false
        this.status = false
        this.showDesc = false
        this.showCorrectAns = false
        this.thisQuestId = this.questId
        this.wrongFlag = false
      } else {
        if (this.optId !== this.designatedOptId && this.gameType === 'mind') {
          this.correctFlag = false
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .option-container
    display flex
    align-items center
    padding 10px
    font-size 1rem
    border 1px solid #e4e4e4
    background-color #f9f9f9
    margin-bottom 15px
    cursor pointer

    .option
      width 100%
      display flex
      align-items center

      .option__checkbox
        font-weight bold
        font-family Verdana
        margin-right 0.5rem

        & > span
          border 1px solid #d1d1d1
          height 20px
          width 20px
          display block
          border-radius 20%      
      
      .option__content
        flex 9

    &.wrong
      background-color #848484
      color #fff
      .option
        .option__checkbox
          span
            border 1px solid #fff
            i
              background-image url(/public/icon/small-no.png)
              background-repeat no-repeat
              background-size contain
              background-position center center
              width 100%
              height 100%
              display block
              position relative

    &.correct
      background-color #064f77
      color #fff
      .option
        .option__checkbox
          span
            border 1px solid #fff   
            i
              background-image url(/public/icon/small-yes.png)
              background-repeat no-repeat
              background-size contain
              background-position center center
              width 130%
              height 130%
              display block
              position relative
              left 2px
              top -5px
  
  @media (min-width 768px)
    .option-container
      font-size 1.4rem
</style>
