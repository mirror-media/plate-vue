<template>
  <p>timeline</p>
</template>

<script>

const fetchActivities = (store, params = {}) => {
  return store.dispatch('FETCH_ACTIVITIES', {
    'params': params
  })
}

export default {
  name: 'timeline',
  preFetch: fetchActivities
}

</script>

<style lang="stylus" scoped>

</style>
