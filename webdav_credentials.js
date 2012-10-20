const request = require('request')
    , querystring = require('querystring')
    , async = require('async');

const BASE_URL = 'https://ws.ovh.com/cloudnas/r0/ws.dispatcher';

function get(login, password, callback) {
  getSessionID(login, password, function(err, sessionID) {
    if (err) return callback(err);

    async.parallel([
      function(cb) { getURL(sessionID, cb); }
    , function(cb) { getCredentials(sessionID, cb); }
    ],
      function(err, results) {
        if (err) return callback(err);

        var url = results[0]
          , login = results[1][0]
          , password = results[1][1]
          , creds = {url: url, login: login, password: password};

        callback(null, creds);
      }
    );
  });
}

function getSessionID(login, password, callback) {
  async.waterfall([get, parseResponse, extract], callback);

  function get(cb) {
    var url = BASE_URL + '/nasLogin'
      , params = {email: login, password: password}
      , reqBody = {params: JSON.stringify(params)};

    request.post(url, {form: reqBody}, cb);
  }

  function extract(result, cb) {
    /*
     * {"answer":{"__class":"sessionType:session","language":"fr","billingCountry":"FR",
     *   "id":"paas/cloudnas-0b49[...]407f","startDate":"2012-10-20T18:25:51+02:00",
     *   "login":"ro[...]@gmail.com"},"version":"1.0","error":null,"id":0}
     */
    
    if (result.error) return cb(new Error('error from /nasLogin: ' + result.error));
    if (!result.answer || !result.answer.id) return cb(new Error('malformed response from /nasLogin'));

    cb(null, result.answer.id);
  }
}

function getURL(sessionID, callback) {
  var url = BASE_URL + '/getNas';

  async.waterfall([get, parseResponse, extract], callback);

  function get(cb) {
    request.post(BASE_URL + '/getNas', {form: {session: sessionID}}, cb);
  }

  function extract(result, cb) {
    /*
     * { answer: 
     *   { quota: 26843545600,
     *     email: 'roman.lenegrate@gmail.com',
     *     __class: 'cloudnasType:cloudNasSummary',
     *     creationDate: '2012-09-12T22:54:51+02:00',
     *     status: 'ok',
     *     used: 50688,
     *     url: 'https://cloudnas1.ovh.com/533[...]a70/',
     *     expirationDate: null,
     *     lastConnectionDate: null },
     *   version: '1.0',
     *   error: null,
     *   id: 0 }
     */

     if (result.error) return cb(new Error('error from /getNas: ' + result.error));
     if (!result.answer || !result.answer.url) return cb(new Error('malformed response from /getNas'));

     cb(null, result.answer.url);
  }
}

function getCredentials(sessionID, callback) {
  async.waterfall([get, parseResponse, extract], callback);

  function get(cb) {
    request.post(BASE_URL + '/getCredentials', {form: {session: sessionID}}, cb);
  }

  function extract(result, cb) {
    /*
     * { answer: 
     *   { __class: 'cloudnasType:cloudNasCredentials',
     *     secret: '611[...]4f5',
     *     username: 'cloudnas' },
     *   version: '1.0',
     *   error: null,
     *   id: 0 }
     */

    if (result.error)
      return cb(new Error('error from /getCredentials: ' + result.error));

    if (!result.answer || !result.answer.username || !result.answer.secret)
      return cb(new Error('malformed response from /getCredentials'));

    var login = result.answer.username
      , password = result.answer.secret;

    cb(null, login, password);
  }
}

function parseResponse(res, body, callback) {
  process.nextTick(parse);

  function parse() {
    if (res.statusCode != 200)
      return callback(new Error('unexpected response code: ' + res.statusCode));

    var result;
    try {
      result = JSON.parse(body);
    } catch (err) {
      return callback(err);
    }

    callback(null, result);
  }
}

exports.get = get;
