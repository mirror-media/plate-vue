import _ from 'lodash'

export default {
  namespaced: true,
  state () {
    return {
      data: {}
    }
  },
  mutations: {
    SET_DATA (state, data) {
      state.data = data
    },
    PUSH_ITEMS (state, items) {
      state.data._items.push(...items)
    }
  },
  getters: {
    items (state) {
      return _.get(state, ['data', '_items'], [])
    }
  }
}
