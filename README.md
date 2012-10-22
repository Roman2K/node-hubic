# hubiC for node.js

Client for the [hubiC][hubic] (undocumented) API. Currently only partial,
focused on the WebDAV URL and credentials.

## Example

See `example/`:

```bash
$ node example/webdav_credentials.js
```

## Usage

hubiC drives are mounted via the WebDAV protocol, as [described][protocol] by
[GR](http://protocol-hacking.org/).

The URL, login and password can be fetched as follows:

```javascript
const hubic = require('hubic');

var login = '<your-email-address>'
  , password = '<your-password>';

hubic.getWebdavCredentials(login, password, function(err, creds) {
  if (err) throw err;
  console.log('url =', creds.url);
  console.log('login =', creds.login);
  console.log('password =', creds.password);
});
```

### Specifying a proxy

In order to fetch WebDAV info, `getWebdavCredentials()` makes HTTP requests to
OVH. In order to pass through a proxy, specify a `request` module with the
defaults overridden:

```javascript
var proxiedRequest = request.defaults({proxy: 'http://my-proxy:3128'});
hubic.getWebdavCredentials(login, password, {request: proxiedRequest}, callback);
```

[hubic]: http://www.ovh.fr/hubiC/
[protocol]: http://www.protocol-hacking.org/post/2012/01/29/Hubic%2C-maintenant-vraiment-ubiquitous
