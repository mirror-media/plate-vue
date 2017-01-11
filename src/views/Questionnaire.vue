<template>
  <div class="questionnaire-view">
    <div class="questionnaire__title">

    </div>
    <div class="questionnaire__bar">
    </div>
    <div class="question-set">
      <div class="question">
        <div class="question__index">Ｑ1</div>
        <div class="question__content">有天你喝多了，醒來時你發現自己被關進了一間沒有窗戶的密室，這時候你會...</div>
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

  const fetchQuestionnaire = (store) => {
    return store.dispatch('FETCH_QUESTIONNAIRE', {
      id: store.state.route.params.questionnaireId
    })
  }
  export default {
    name: 'questionnaire-view',
    preFetch: fetchQuestionnaire,
    data () {
      return {
        preFetch: fetchQuestionnaire
      }
    },
    mounted: () => {
      let state = {}
      if (window.__INITIAL_STATE__) {
        try {
          state = window.__INITIAL_STATE__
        } catch (e) {
          state = {}
        }
      }
      console.log('storestorestorestorestore', state);
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
      background-image: url(//statics.mirrormedia.mg/questionnaire/tasduiiuah32hk2/image/cover.jpg);
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
          .option__index {
            flex: 1;
          }
          .option__content {
            flex: 9;
          }
        }
      }
    }
  }
</style>
