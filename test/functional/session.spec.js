const { test, trait } = use('Test/Suite')('Session')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Factory = use('Factory')

const User = use('App/Models/User');

trait('Test/ApiClient')

test('Return Token', async ({ assert, client }) => {

    const dados = {
        email: 'kleyton.joao@gmail.com',
        password: '123456'
    }

    const user = await Factory
    .model('App/Models/User')
    .create(dados)

    console.log(user)

    const response = await client
        .post('/sessions')
        .send(dados)
        .end()

    response.assertStatus(200)
    assert.exists(response.body.token)

})
