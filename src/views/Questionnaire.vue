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
        <div v-for="(o, i) in giveCurrOptions" v-on:click="pickOption">
          <Option-container v-bind:index="(i + 1)" v-bind:content="o.title" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import Option from '../components/questionnaire/Option.vue'
  const fetchQuestionnaire = (store) => {
    return store.dispatch('FETCH_QUESTIONNAIRE', {
      id: store.state.route.params.questionnaireId
    })
  }
  export default {
    name: 'questionnaire-view',
    preFetch: fetchQuestionnaire,
    components: {
      'Option-container': Option
    },
    data() {
      return {
        preFetch: fetchQuestionnaire,
        state: {},
        currQ: 0
      }
    },
    computed: {
      styleQuestionnaireTitle() {
        return {
          backgroundImage: 'url(' + _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'image', 'url' ]) + ')'
        }
      },
      giveCurrOptions() {
        return _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions', this.currQ, 'options' ])
      },
    },
    methods: {
      pickOption(e) {
        this.currQ++;
        console.log('click option');
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
      console.log('storestorestorestorestore', _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions', 0, 'options' ]));
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
    }
  }
</style>
