<template>
  <section class="newsletter">
    <form ref="emailForm" v-on:submit.prevent="checkEmailValid">
      <input type="email" v-model="email" v-on:change="checkEmailValid" v-on:focus="focusEvent" v-on:focusout="focusoutEvent" v-on:input="cleanCheckInfo"  :disabled="emailInputDisabled" placeholder="請輸入您的 Email:" required>
      <label></label>
    </form>
    <div class="newsletterCategories">
      <div ref="peopleBlock" class="newsletterCategories__category">
        <input ref="people" type="checkbox" :disabled="checkboxDisabled" v-on:change="checkboxChanged('people')">
        <label>鏡人物</label>
        <p>《鏡週刊》人物組的鬥陣俱樂部：「一鏡到底」，「鏡相人間」，「心內話」三大單元，紙本未盡之處，這裡細說從頭。</p>
      </div>
      <div class="newsletterCategories__line"></div>
      <div ref="foodtravelBlock" class="newsletterCategories__category">
        <input ref="foodtravel" type="checkbox" :disabled="checkboxDisabled" v-on:change="checkboxChanged('foodtravel')">
        <label>鏡食旅</label>
        <p>《鏡週刊》美食旅遊團隊，堅持實地採訪紀錄，帶你發掘全世界好食好旅，偶爾還有好酒情報。</p>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import Cookie from 'vue-cookie'
import superagent from 'superagent'

function fetchNewsletter (url) {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    .end((err, response) => {
      if (!err && response) {
        return resolve(JSON.parse(response.text))
      } else {
        return reject(err)
      }
    })
  })
}

export default {
  name: 'newsletter',
  data () {
    return {
      canSubscribe: false,
      checkboxDisabled: false,
      email: '',
      emailInputDisabled: false,
      hostName: 'localhost:8080'
    }
  },
  methods: {
    checkEmailValid () {
      this.$refs.emailForm.classList.remove('vaild')
      this.$refs.emailForm.classList.remove('invaild')
      this.$refs.peopleBlock.classList.remove('subscribed')
      this.$refs.peopleBlock.classList.remove('cancel')
      this.$refs.foodtravelBlock.classList.remove('subscribed')
      this.$refs.foodtravelBlock.classList.remove('cancel')
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (re.test(this.email)) {
        this.$refs.emailForm.classList.add('vaild')
        const cookie = Cookie.get('mm-newsletter')
        if (!cookie) { // get user info from API
          fetchNewsletter(`${this.hostName}/api/newsletter/${this.email}`)
          .then(response => {
            let categories = ''
            if (response.result.length !== 0) {
              response.result.forEach((c) => {
                categories = categories + c.name + ','
              })
            }
            Cookie.set('mm-newsletter', `${response.user};${categories}`, { expires: '3M' })
            const cookie = Cookie.get('mm-newsletter')
            this.updateInfo(cookie)
          }, error => {
            if (error.status === 404) {
              this.canSubscribe = true
            } else {
              this.$refs.emailForm.classList.add('error')
              this.emailInputDisabled = true
              this.checkboxDisabled = true
            }
          })
        } else {
          const cookieEmail = _.split(cookie, ';')[0]
          if (this.email !== cookieEmail) {
            fetchNewsletter(`${this.hostName}/api/newsletter/${this.email}`)
            .then(response => {
              let categories = ''
              if (response.result.length !== 0) {
                response.result.forEach((c) => {
                  categories = categories + c.name + ','
                })
              }
              Cookie.set('mm-newsletter', `${response.user};${categories}`, { expires: '3M' })
              const cookie = Cookie.get('mm-newsletter')
              this.updateInfo(cookie)
            }, error => {
              if (error.status === 404) {
                this.$refs.people.checked = false
                this.$refs.foodtravel.checked = false
                this.canSubscribe = true
              } else {
                this.$refs.emailForm.classList.add('error')
                this.emailInputDisabled = true
                this.checkboxDisabled = true
              }
            })
          }
          if (this.email === cookieEmail) {
            this.updateInfo(cookie)
          }
        }
      } else {
        this.$refs.people.checked = false
        this.$refs.foodtravel.checked = false
        this.canSubscribe = false
        this.$refs.emailForm.classList.add('invaild')
      }
      return false
    },
    checkHostDomain () {
      if (process.env.VUE_ENV === 'client') {
        if (location.host.indexOf('localhost') === -1) {
          this.hostName = 'https://dev.mirrormedia.mg'
        } else {
          this.hostName = 'http://localhost:8080'
        }
      }
    },
    checkboxChanged (category) {
      if (this.email && this.canSubscribe) {
        superagent
        .post(`${this.hostName}/api/newsletter`)
        .send({ user: this.email, item: category })
        .end((err, response) => {
          if (!err && response) {
            const data = JSON.parse(response.text)
            let categories = ''
            if (data && data.item && data.item.length !== 0) {
              data.item.forEach((c) => {
                categories = categories + c.name + ','
              })
            }
            Cookie.set('mm-newsletter', `${this.email};${categories}`, { expires: '3M' })
            const cookie = Cookie.get('mm-newsletter')
            this.updateInfo(cookie)
            this.checkboxDisabled = true
            if (this.$refs[category].checked) {
              this.$refs[`${category}Block`].classList.remove('subscribed')
              this.$refs[`${category}Block`].classList.remove('cancel')
              this.$refs[`${category}Block`].classList.add('subscribed')
            } else {
              this.$refs[`${category}Block`].classList.remove('subscribed')
              this.$refs[`${category}Block`].classList.remove('cancel')
              this.$refs[`${category}Block`].classList.add('cancel')
            }
            setTimeout(() => { this.checkboxDisabled = false }, 2000)
          } else {
            this.checkboxDisabled = true
          }
        })
      } else {
        this.$refs.emailForm.classList.add('invaild')
        this.$refs[category].checked = false
      }
    },
    cleanCheckInfo () {
      this.$refs.emailForm.classList.remove('vaild')
      this.$refs.emailForm.classList.remove('invaild')
    },
    detectKeyboard () {
      document.activeElement.blur()
    },
    focusEvent () {
      window.addEventListener('touchstart', this.detectKeyboard)
    },
    focusoutEvent () {
      window.removeEventListener('touchstart', this.detectKeyboard)
      this.checkEmailValid()
    },
    updateInfo (cookie) {
      if (cookie) {
        const mail = _.split(cookie, ';')[0]
        const categories = _.split(_.split(cookie, ';')[1], ',')
        _.forEach(categories, (c) => {
          if (c) {
            this.$refs[c].checked = true
            this.$refs[`${c}Block`].classList.add('subscribed')
          }
        })
        this.email = mail
        this.canSubscribe = true
      }
    }
  },
  mounted () {
    const cookie = Cookie.get('mm-newsletter')
    this.checkHostDomain()
    this.updateInfo(cookie)
  }
}

