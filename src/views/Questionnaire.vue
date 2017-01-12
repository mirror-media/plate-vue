<template>
  <div class="questionnaire-view">
    <div class="questionnaire__title" v-bind:style="styleQuestionnaireTitle">

    </div>
    <div class="questionnaire__bar">
    </div>
    <div class="question-set">
      <Question-container v-bind:index="(currQ + 1)" v-bind:content="currQuestion[ 'title' ]"/>
      <div class="options">
        <div v-for="(o, i) in currOptions" v-on:click="pickOption">
          <Option-container v-bind:index="(i + 1)" v-bind:content="o.title" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import Option from '../components/questionnaire/Option.vue'
  import Question from '../components/questionnaire/Question.vue'
  const fetchQuestionnaire = (store) => {
    return store.dispatch('FETCH_QUESTIONNAIRE', {
      id: store.state.route.params.questionnaireId
    })
  }
  export default {
    name: 'questionnaire-view',
    preFetch: fetchQuestionnaire,
    components: {
      'Option-container': Option,
      'Question-container': Question
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
      currOptions() {
        return _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions', this.currQ, 'options' ])
      },
      currQuestion() {
        return _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions', this.currQ ], '')
      }
    },
    methods: {
      pickOption(e) {
        this.currQ++;
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
      console.log('storestorestorestorestore', _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions', 0, 'title' ]));
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
    }
    .options {
      background-color: #e4e4e4;
      padding: 0 20px;
    }
  }
</style>
