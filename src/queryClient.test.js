import { describe, it, expect } from 'vitest'
import { queryClient, persister, persistOptions, CACHE_SCHEMA_VERSION } from './queryClient.js'

describe('queryClient 캐시 설정', () => {
  it('persistOptions.buster가 CACHE_SCHEMA_VERSION과 일치한다', () => {
    expect(persistOptions.buster).toBe(CACHE_SCHEMA_VERSION)
    expect(persistOptions.buster).toBe('v1')
  })

  it('persistOptions.maxAge가 3일로 설정되어 있다', () => {
    expect(persistOptions.maxAge).toBe(1000 * 60 * 60 * 24 * 3)
  })

  it('queryClient의 기본 gcTime이 24시간으로 설정되어 있다', () => {
    expect(queryClient.getDefaultOptions().queries.gcTime).toBe(1000 * 60 * 60 * 24)
  })

  it('persister가 유효한 Persister 형태(persistClient/restoreClient/removeClient)를 갖는다', () => {
    expect(typeof persister.persistClient).toBe('function')
    expect(typeof persister.restoreClient).toBe('function')
    expect(typeof persister.removeClient).toBe('function')
  })
})
