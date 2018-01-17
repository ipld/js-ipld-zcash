'use strict'

const ZcashBitcoreBlock = require('zcash-bitcore-lib').Block
const CID = require('cids')
const multihashes = require('multihashes')
const sha256 = require('hash.js/lib/hash/sha/256')

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
 * @param {CidCallback} callback - Callback that handles the return value
 * @returns {void}
 */
const cid = (dagNode, callback) => {
  let err = null
  let cid
  try {
    // Zcash double hashes
    const firstHash = sha256().update(dagNode.header.toBuffer(true)).digest()
    const headerHash = sha256().update(Buffer.from(firstHash)).digest()

    cid = hashToCid(Buffer.from(headerHash))
  } catch (cidError) {
    err = cidError
  } finally {
    callback(err, cid)
  }
}

// Convert a Zcash hash (as Buffer) to a CID
const hashToCid = (hash) => {
  const multihash = multihashes.encode(hash, 'dbl-sha2-256')
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
