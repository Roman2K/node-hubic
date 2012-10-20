# hubiC for node.js

Client for the [hubiC][hubic] (undocumented) API. Currently only partial,
focused on the WebDAV URL and credentials.

## Usage

hubiC drives are mounted via the WebDAV protocol, as [described][protocol] by
(GR)[http://protocol-hacking.org/].

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

[hubic]: http://www.ovh.fr/hubiC/
[protocol]: http://www.protocol-hacking.org/post/2012/01/29/Hubic%2C-maintenant-vraiment-ubiquitous
