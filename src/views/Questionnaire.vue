<template>
  <div class="questionnaire-view">
    <div class="questionnaire__title" v-bind:style="styleQuestionnaireTitle">

    </div>
    <div class="questionnaire__bar">
    </div>
    <div class="question-set">
      <div class="question">
        <div class="question__index"><h3>Ｑ1</h3></div>
        <div class="question__content">
          <div class="content">
            <h3>有天你喝多了，醒來時你發現自己被關進了一間沒有窗戶的密室，這時候你會...</h3>
          </div>
        </div>
      </div>
      <div class="options">
        <div class="option-container">
          <div class="option">
            <div class="option__index">1</div>
            <div class="option__content">有天你喝多了，醒來時你發現自己被關進了一間沒有窗戶的密室，這時候你會...</div>
          </div>
        </div>
        <div class="option-container">
          <div class="option">
            <div class="option__index">2</div>
            <div class="option__content">有天你喝多了，醒來時你發現自己被關進了一間沒有窗戶的密室，這時候你會...</div>
          </div>
        </div>
        <div class="option-container">
          <div class="option">
            <div class="option__index">3</div>
            <div class="option__content">有天你喝多了，醒來時你發現自己被關進了一間沒有窗戶的密室，這時候你會...</div>
          </div>
        </div>
        <div class="option-container">
          <div class="option">
            <div class="option__index">4</div>
            <div class="option__content">有天你喝多了，醒來時你發現自己被關進了一間沒有窗戶的密室，這時候你會...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  const fetchQuestionnaire = (store) => {
    return store.dispatch('FETCH_QUESTIONNAIRE', {
      id: store.state.route.params.questionnaireId
    })
  }
  export default {
    name: 'questionnaire-view',
    preFetch: fetchQuestionnaire,
    data() {
      return {
        preFetch: fetchQuestionnaire,
        state: {
          gg: 'gg'
        }
      }
    },
    computed: {
      styleQuestionnaireTitle() {
        return {
          backgroundImage: 'url(' + _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'image', 'url' ]) + ')'
        }
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
      console.log('storestorestorestorestore', _.get(this.state, [ 'questionnaire' ]));
    }
  }
</script>
<style lang="stylus" scoped>
  .questionnaire-view {
    max-width: 960px;
    margin: 0 auto;
    height: 100vh;
    .questionnaire__title {
      min-height: 30vh;
      background-color: black;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    }
    .question-set {
      height: 60vh;
      .question {
        height: 33%;
        background-color: #fafafa;
        padding: 20px;
        display: flex;
        align-items: center;
        .question__index {
          text-align: center;
          flex: 2;
          h3{
            font-style: italic;
            font-size: 20px;
          }
        }
        .question__content {
          flex: 7;
          padding: 0 0.7em;
          border-left: 1px solid #d6d6d6;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .content {

          }
        }
      }
    }
    .options {
      background-color: #e4e4e4;
      padding: 0 20px;
      .option-container {
        display: flex;
        align-items: center;
        height: 70px;
        border-bottom-width: 2px;
        border-bottom-color: #ffffff;
        border-bottom-style: groove;
        .option {
          display: flex;
          align-items: center;
          .option__index {
            flex: 1;
            background-color: #d6d6d6;
            font-weight: bold;
            font-family: Verdana;
            margin-right: 1em;
            height: 26px;
            width: 2px;
            line-height: 25px;
            border-radius: 25px;
            padding: 0;
            text-align: center;
          }
          .option__content {
            flex: 9;
          }
        }
      }
    }
  }
</style>
