const hubic = require('./index')
    , async = require('async')
    , program = require('commander');

program
  .option('-l, --login <login>', 'hubiC login (e-mail address)')
  .parse(process.argv);

async.series({login: askLogin, password: askPassword}, fetch);

function askLogin(cb) {
  var login = program.login;
  if (login) return process.nextTick(function() { cb(null, login); });
  program.prompt('hubiC login: ', function(l) { cb(null, l); });
}

function askPassword(cb) {
  program.password('hubiC password: ', function(p) {
    cb(null, p);
  });
}

function fetch(err, results) {
  if (err) throw err;

  var login = results.login
    , password = results.password;

  hubic.getWebdavCredentials(login, password, function(err, creds) {
    if (err) throw err;
    console.log('url =', creds.url);
    console.log('login =', creds.login);
    console.log('password =', creds.password);
  });
}
