const flip = require('flip')
const flipGuy = '(╯°□°）╯︵'

exports.command = 'flip <strings...>'
exports.describe = "to Davy Jones' locker with ye"
exports.builder = {}
exports.handler = function (argv) {
  argv.respond(flipGuy + flip(argv.strings.join(' ')))
}
