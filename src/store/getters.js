import _ from 'lodash'

export default {
  searchResultNormalized: state => {
    return _.map(state.searchResult.items, item => Object.assign({ id: _.get(item, 'id') }, _.get(item, 'source')))
  },
  searchResultTotalCount: state => {
    return _.get(state.searchResult, 'hits.total', 0)
  },
  topic: state => { // considered deprecated
    return state.topic
  },
  topics: state => { // considered deprecated
    return state.topics
  }
}
