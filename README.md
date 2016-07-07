# hypercore-tree-storage

WIP: A module that stores hypercore metadata trees using a storage provider.

```
npm install hypercore-tree-storage
```

## Usage

``` js
var treeStorage = require('hypercore-tree-storage')
var storage = require('random-access-file')

var tree = treeStorage(storage('test.tree'))

tree.put(0, {
  hash: crypto.createHash('sha256').update('test').digest(),
  size: 4
}, function (err) {
  if (err) throw err
  tree.get(0, console.log)
})
```

## License

MIT
