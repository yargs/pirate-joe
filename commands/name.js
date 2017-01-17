exports.suffixes = [
  'the Red',
  'the Sour',
  'the Strong',
  'the Grumpy',
  'the Stout'
]

exports.prefixes = [
  "Lil'",
  'Peg-legged',
  'Two-Legged',
  'One-Eyed',
  'Two-Eyed',
  'Four-Eyed',
  'Smelly'
]

exports.command = 'name'
exports.describe = "what's yer pirate name?"
exports.builder = {}
exports.handler = function (argv) {
  const prefix = exports.prefixes[parseInt(Math.random() * exports.prefixes.length)]
  const suffix = exports.suffixes[parseInt(Math.random() * exports.suffixes.length)]
  argv.respond(`${argv.user_name} your pirate name is, "${prefix} ${argv.user_name} ${suffix}"`)
}
