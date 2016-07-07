var tree = require('./')
var n = tree(require('random-access-file')('test.tree'), {live: true})

n.put(1, {
  size: 12,
  hash: Buffer(32).fill(1)
}, function () {
  n.get(1, console.log)
})
