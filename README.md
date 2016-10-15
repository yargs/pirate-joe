# Pirate Joe

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![js-standard-style][standard-image]][standard-url]
[![standard-version][standard-version-image]][standard-version-url]

Yargs' slack-bot Pirate Joe, the eternal optimist.

![Joe was one optimistic pirate.](http://i.imgur.com/4WFGVJ9.png)

## Building Slack a Slack-Bot with yargs

yargs, with its new [headless `parse()`](https://github.com/yargs/yargs#parseargs-context-parsecallback) feature and its powerful command
parsing functionality, is a great tool for building a chat-bot.

The [Pirate Joe sample project](https://github.com/yargs/pirate-joe/blob/master/server.js) and accompanying tutorial provide the foundation you need to get a chat-bot up in running in Slack using yargs.

### Parsing Incoming Messages

We've implemented Pirate Joe as a [Slack slash-command](https://api.slack.com/slash-commands). When
a user types `/joe` in any of yargs' slack channels, a webhook is posted to whatever URL you configure.

To process this webhook we created a [minimal express application](https://expressjs.com/en/starter/hello-world.html), with the the following `post` handler:

```js
const bodyParser = require('body-parser')
const express = require('express')

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

  // provides a respond function that any yargs
  // command can use to respond to Slack.
  context.respond = buildResponder(req.body.response_url)

  // run the yargs parser on the inbound slack command.
  parser.parse(req.body.text || '', context, (err, argv, output) => {
    if (err) logger.error(err.message)
    if (output) argv.respond(output)
  })

  res.send('')
})
```

`bodyParser` processes the inbound webhook from Slack and populates three
variables that are important to us:

* **req.body.token:** the shared secret between our application and
  and Slack. This allows us to verify that the post originated from Slack.
* **req.body.text:** the text that the user typed into the Slack channel.
* **req.body.response_url:** the URL that your bot's response will be posted to.

### Responding to Slack

Slack provides a `response_url` in their webhook for a bot to post their response to.
Before passing `req.body.text` to yargs for processing, we populate a helper function that
allows yargs commands to easily send messages back to Slack:

```js
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
```

### Parsing the message with yargs

Creating a yargs instance for processing chat messages is almost identical to how you
would configure it for a command line application:

We begin by configuring the parser in the abstract:

```js
const parser = require('yargs')
  .usage('/joe [command]')
  .commandDir('commands')
  .demand(1)
  .strict()
  .help()
  .epilog("yargs' slack-bot Pirate Joe")
```

[`yargs.commandDir('commands')`](https://github.com/yargs/yargs#commanddirdirectory-opts) indicates that
we should load all the chat commands located in `/commands`.

We create a command module for each of our chat commands. Here's the module for translating English
strings to Pirate strings:

```js
const pirateSpeak = require('pirate-speak')

exports.command = 'pirate <strings...>'
exports.describe = 'US English to US Pirate translator'
exports.builder = {}
exports.handler = function (argv) {
  argv.respond(pirateSpeak.translate(argv.strings.join(' ')))
}
```

With the yargs instance configured, we now simply run  [`parse()`](https://github.com/yargs/yargs#parseargs-context-parsecallback) on each
of the inbound messages from Slack:

```js
context.respond = buildResponder(req.body.response_url)
parser.parse(req.body.text || '', context, (err, argv, output) => {
  if (err) logger.error(err.message)
  if (output) argv.respond(output)
})
```

Again, by providing the `context.respond` method, we provide yargs' commands a
mechanism for sending messages back to Slack.

If any default output has been logged by yargs (perhaps `help` was executed), the
`parse()` function itself dispatches this message back to Slack.

### Deploying Your Application

The easiest way to get your slack-bot up and running is to create a Heroku application.
A [wonderful interactive tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) is
available on this topic here.

Once your application in in the wild, visit:

`https://[your-slack].slack.com/apps/manage/custom-integrations`

And configure a new [Slash Command](https://api.slack.com/slash-commands) for your application.

## License

ISC

[travis-url]: https://travis-ci.org/yargs/pirate-joe
[travis-image]: https://img.shields.io/travis/yargs/pirate-joe/master.svg
[coveralls-url]: https://coveralls.io/github/yargs/pirate-joe
[coveralls-image]: https://img.shields.io/coveralls/yargs/pirate-joe.svg
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[standard-version-image]: https://img.shields.io/badge/release-standard%20version-brightgreen.svg
[standard-version-url]: https://github.com/conventional-changelog/standard-version
