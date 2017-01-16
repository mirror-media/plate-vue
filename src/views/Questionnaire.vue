<template>
  <div class="questionnaire-view">
    <div class="questionnaire__title" v-bind:style="styleQuestionnaireTitle"></div>
    <div class="questionnaire__bar">
    </div>
    <div v-if="!finished">
      <div class="question-set">
        <Question-container v-bind:index="(currQ + 1)" v-bind:content="currQuestion"/>
        <div class="options">
          <div v-for="(o, i) in currOptions" v-on:click="pickOption">
            <Option-container v-bind:index="(i + 1)" v-bind:content="o.title" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
      'Option-container': Option,
      'Question-container': Question
    },
    data() {
      return {
        currQ: 0,
        finished: false,
        preFetch: fetchQuestionnaire,
        state: {}
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
        return _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions', this.currQ, 'title' ], '')
      },
      questions() {
        return _.get(this.state, [ 'questionnaire', 'tasduiiuah32hk2', 'questions' ], [])
      }
    },
    methods: {
      pickOption(e) {
        this.finished = ((this.currQ + 1) !== this.questions.length) ? false : true
        this.currQ = ((this.currQ + 1) !== this.questions.length) ? (this.currQ + 1): 0
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
