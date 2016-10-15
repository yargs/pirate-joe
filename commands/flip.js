const flip = require('flip')
const flipGuy = '(╯°□°）╯︵'

exports.command = 'flip <strings...>'

exports.describe = "to davy jones' locker with ye"

exports.builder = {}

exports.handler = function (argv) {
  argv.respond(flip(argv.strings.join(' ')))
}
