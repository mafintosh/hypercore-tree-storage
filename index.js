var uint64be = require('uint64be')

module.exports = Tree

function Tree (storage, opts) {
  if (!(this instanceof Tree)) return new Tree(storage, opts)
  if (!opts) opts = {}

  this.storage = storage
  this.live = !!opts.live
}

Tree.prototype.get = function (i, cb) {
  var leaf = this.live && !(i & 1)
  var offset = 40 * i + 32 * (this.live ? Math.ceil(i / 2) : 0)
  var length = leaf ? 72 : 40

  this.storage.read(offset, length, function (err, buf) {
    if (err) return cb(err)

    var hash = buf.slice(0, 32)
    var size = uint64be.decode(buf, 32)

    if (!size && isNil(hash)) return cb(new Error('Index not found'))

    cb(null, {
      index: i,
      hash: hash,
      size: size,
      signature: leaf ? buf.slice(40) : null
    })
  })
}

Tree.prototype.put = function (i, node, cb) {
  if (!cb) cb = noop

  var leaf = this.live && !(i & 1)
  var length = leaf ? 72 : 40
  var offset = 40 * i + 32 * (this.live ? Math.ceil(i / 2) : 0)
  var buf = Buffer(length)

  node.hash.copy(buf, 0)
  uint64be.encode(node.size, buf, 32)
  if (leaf) node.signature.copy(buf, 40)
  this.storage.write(offset, buf, cb)
}

function noop () {}

function isNil (buf) {
  for (var i = 0; i < buf.length; i++) {
    if (buf[i]) return false
  }
  return true
}

