<template>
  <div
    :class="{ collapsed }"
    class="watch-collapse"
  >
    <table>
      <thead>
        <tr>
          <slot name="heading" />
          <th>
            <button
              class="watch-collapse__toggle"
              @click="toggleContent"
            >
              <span />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <slot name="collapsible-row" />
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'UIWatchCollapse',
  props: {
    defaultCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      collapsed: this.defaultCollapsed
    }
  },
  methods: {
    toggleContent () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
<style lang="stylus" scoped>
.watch-collapse
  table
    width 100%
    color rgba(0, 0, 0, 0.66)
    font-size 16px
    border-collapse collapse
    th, td
      &:first-of-type
        width 88px
        padding-left 8px
        text-align left
      &:last-of-type
        padding-left 14px
        padding-right 10px
    thead
      th
        padding 9px 0 11px
        border-top 1px solid #000
        border-bottom 1px solid #000
        font-weight normal
        &:last-of-type
          position relative
          text-align right
    tbody
      td
        padding 17px 0
        &:first-of-type
          color rgba(0, 0, 0, 0.87)
  &__toggle
    position absolute
    top 50%
    right 2px
    transform translateY(-50%)
    display inline-flex
    justify-content center
    align-items center
    padding 8px
    background-color transparent
    border none
    span
      display inline-block
      width 12px
      height 2px
      background-color rgba(0, 0, 0, 0.87)
    &:after
      content ''
      position absolute
      top 3px
      left 13px
      width 2px
      height 12px
      background-color rgba(0, 0, 0, 0.87)
      opacity 0
      visibility hidden
      transition .2s opacity ease-in-out
  &.collapsed
    tbody
      display none
    .watch-collapse__toggle
      &:after
        opacity 1
        visibility visible
</style>
