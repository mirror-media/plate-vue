<template>
  <div class="question">
    <div class="question__index"><h3>Ｑ{{ index }}</h3></div>
    <div class="question__content">
      <div class="content">
        <h3>{{ content }}</h3>
      </div>
    </div>
  <div>
</template>
<script>
  export default {
    name: 'question-container',
    props: {
      index: {},
      content: {}
    }
  }
</script>
<style lang="stylus">
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
</style>
