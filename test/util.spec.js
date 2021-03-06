/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const CID = require('cids')
const multicodec = require('multicodec')
const { Buffer } = require('buffer')
const IpldZcash = require('../src/index')
const helpers = require('./helpers')

const fixtures = helpers.loadFixtures()

describe('IPLD format util API deserialize()', () => {
  it('should work correctly', () => {
    const dagNode = IpldZcash.util.deserialize(fixtures.blockHeader)
    verifyBlock(dagNode, {
      version: 4,
      previousblockhash: '960143fe2c5e22cc0bf0cd5534d7f7f4347f4e75223d07379b9af71400000000',
      merkleroot: '947863a7d7a980a00ef54ce761dcb7b21f4b95fdaf4822f16f37a0e2dea8643e',
      finalsaplingroot: '0000000000000000000000000000000000000000000000000000000000000000',
      time: 1481233847,
      bits: 477875354,
      nonce: '8200000000000000d548af969ea8dceedb6bfad4000000000000000000000000',
      solution: '005836fdbc8a7a7d9cbec4f059ba17f62d0e775b19035c8e18f123d3a99f270118325eaac526ae7a68d60c9c8c5acdc3e71e987020cb55ad92e0c37af0ab200d3a19e366389bdfe53cd79f70dbc4a67ea6fdc3700f25e0b1d49cee31a54ba8cf826b34c2561c97a0c239e2872c74a33c41690a44e0de741283d60dbfb738152a90d84b1b8f4dce36c3323d35275e8c43f464e9401b757a85392335fdba2432eda2b225b9549faee001d0ebadf24c106f353a02788c386a2f6bce7d83422e8d3ba8ff5cdd85429484a67c76ce31bfacf968621f0b72d9334dfee6b430d2a811f7954548b419fb9428b6d9a09e1317774ebb628d4dd8f334fbe4fb80200f226af20f1cd089849c6207c9d87869baba2e473b0f6b07e68ada56955322d31879c5653a1a84df97a5180e0655fa8da912d5b09396dc601db16143ac00525a9f16b087b64e4fb6567822f1ed84ba723ffde6ca00f29446a54ce34ad03030e6dd55a992817ede9038436793fa72b7133fcded9443d2340b7dcfb45b02230121c5d0d2958cff63a5633db92b61ed9524f74d230a5429c76a02e12f096e611cc978893683429f89cf03a52533039ae3b7c092589aa9f60cb67b19d5849533c254986a614909ee5765097935f7b162842c09d315526f5f3d77c817eff16204fbe6c949b44e1ac1052482774279e76377431123a189d6716ddff6157c6708985f8f01277d67871e915adcc83119440c8cf6e121911b6d748a4c4b15537273379965ecb0bd89862936cfd7a45d9138b93e564596de4ae5099a371f8cf95f692dffe46523ad5bb0482891df72eac651b9c42f191841e3ad68b0459619367f0341523a03a61ecda6694a7dbcaf1f6d9d11c8c6f132fda2beca91f84cd01d78e2854b5aac4ad7219bff38f94e131e065a48961e6e5468690d0122c832f3ee5570fbed1547d91bc202151d3757d432f1edc793c5f37cf6bd34a9af42970ccb01ae1696ba75067c743b58b9ca4e81e1d7a69203c3b62609150effaab450dd4a0b20d68a31be560808c097f046924acd6e9fc18e3f5d28e698d658a96b06821737a511616bdcb4237c5d3dedd56e53d758bb2d695f52ee58cb49bff3563d38c30411c22e7393b61797d79755a4ea5f9b1232283e4b802100199633b03277e398f70f3e0ef8e7a4b7bf396aba1d55f53a2e03ef089c6720dc456715b08bb94f754d211037c15e0b2078d6226a7a31f4e8f19d885adae07244132dcf0605873a19d4dbef5a03f425975e796956827d6d66072675d10ac87a02db325559bdc9643a32a0beb93723fc3fdbb218b5c2c9d3c2ca9dec65392e1a0fbe0732e66547335f69ab4b81064a4d3fb9830d0e3c547e2a6a554f22928e8762e8941f6f5f5cc509319fb85a2cbf0e433be5a225f94c693bb0691a8ecdba58f71104e12f7cc056a10ae17856e059fb126ea1a5fa43a40f4367901212a3decbea31e0756c37587ff4fdd0271825aa48e0105f8af667977a823fe051dfaa1fb4014f50d6222fed9ccd8787c77563d83e3e52435cf19806c662596988442b39f2611fc80a8ee561bc3f944320b3f7ebaae1fc592e7a823c0967ceedf898b6f805224a3353f92121fb22fb16dbdc41cc066c1f5efaa42945ad4b6326fe73e4b3b34371c64871a99d97bec407ec53b9b01a332ada7a81f8f5f576aedd96b7ec0f51f9977c2ca8c40fbd66779a4743db1622619d23940c59f72b055674bd9ab331a20db20bbcdef4d8184929b1b6bcfc5f155ff0d263e37145f5c98cde541dda165943dec7a56deb81b8f1bd279acfcc8e16e9a968263f8d5c8793e7311a4fe2d114c9d601bf315df05317c0ad89c34e363af79ca4f0c6618f0da51cb8930f2d525779a64f3b657ff0e8b1106ce4f63f775b4cf6'
    })
  })

  it('should error on an invalid block', () => {
    const invalidBlock = Buffer.from('abcdef', 'hex')
    expect(() => {
      IpldZcash.util.deserialize(invalidBlock)
    }).to.throw('Zcash block must at least include the 1487 header bytes')
  })
})

