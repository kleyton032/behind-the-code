'use strict'

const { test } = use('Test/Suite')('Example')

test('test example 2 + 2 is 4', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})
