/* global describe, context, it, before, after */

// nock lets us fake posting a command back
// to the originating slack channel.
const nock = require('nock')
const request = require('request')
const startServer = require('../server')

require('chai').should()

describe('Pirate Joe Server', () => {
  let server = null
  // all tests run against an actual running
  // instance of the server.
  before(function (cb) {
    startServer(function (_err, _server) {
      server = _server
      return cb()
    }, {
      logger: {info: function () {}},
      port: 9999
    })
  })

  context('unauthenticated', function () {
    it('responds with a 401 if SLACK_TOKEN is incorrect', function (done) {
      process.env.SLACK_TOKEN = 'token-batman'
      request.post({
        url: 'http://localhost:9999',
        form: {
          token: 'token-robin'
        }
      }, function (err, res, body) {
        if (err) return done(err)
        res.statusCode.should.equal(401)
        return done()
      })
    })
  })

  context('authenticated', function () {
    before(function () {
      process.env.SLACK_TOKEN = 'token-batman'
    })

    it('responds with help string, if help command given', function (done) {
      // response posted to slack.
      nock('https://response.example.com')
         .post('/commands/1234/5678')
         .reply(200, function (uri, requestBody) {
           requestBody.text.should.match(/US English to US Pirate translator/)
           return done()
         })

      // post help command.
      request.post({
        url: 'http://localhost:9999',
        form: {
          token: 'token-batman',
          text: 'help',
          response_url: 'https://response.example.com/commands/1234/5678'
        }
      }, function (err, res, body) {
        if (err) return done(err)
        res.statusCode.should.equal(200)
      })
    })

    describe('flip', function () {
      it('flips a string', function (done) {
        // response posted to slack.
        nock('https://response.example.com')
           .post('/commands/1234/5678')
           .reply(200, function (uri, requestBody) {
             requestBody.text.should.equal('(╯°□°）╯︵pʃɹoʍ oʃʃǝɥ')
             return done()
           })

        // post help command.
        request.post({
          url: 'http://localhost:9999',
          form: {
            token: 'token-batman',
            text: 'flip hello world',
            response_url: 'https://response.example.com/commands/1234/5678'
          }
        }, function (err, res, body) {
          if (err) return done(err)
          res.statusCode.should.equal(200)
        })
      })
    })

    describe('pirate', function () {
      it('translates english to pirate', function (done) {
        // response posted to slack.
        nock('https://response.example.com')
           .post('/commands/1234/5678')
           .reply(200, function (uri, requestBody) {
             requestBody.text.should.equal('ahoy how be ye today')
             return done()
           })

        // post help command.
        request.post({
          url: 'http://localhost:9999',
          form: {
            token: 'token-batman',
            text: 'pirate hello how are you today',
            response_url: 'https://response.example.com/commands/1234/5678'
          }
        }, function (err, res, body) {
          if (err) return done(err)
          res.statusCode.should.equal(200)
        })
      })
    })
  })

  after(function () {
    server.close()
  })
})
