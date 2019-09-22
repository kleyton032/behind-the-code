const Mail = use('Mail')

const { test, trait } = use('Test/Suite')('Forgot Password')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Factory = use('Factory')

const User = use('App/Models/User');

trait('Test/ApiClient')
trait('DatabaseTransactions')

//testando envio de e-mail
test('Reset Password', async ({ assert, client }) => {

    Mail.fake()

    const dados = {
        email: 'kleyton.joao@gmail.com',
    }

    await Factory
    .model('App/Models/User')
    .create(dados)

    const response = await client
        .post('/forgot')
        .send(dados)
        .end()
      
        response.assertStatus(204)
        const recentEmail = Mail.pullRecent()
        assert.equal(recentEmail.message.to[0].address, dados.email)
        Mail.restore()

})
