const suffixes = [
  'the Red',
  'the Sour',
  'the Strong',
  'the Grumpy',
  'the Stout'
]

const prefixes = [
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
  const prefix = prefixes[parseInt(Math.random() * prefixes.length)]
  const suffix = suffixes[parseInt(Math.random() * suffixes.length)]
  argv.respond(`${argv.user_name} your pirate name is, "${prefix} ${argv.user_name} ${suffix}"`)
}