describe('IPLD format util API serialize()', () => {
  it('should not be able to serialize', () => {
    const dagNode = IpldZcash.util.deserialize(fixtures.blockHeader)
    expect(() => {
      IpldZcash.util.serialize(dagNode)
    }).to.throw()
  })
})

describe('IPLD format util API cid()', () => {
  const expectedCid = new CID(1, 'zcash-block', Buffer.from(
    '5620e1451fd8fecefdd9d443f294bc5ae918301922088ba51d35a2a4672c00000000',
    'hex'))

  it('should encode the CID correctly', async () => {
    const cid = await IpldZcash.util.cid(fixtures.blockHeader)
    expect(cid.equals(expectedCid)).to.be.true()
  })

  it('should encode the CID correctly with default options specified', async () => {
    const cid = await IpldZcash.util.cid(fixtures.blockHeader, {
      cidVersion: 1,
      hashAlg: multicodec.DBL_SHA2_256
    })
    expect(cid.equals(expectedCid)).to.be.true()
  })

  it('should encode the CID correctly with options', async () => {
    const cid = await IpldZcash.util.cid(fixtures.blockHeader, {
      hashAlg: multicodec.SHA3_256
    })
    expect(cid.equals(new CID(1, 'zcash-block', Buffer.from(
      '1620426585d4624b64080d96788c8199562e73fc60f32fde54a82b36f4204c046ce6',
      'hex'
    )))).to.be.true()
  })

  it('should match encoded CID and block CID', async () => {
    const cid = await IpldZcash.util.cid(fixtures.blockHeader)
    const dagNode = IpldZcash.util.deserialize(fixtures.blockHeader)
    expect(cid.equals(dagNode.cid)).to.be.true()
  })

  it('should error unknown hash algorithm', async () => {
    await expect(
      IpldZcash.util.cid(fixtures.blockHeader, { hashAlg: 0xffffff })
    ).to.be.rejectedWith('Unrecognized function code: 16777215')
  })

  it('should deserialize a Uint8Array', () => {
    IpldZcash.util.deserialize(Uint8Array.from(fixtures.blockHeader))
  })
})

const verifyBlock = (header, expected) => {
  expect(header.version).to.equal(expected.version)
  expect(header.previousblockhash.toString('hex')).to.equal(expected.previousblockhash)
  expect(header.merkleroot.toString('hex')).to.equal(expected.merkleroot)
  expect(header.tx.toString('hex')).to.equal(expected.merkleroot)
  expect(header.finalsaplingroot.toString('hex')).to.equal(expected.finalsaplingroot)
  expect(header.reserved.toString('hex')).to.equal(expected.finalsaplingroot)
  expect(header.time).to.equal(expected.time)
  expect(header.timestamp).to.equal(expected.time)
  expect(header.bits).to.equal(expected.bits)
  expect(header.nonce.toString('hex')).to.equal(expected.nonce)
  expect(header.solution.toString('hex')).to.equal(expected.solution)
}
