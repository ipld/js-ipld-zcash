'use strict'

const ZcashBitcoreBlockHeader = require('zcash-bitcore-lib').BlockHeader
const CID = require('cids')
const multicodec = require('multicodec')
const multihashes = require('multihashes')
const multihashing = require('multihashing-async')

const ZCASH_BLOCK_HEADER_SIZE = 1487
const CODEC = multicodec.ZCASH_BLOCK
const DEFAULT_HASH_ALG = multicodec.DBL_SHA2_256

/**
 * Serialize internal representation into a binary Zcash block.
 *
 * @param {ZcashBlock} dagNode - Internal representation of a Zcash block
 * @returns {Buffer}
 */
const serialize = (dagNode) => {
  return dagNode.toBuffer()
}

/**
 * Deserialize Zcash block into the internal representation.
 *
 * @param {Buffer} binaryBlob - Binary representation of a Zcash block
 * @returns {ZcashBlock}
 */
const deserialize = (binaryBlob) => {
  if (binaryBlob.length !== ZCASH_BLOCK_HEADER_SIZE) {
    throw new Error(
      `Zcash block header needs to be ${ZCASH_BLOCK_HEADER_SIZE} bytes`)
  }

  const deserialized = ZcashBitcoreBlockHeader.fromBuffer(binaryBlob)

  const getters = {
    difficulty: function () {
      return this.bits
    },
    parent: function () {
      return hashToCid(this.prevHash)
    },
    tx: function () {
      return hashToCid(this.merkleRoot)
    }
  }
  Object.entries(getters).forEach(([name, fun]) => {
    Object.defineProperty(deserialized, name, {
      enumerable: true,
      get: fun
    })
  })

  const removeEnumberables = [
    'bits',
    'merkleRoot',
    'prevHash',
    'time'
  ]
  removeEnumberables.forEach((field) => {
    if (field in deserialized) {
      Object.defineProperty(deserialized, field, { enumerable: false })
    }
  })

  return deserialized
}

/**
 * Calculate the CID of the binary blob.
 *
 * @param {Object} binaryBlob - Encoded IPLD Node
 * @param {Object} [userOptions] - Options to create the CID
 * @param {number} [userOptions.cidVersion=1] - CID version number
 * @param {string} [UserOptions.hashAlg] - Defaults to the defaultHashAlg of the format
 * @returns {Promise.<CID>}
 */
const cid = async (binaryBlob, userOptions) => {
  const defaultOptions = { cidVersion: 1, hashAlg: DEFAULT_HASH_ALG }
  const options = Object.assign(defaultOptions, userOptions)

  const multihash = await multihashing(binaryBlob, options.hashAlg)
  const codecName = multicodec.print[CODEC]
  const cid = new CID(options.cidVersion, codecName, multihash)

  return cid
}

// Convert a Zcash hash (as Buffer) to a CID
const hashToCid = (hash) => {
  const multihash = multihashes.encode(hash, DEFAULT_HASH_ALG)
  const cidVersion = 1
  const cid = new CID(cidVersion, 'zcash-block', multihash)
  return cid
}

module.exports = {
  hashToCid: hashToCid,
  ZCASH_BLOCK_HEADER_SIZE: ZCASH_BLOCK_HEADER_SIZE,
  codec: CODEC,
  defaultHashAlg: DEFAULT_HASH_ALG,

  // Public API
  cid: cid,
  deserialize: deserialize,
  serialize: serialize
}
