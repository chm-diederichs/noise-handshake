const test = require('tape')
const NoiseState = require('../noise.js')

test('IK', t => {
  const initiator = new NoiseState('IK', true)
  const responder = new NoiseState('IK', false)

  const rpk = Buffer.from(responder.s.publicKey)
  initiator.initialise(Buffer.alloc(0), responder.s.publicKey)
  responder.initialise(Buffer.alloc(0))

  const message = initiator.send()
  responder.recv(message)

  const reply = responder.send()
  initiator.recv(reply)

  t.equal(initiator.key, null)
  t.equal(initiator.nonce, null)
  t.equal(initiator.curve, null)
  t.equal(initiator.digest, null)
  t.equal(initiator.chainingKey, null)
  t.equal(initiator.offset, null)
  t.equal(initiator.e, null)
  t.equal(initiator.re, null)

  t.same(initiator.rs, rpk)

  t.deepEqual(initiator.rx, responder.tx)
  t.deepEqual(initiator.tx, responder.rx)
  t.end()
})

test('XX', t => {
  const initiator = new NoiseState('XX', true)
  const responder = new NoiseState('XX', false)

  initiator.initialise(Buffer.alloc(0))
  responder.initialise(Buffer.alloc(0))

  const message = initiator.send()
  responder.recv(message)

  const reply = responder.send()
  initiator.recv(reply)

  t.deepEqual(initiator.rx, responder.tx)
  t.deepEqual(initiator.tx, responder.rx)
  t.end()
})
