## Add distractions

A small set of defaults come bundled with fokus. Here is the simplest
usage just blocking default links.

```
sudo fokus
```

And you can also specify your own links from a file.
The file need to export an array of links, like this

```js
module.exports = [
 "www.facebook.com",
 "www.connoratherton.com"
]
```

And use the `-u` option followed by the file..
```
sudo fokus -u /path/to/file
```

Use a custom file and no defaults

```
sudo fokus -u /path/to/file --no-defaults
```

## Stop distractions

To restore your /etc/hosts back to its original state run the following
command. All traces of fokus will be gone.

```
sudo fokus --kill
```

You have to use sudo to modify /etc/hosts. I mainly use this
myself, but if you want to use it check out the source beforehand
so you understand what it does.

Note: You might have to clear you DNS cache.

```
sudo dscacheutil -flushcache
```
