'use strict'

const ZCASH_BLOCK_HEADER_SIZE = require('../src/index')
  .util.ZCASH_BLOCK_HEADER_SIZE

const headerFromHexBlock = (hex) => {
  return Buffer.from(hex.toString(), 'hex').slice(0, ZCASH_BLOCK_HEADER_SIZE)
}

module.exports = {
  headerFromHexBlock
}
