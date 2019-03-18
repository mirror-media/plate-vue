import api from '../../../src/store/api.js'
import qs from 'qs'

describe('test internal functions', () => {
  test('buildQuery', () => {
    const buildQuery = api.__get__('buildQuery')
    const params1 = { max_results: 10, page: 1, sort: '-publishedDate' }
    const params2 = { where: { isFeatured: true, eventType: 'embedded' }, max_results: 1 }
    const params2Stringify = qs.stringify({ where: '{"isFeatured":true,"eventType":"embedded"}', max_results: 1 })
    const params3 = { id: [ 2 ] }
    const params4 = { id: [ 2, 3 ] }
    const params4Stringify = qs.stringify({ id: '2,3' })
    const params5 = { page: 1, game: '還願' }

    expect(buildQuery(params1)).toEqual('max_results=10&page=1&sort=-publishedDate')
    expect(buildQuery(params2)).toEqual(params2Stringify)
    expect(buildQuery(params3)).toEqual('id=2')
    expect(buildQuery(params4)).toEqual(params4Stringify)
    expect(buildQuery(params5)).toEqual('page=1')
  })

  test('buildUrlWithQuery', () => {
    const buildUrlWithQuery = api.__get__('buildUrlWithQuery')
    const params1 = { clean: "content", where: { slug: { $in: [ '20190227edi004' ] }}}
    const params1Stringify = qs.stringify({ where: '{"slug":{"$in":["20190227edi004"]}}', clean: 'content' })
    expect(buildUrlWithQuery({ endpoint: 'posts', params: params1 })).toEqual(`localhost:8080/api/posts?${params1Stringify}`)
  })

  test('doFetch', async () => {
    const doFetch = api.__get__('doFetch')
  
    const url1 = 'https://www.mirrormedia.mg/api/combo?endpoint=posts-vue&endpoint=projects&endpoint=topics'
    const url2 = 'https://www.mirrormedia.mg/api/posts?where={"slug":{"$in":["20190227edi004"]}}&clean=content'
    const urlEmpty = 'http://www.mirrormedia.mg/api/notExist'

    await expect(doFetch(url1)).toResolve()
    await expect(doFetch(url2)).toResolve()
    await expect(doFetch(urlEmpty)).toReject()
  })

})
