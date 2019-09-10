const { test, trait } = use('Test/Suite')('Session')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const User = use('App/Models/User');

trait('Test/ApiClient')

test('Return Token', async ({ assert, client }) => {
    const user = await User.create({
        name: 'Kleyton João',
        email: 'kleyton.joao@gmail.com',
        password: '123456'
    });

    const response = await client
    .post('/sessions')
    .send({
        email: 'kleyton.joao@gmail.com',
        password: '123456'
    })
    .end()

    //console.log(response)
    response.assertStatus(200)
    assert.exists(response.body.token)
    
})
