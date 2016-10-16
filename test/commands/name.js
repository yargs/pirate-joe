/* global describe, it */

const name = require('../../commands/name')

require('chai').should()

describe('Name Command', () => {
  it('generates a random pirate name', (done) => {
    name.handler({
      user_name: 'bcoe',
      respond: (msg) => {
        msg.should.match(/bcoe your pirate name is/)
        return done()
      }
    })
  })
})
