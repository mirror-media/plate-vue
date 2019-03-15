import api from '../../../src/store/api.js'
import qs from 'qs'

describe('_buildQuery', () => {
  const _buildQuery = api.__get__('_buildQuery')
  
  const params1 = { max_results: 10, page: 1, sort: '-publishedDate' }
  const params2 = { where: { isFeatured: true, eventType: 'embedded' }, max_results: 1 }
  const params2Stringify = qs.stringify({ where: '{"isFeatured":true,"eventType":"embedded"}', max_results: 1 })
  const params3 = { id: [ 2 ] }
  const params4 = { id: [ 2, 3 ] }
  const params4Stringify = qs.stringify({ id: '2,3' })
  const params5 = { page: 1, game: '還願' }

  test('build query', () => {
    expect(_buildQuery(params1)).toEqual('max_results=10&page=1&sort=-publishedDate')
    expect(_buildQuery(params2)).toEqual(params2Stringify)
    expect(_buildQuery(params3)).toEqual('id=2')
    expect(_buildQuery(params4)).toEqual(params4Stringify)
    expect(_buildQuery(params5)).toEqual('page=1')
  })
})

describe('_doFetch', () => {
  const _doFetch = api.__get__('_doFetch')
  
  const url1 = 'https://www.mirrormedia.mg/api/combo?endpoint=posts-vue&endpoint=projects&endpoint=topics'
  const url2 = 'https://www.mirrormedia.mg/api/posts?where={"slug":{"$in":["20190227edi004"]}}&clean=content'
  const urlEmpty = 'http://www.mirrormedia.mg/api/notExist'
  test('GET API data', async () => {
    await expect(_doFetch(url1)).toResolve()
    await expect(_doFetch(url2)).toResolve()
    await expect(_doFetch(urlEmpty)).toReject()
  })
})