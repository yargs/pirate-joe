const express = require('express')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const app = express()
const parser = require('yargs')
  .commandDir('commands')
  .demand(1)
  .strict()
  .help()

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', function (req, res) {
  let context = Object.assign({}, req.body)

  context.respond = function (msg) {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      response_type: 'in_channel',
      text: msg
    }))
  }
  context.batman = Math.random() * 100

  parser.parse(req.body.text || '', context, (err, argv, output) => {
    if (output) argv.respond(output)
  })
})

const port = process.env.PORT || 3000
app.listen(port, function (foo) {
  console.log('pirate joe bot listening on :' + port, 'beep boop')
})
