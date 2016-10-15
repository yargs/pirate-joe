const bodyParser = require('body-parser')
const express = require('express')
const request = require('request')

// configure the yargs instance used
// to parse chat messages.
const parser = require('yargs')
  .commandDir('commands')
  .demand(1)
  .strict()
  .help()

const app = express()
let logger = console

// Slack's slash commands are passed as an urlencoded
// HTTP post: https://api.slack.com/slash-commands
app.use(bodyParser.urlencoded({ extended: false }))

// slack webhook endpoint.
app.post('/', function (req, res) {
  let context = Object.assign({}, req.body)

  // slack secret token must be provided.
  if (!req.body || req.body.token !== process.env.SLACK_TOKEN) {
    return res.sendStatus(401)
  }

  // passes a respond function that that any yargs
  // command can use to respond to Slack.
  context.respond = buildResponder(req.body.response_url)

  // run the yargs parser on the inbound slack command.
  parser.parse(req.body.text || '', context, (err, argv, output) => {
    if (err) logger.error(err.message)
    if (output) argv.respond(output)
  })

  res.sendStatus(200)
})

// returns a helper function for dispatching messages
// back to Slack.
function buildResponder (responseUrl) {
  return function (msg) {
    request.post({
      url: responseUrl,
      json: true,
      body: {
        response_type: 'in_channel',
        text: msg
      }
    }, function (err, res, body) {
      if (err) return logger.error(err)
      if (res && res.statusCode >= 400) logger.error('invalid response =', res.statusCode)
      else logger.info(body)
    })
  }
}

// ping endpoint.
app.get('/', function (req, res) {
  res.send('pong')
})

// start our slack webhook server.
module.exports = function (cb, opts) {
  let port = process.env.PORT || 3000
  cb = cb || function () {}

  opts = opts || {}
  if (opts.logger) logger = opts.logger
  if (opts.port) port = opts.port

  const server = app.listen(port, function (foo) {
    if (process.env.HEROKU) keepAlive()
    logger.info('pirate joe bot listening on :' + port, 'beep boop')
    return cb(null, server)
  })
}

// ping our application every 5 minutes so
// that Heroku does not sleep it.
function keepAlive () {
  setInterval(function () {
    logger.info('pinged', process.env.APP_URL)
    request.get(process.env.APP_URL)
  }, 300000)
}