</script>
<style lang="stylus" scoped>

.newsletter
  display flex
  flex-direction column
  justify-content center
  position relative
  min-height 70px
  margin-top calc(1em + 30px)
  padding 1em 1em
  border 1px solid #eaeaea
  border-top 20px solid #0c5a80
  background-color #fff
  box-shadow 0 0 14px rgba(146,146,146,0.52)
  &:before
    content '' 
    position absolute
    top -50px
    left 1em
    width 80px
    height 60px
    background-image url(/public/icon/newsletter.png)
    background-repeat no-repeat
    background-size contain
    background-position 50% 50%
  form
    order 2
    position relative
    width 100%
    margin-top 1em
    input
      width 100%
      padding-left 8px
      border-radius 2px
      &::-webkit-input-placeholder
        color #ccc
        font-size .9rem
        line-height 22px
      &::-moz-placeholder
        color #ccc
        font-size .9rem
      &:-ms-input-placeholder
        color #ccc
        font-size .9rem
      &:-moz-placeholder 
        color #ccc
        font-size .9rem
    &.invaild
      label
        position relative
        display block
        height 1.4rem
        &:after
          content '請提供有效的 Email'
          position absolute
          top 0
          right 0
          padding .2em 0
          color red
    &.error
      label
        position relative
        display block
        height 1.4rem
        &:after
          content '系統維護中...'
          position absolute
          top 0
          right 0
          padding .2em 0
          color red
  &Categories
    order 1
    display flex
    justify-content space-between
    padding .5em 0
    &__category
      width 48%
      label
        &:after
          position absolute
          top 50%
          left 110%
          transform translateY(-50%)
          width 100px
          font-size .6rem
          color #0c5a80
      &.subscribed
        label
          &:after
            content '(已訂閱成功)' 
      &.cancel
        label
          &:after
            content '(已取消訂閱)' 
    &__line
      display none
      width 1px
      background-color #ccc
    input[type=checkbox]
      margin-right .5em
    label
      position relative
      padding-bottom .2em
      color #4a4a4a
      line-height 1
    
    p
      display none
      margin .5em 0
      padding-left 22px
      color #4a4a4a
      text-align justify
      font-size .9rem
      line-height 1.3

@media (min-width: 600px)
  .newsletter
    margin 1em 0 0 2em
    padding 1em 2em .5em 3em
    border-top none
    border-bottom none
    border-right 1px solid #eaeaea
    border-left 15px solid #0c5a80
    &:before
      top 1em
      left -45px
    form
      order 1
      margin-top 0
      &.invaild
        label
          display none
        &:after
          content '請提供有效的 Email' 
          position absolute
          top 0
          right 10px
          line-height 24px
          color red
      &.error
        label
          display none
        &:after
          content '系統維護中...' 
          position absolute
          top 0
          right 10px
          line-height 24px
          color red

    &Categories
      order 2
      margin-top 1em
      padding 0
      &__category
        label
          &:after
            top 0
            transform translateY(0)
            font-size 1rem
      &__line
        display block
      p
        display block

</style>
