import { fetchPosts } from '../services'

export default {
  namespaced: true,
  state () {
    return {
      posts: {}
    }
  },
  actions: {
    async FETCH_POST ({ commit }, { slug }) {
      return fetchPosts({
        clean: 'content',
        where: { slug }
      })
        .then(res => {
          commit('SET_POST', { post: res.items[0], slug })
        })
        .catch(err => err)
    }
  },
  mutations: {
    SET_POST (state, { post, slug }) {
      state.posts[slug] = post
    }
  }
}
