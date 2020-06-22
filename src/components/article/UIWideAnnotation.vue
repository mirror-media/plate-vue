<template>
  <div class="wide-annotation">
    <span v-html="splitContent[0]" />
    <template v-if="annotation">
      <span
        :class="{ active: openAnnotation }"
        class="wide-annotation__text"
        @click="openAnnotation = !openAnnotation"
        v-text="annotation.text"
      />
      <div
        v-show="openAnnotation"
        class="annotation__content"
      >
        <div
          class="content"
          v-html="annotation.annotation"
        />
      </div>
    </template>
    <span v-html="splitContent[1]" />
  </div>
</template>

<script>
import { get } from 'lodash'

export default {
  name: 'UIWideAnnotation',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      openAnnotation: false
    }
  },
  computed: {
    annotation () {
      try {
        const data = this.content.match(/<!--__ANNOTATION__=(.*)-->/gm)
        return JSON.parse(data[0].match(/{(.*)}/gm))
      } catch (error) {
        console.log(error)
        return undefined
      }
    },
    content () {
      return get(this.item, 'content.0', '')
    },
    splitContent () {
      const data = this.content.split(/<!--__ANNOTATION__=(.*)-->/gm)
      data.splice(1, 1)
      return data
    }
  }
}
</script>

<style lang="stylus" scoped>
.wide-annotation {
  text-align: justify;
  span {
    color: rgba(0,0,0,.87);
    font-size: 15px;
    line-height: 2;
  }
  .wide-annotation__text {
    display: inline-flex;
    align-items: center;
    color: #3e67aa;
    cursor: pointer;
    &::after {
      content: ''
      width: 0;
      height: 0;
      margin-left: 5px;
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
  .annotation__content {
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
