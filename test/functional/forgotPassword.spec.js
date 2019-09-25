const Mail = use('Mail')
const Hash = use('Hash')

const { test, trait } = use('Test/Suite')('Forgot Password')

const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient')
trait('DatabaseTransactions')

//testando envio de e-mail
test('Reset Password', async ({ assert, client }) => {

    Mail.fake()

    const email = 'kleyton.joao@gmail.com',

    user = await Factory
        .model('App/Models/User')
        .create({ email })

    await client
        .post('/forgot')
        .send({ email })
        .end()

    const token = await user.tokens().first()

    const recentEmail = Mail.pullRecent()
    assert.equal(recentEmail.message.to[0].address, email)

    assert.include(token.toJSON(), {

        type: 'forgotpassword'
    }, 'object contains property');

    Mail.restore()

})

//chama uma rota /reset(example) recebendo (token, nova senha, comfirmação de senha, senha precisar mudar)
test('Reset Password created new passaword', async ({ assert, client }) => {
    const email = 'kleyton.joao@gmail.com',

    user = await Factory.model('App/Models/User').create({ email })
    const userToken = await Factory.model('App/Models/Token').make()

    await user.tokens().save(userToken)

    const response = await client
        .post('/reset')
        .send({
            token: userToken.token,
            password: '123456',
            password_confirmation: '123456'
        })
        .end()


    response.assertStatus(204)
    //refaz a releitura dos dados de user, não é necessários instanciar novamente...
    await user.reload()
    const checkPassword = await Hash.verify('123456', user.password)

    assert.isTrue(checkPassword)

})

//só vai resetar a senha  se o token estiver valido dentro de 2 horas