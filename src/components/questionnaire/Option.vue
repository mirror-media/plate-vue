<template>
  <div class="option-container">
    <div class="option">
      <div class="option__index">{{ index }}</div>
      <div class="option__content">{{ content }}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'option-container',
    props: {
      index: {},
      content: {}
    }
  }
</script>
<style lang="stylus" scoped>
  .option-container {
    display: flex;
    align-items: center;
    height: 70px;
    border-bottom-width: 2px;
    border-bottom-color: #ffffff;
    border-bottom-style: groove;
    .option {
      width: 100%;
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
</style>
