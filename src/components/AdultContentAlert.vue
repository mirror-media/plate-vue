<template>
 <div class="adultContentAlert" v-show="showAlert">
  <div class="adultContentAlertContainer">
    <h2>您即將進入之內容需滿十八歲方可瀏覽</h2>
	  <p>根據「電腦網路內容分級處理辦法」第六條第三款規定，本網站已於各限制級網頁依照台灣網站分級推廣基金會之規定標示。若您尚未年滿十八歲，請點選離開。若您已滿十八歲，亦不可將本區之內容派發、傳閱、出售、出租、交給或借予年齡未滿18歲的人士瀏覽，或將本網站內容向該人士出示、播放或放映。</p>
    <div class="adultContentAlert__button">
      <img src="/public/logo.svg" />
		  <button class="adultContentAlert__button--over" @click="closeAlert()">是，我已年滿十八歲</button>
		  <button class="adultContentAlert__button--less" @click="backToHome()">離開</button>
    </div>
  </div>
 </div>
</template>

<script>

export default {
  name: 'adultContentAlert',
  data () {
    return {
      showAlert: true
    }
  },
  methods: {
    backToHome () {
      this.$router.push('/')
    },
    closeAlert () {
      this.showAlert = false
    }
  }
}

</script>
<style lang="stylus" scoped>

.adultContentAlert
  display flex
  justify-content center
  align-items center
  position fixed
  top 0
  left 0
  z-index 500
  width 100%
  height 100vh
  background-color rgba(0,0,0,0.9)
  &__button
    text-align right
    position relative
    padding-top 5px
    img
      position absolute
      left -8px
      top -5px
      width 118px
    button
      padding 10px 18px
      cursor pointer
      font-size 13px
      text-align center
      border-radius 5px
    &--over
      color #fff
      background-color #1087a8
      border 1px solid #0c7194
      &:hover
        background-color #0e7ea0
    &--less
      margin-left 5px
      background-color #fff
      border 1px solid #c1c2c5
      &:hover
        background-color #f1f1f1;

.adultContentAlertContainer
  position relative
  max-width 34%
  min-width 430px
  padding 30px 40px
  background-color #fafafa
  border-radius 10px
  h2
    margin 0 0 20px 0
    padding-bottom 20px
    text-align center
    font-size 26px
    line-height 120%
    border-bottom 1px solid #d9d9d9
  p
    margin-bottom 25px
    font-size 16px
    line-height 150%
    color #333
    text-align justify
    text-justify distribute

@media only screen and (max-width : 450px)
  .adultContentAlertContainer
    width 95%
    min-width 0
    max-width none
    padding 30px 30px
  .adultContentAlert
    &__button
      text-align center
      img
        display none
</style>
