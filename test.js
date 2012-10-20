const hubic = require('./index');

var login = '<your-email-address>'
  , password = '<your-password>';

hubic.getWebdavCredentials(login, password, function(err, creds) {
  if (err) throw err;
  console.log('url =', creds.url);
  console.log('login =', creds.login);
  console.log('password =', creds.password);
});
