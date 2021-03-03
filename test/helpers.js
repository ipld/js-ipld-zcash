'use strict'

const ZCASH_BLOCK_HEADER_SIZE = require('../src/index')
  .util.ZCASH_BLOCK_HEADER_SIZE
const loadFixture = require('aegir/utils/fixtures')
const { Buffer } = require('buffer')

// fixture block.hex is 000000002c67a4a2351da58b0822193018e95abc94f243d4d9fdcefed81f45e1

function loadFixtures () {
  const fixtures = {}
  const blockHex = loadFixture('test/fixtures/block.hex').toString()
  fixtures.block = Buffer.from(blockHex, 'hex')
  fixtures.blockHeader = fixtures.block.slice(0, ZCASH_BLOCK_HEADER_SIZE)
  fixtures.nonHeader = fixtures.block.slice(ZCASH_BLOCK_HEADER_SIZE, fixtures.block.length)
  return fixtures
}

module.exports.loadFixtures = loadFixtures
