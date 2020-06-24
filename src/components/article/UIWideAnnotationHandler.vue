<template>
  <div
    class="annotation-handler"
  >
    <span
      :class="{ active: openAnnotation }"
      class="annotation-handler__text"
      @click="openAnnotation = !openAnnotation"
      v-text="annotation.text"
    />
    <div
      v-show="openAnnotation"
      class="annotation-handler__content"
    >
      <div
        class="content"
        v-html="annotation.annotation"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UIWideAnnotationHandler',
  props: {
    annotation: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      openAnnotation: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.annotation-handler {
  display: inline;
  line-height: 2;
  &-container {
    display: inline;
  }
  &__text {
    display: inline;
    color: #3e67aa;
    cursor: pointer;
    &::after {
      content: ''
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 5px;
      vertical-align: middle;
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: #3e67aa transparent transparent transparent;
      transition transform .3s ease-in
    }
    &.active {
      &::after {
        transform: rotate(-180deg);
      }
    }
  }
  .annotation-handler__content {
    margin: 13px -calc((100% - 266px) / 2) 20px;
    padding: 23px calc((100% - 266px) / 2);
    color: rgba(0, 0, 0, 0.87);
    font-size: 13px;
    line-height: 1.5;
    letter-spacing: 1px;
    text-align: justify;
    background-color: rgba(216, 216, 216, 0.3);
    border-radius: 2px;
    @media (min-width: 768px) {
      margin: 13px 0 20px;
      padding: 23px 37px;
    }
    .content {
      width: 266px;
      margin: 0 auto;
      @media (min-width: 768px) {
        width: 100%;
      }
    }
  }
}
</style>
