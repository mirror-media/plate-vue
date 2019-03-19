import _ from 'lodash'

export default {
  searchResultNormalized: state => {
    return _.map(state.searchResult.items, item => Object.assign({ id: _.get(item, 'id') }, _.get(item, 'source')))
  },
  searchResultTotalCount: state => {
    return _.get(state.searchResult, 'hits.total', 0)
  },
  topic: state => {
    return state.topic
  },
  topics: state => {
    return state.topics
  }
}
