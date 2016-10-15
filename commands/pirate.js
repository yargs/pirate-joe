const pirateSpeak = require('pirate-speak')

exports.command = 'pirate <strings...>'
exports.describe = 'US English to US Pirate translator'
exports.builder = {}
exports.handler = function (argv) {
  argv.respond(pirateSpeak.translate(argv.strings.join(' ')))
}
