<template>
    <span class="post-body-credit">
      {{ title }}｜
      <a
        v-for="person in people"
        :key="person.id"
        :href="`/author/${person.id}`"
        v-text="person.name"
      />
    </span>
</template>
<script>
export default {
  name: 'PostBodyCredit',
  props: {
    people: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.post-body-credit
  display inline-flex
  color #000
  a
    &:link, &:visited, &:hover
      color #0b4fa2
    & + a
      margin-left .3em
</style>