'use strict'

const ZcashBitcoreBlockHeader = require('zcash-bitcore-lib').BlockHeader
const CID = require('cids')
const multihashes = require('multihashes')
const multihashing = require('multihashing-async')

const ZCASH_BLOCK_HEADER_SIZE = 1487

/**
 * Serialize internal representation into a binary Zcash block.
 *
 * @param {ZcashBlock} dagNode - Internal representation of a Zcash block
 * @returns {Promise<Buffer>}
 */
const serialize = async (dagNode) => {
  return dagNode.toBuffer()
}

/**
 * Deserialize Zcash block into the internal representation,
 *
 * @param {Buffer} binaryBlob - Binary representation of a Zcash block
 * @returns {Promise<dagNode>}
 */
const deserialize = async (binaryBlob) => {
  if (binaryBlob.length !== ZCASH_BLOCK_HEADER_SIZE) {
    throw new Error(`Zcash block header needs to be ${ZCASH_BLOCK_HEADER_SIZE} bytes`)
  }

  return ZcashBitcoreBlockHeader.fromBuffer(binaryBlob)
}

/**
 * Get the CID of the DAG-Node.
 *
 * @param {ZcashBlock} dagNode - Internal representation of a Zcash block
 * @param {Object} [options] - Options to create the CID
 * @param {number} [options.version=1] - CID version number
 * @param {string} [options.hashAlg='dbl-sha2-256'] - Hashing algorithm
 * @returns {Promise<CID>}
 */
const cid = async (dagNode, options = {}) => {
  // avoid deadly embrace between resolver and util
  const hashAlg = options.hashAlg || require('./resolver').defaultHashAlg
  const version = typeof options.version === 'undefined' ? 1 : options.version

  return new Promise((resolve, reject) => {
    multihashing(dagNode.toBuffer(), hashAlg, (err, mh) => {
      if (err) return reject(err)
      resolve(new CID(version, 'zcash-block', mh))
    })
  })
}

// Convert a Zcash hash (as Buffer) to a CID
const hashToCid = (hash) => {
  // avoid deadly embrace between resolver and util
  const defaultHashAlg = require('./resolver').defaultHashAlg
  const multihash = multihashes.encode(hash, defaultHashAlg)
  const cidVersion = 1
  const cid = new CID(cidVersion, 'zcash-block', multihash)
  return cid
}

module.exports = {
  hashToCid: hashToCid,
  ZCASH_BLOCK_HEADER_SIZE: ZCASH_BLOCK_HEADER_SIZE,

  // Public API
  cid: cid,
  deserialize: deserialize,
  serialize: serialize
}
