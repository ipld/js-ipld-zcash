'use strict'

const ZcashBitcoreBlock = require('zcash-bitcore-lib').Block
const CID = require('cids')
const multihashes = require('multihashes')
const multihashing = require('multihashing-async')
const waterfall = require('async/waterfall')

/**
 * @callback SerializeCallback
 * @param {?Error} error - Error if serialization failed
 * @param {?Buffer} binaryBlob - Binary Zcash block if serialization was
 *   successful
 */
/**
 * Serialize internal representation into a binary Zcash block.
 *
 * @param {ZcashBlock} dagNode - Internal representation of a Zcash block
 * @param {SerializeCallback} callback - Callback that handles the
 *   return value
 * @returns {void}
 */
const serialize = (dagNode, callback) => {
  let err = null
  let binaryBlob
  try {
    binaryBlob = dagNode.toBuffer()
  } catch (serializeError) {
    err = serializeError
  } finally {
    callback(err, binaryBlob)
  }
}

/**
 * @callback DeserializeCallback
 * @param {?Error} error - Error if deserialization failed
 * @param {?ZcashBlock} dagNode - Internal representation of a Zcash block
 *   if deserialization was successful
 */
/**
 * Deserialize Zcash block into the internal representation,
 *
 * @param {Buffer} binaryBlob - Binary representation of a Zcash block
 * @param {DeserializeCallback} callback - Callback that handles the
 *   return value
 * @returns {void}
 */
const deserialize = (binaryBlob, callback) => {
  let err = null
  let dagNode
  try {
    dagNode = ZcashBitcoreBlock.fromBuffer(binaryBlob)
  } catch (deserializeError) {
    err = deserializeError
  } finally {
    callback(err, dagNode)
  }
}

/**
 * @callback CidCallback
 * @param {?Error} error - Error if getting the CID failed
 * @param {?CID} cid - CID if call was successful
 */
/**
 * Get the CID of the DAG-Node.
 *
 * @param {ZcashBlock} dagNode - Internal representation of a Zcash block
 * @param {Object} [options] - Ignored
 * @param {CidCallback} callback - Callback that handles the return value
 * @returns {void}
 */
const cid = (dagNode, options, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = options || {}
  waterfall([
    (cb) => {
      try {
        multihashing(dagNode.header.toBuffer(true), 'dbl-sha2-256', cb)
      } catch (err) {
        cb(err)
      }
    },
    (mh, cb) => cb(null, new CID(1, 'zcash-block', mh))
  ], callback)
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

  // Public API
  cid: cid,
  deserialize: deserialize,
  serialize: serialize
}
