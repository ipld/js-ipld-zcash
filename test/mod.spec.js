/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const multicodec = require('multicodec')

const mod = require('../src')

describe('IPLD Format', () => {
  it('codec is zcash-block', () => {
    expect(mod.codec).to.equal(multicodec.ZCASH_BLOCK)
  })

  it('defaultHashAlg is dbl-sha2-256', () => {
    expect(mod.defaultHashAlg).to.equal(multicodec.DBL_SHA2_256)
  })
})
