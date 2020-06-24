<template>
  <div class="wide-annotation">
    <template v-for="(data, index) in splitContent">
      <UIWideAnnotationHandler
        v-if="data.annotation"
        :key="`${item.id}-${index}`"
        :annotation="data"
      />
      <span
        v-else
        :key="`${item.id}-${index}`"
        v-html="data"
      />
    </template>
  </div>
</template>

<script>
import { flatten, get } from 'lodash'
import UIWideAnnotationHandler from './UIWideAnnotationHandler.vue'

export default {
  name: 'UIWideAnnotation',
  components: {
    UIWideAnnotationHandler
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    content () {
      return get(this.item, 'content.0', '')
    },
    splitContent () {
      const data = this.content.split(/<!--__ANNOTATION__=/gm)

      const split = data.map(item => {
        if (item.match(/<!--(.*)-->/)) {
          const qqq = item.split(/<!--(.*)-->/)
          return [qqq[0].replace(/-->/, ''), qqq[2]]
        }
        return item
      })
      const flattenData = flatten(split)
      const processed = flattenData.map(item => {
        if (item.match(/^{(.*)}$/)) {
          return JSON.parse(item)
        }
        return item
      })
      return processed
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
}

</style>
