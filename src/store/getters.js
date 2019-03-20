import { get } from 'lodash'

export default {
  searchResultNormalized: state => {
    return (state.searchResult.items || []).map(item => Object.assign({ id: item.id }, item.source))
  },
  searchResultTotalCount: state => {
    return get(state.searchResult, 'hits.total') || 0
  },
  topic: state => { // considered deprecated
    return state.topic
  },
  topics: state => { // considered deprecated
    return state.topics
  }
}
