
remove-diacritics
=================

Remove diacritics/accents from a string.



Installation
------------

    $ npm install remove-diacritics


Usage
------

```javascript
const removeDiacritics = require('remove-diacritics')

let str = 'Der Bär frisst.'

console.log(removeDiacritics(str))
// Der Bar frisst.

console.log(removeDiacritics(str, 'de_DE'))
// Der Baer frisst.
```


License
-------
ISC
