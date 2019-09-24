const Mail = use('Mail')
const Hash = use('Hash')

const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Forgot Password')

const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient')
trait('DatabaseTransactions')

beforeEach(() => {
    Mail.fake()
})

afterEach(() => {
    Mail.restore()
})

async function generateTokenForgot(client, email) {
    const user = await Factory
        .model('App/Models/User')
        .create({ email })

    await client
        .post('/forgot')
        .send({ email })
        .end()

    const token = await user.tokens().first()
    
    return token

}

//testando envio de e-mail
test('Reset Password', async ({ assert, client }) => {
    const email = 'kleyton.joao@gmail.com',
        token = await generateTokenForgot(client, email)

    const recentEmail = Mail.pullRecent()
    assert.equal(recentEmail.message.to[0].address, email)

    assert.include(token.toJSON(), {

        type: 'forgotpassword'
    }, 'object contains property');

})

//chama uma rota /reset(example) recebendo (token, nova senha, comfirmação de senha, senha precisar mudar)
test('Reset Password created new passaword', async ({ assert, client }) => {
    const email = 'kleyton.joao@gmail.com',
    { token }   = await generateTokenForgot(client, email)

    console.log(token)
    const response = await client
        .post('/reset')
        .send({
            token,
            password: '123456',
            password_confirmation: '123456'
        })
        .end()

  
    response.assertStatus(204)
    const user = await User.findBy('email', email)
    const checkPassword = await Hash.verify('123456', user.password)

    assert.isTrue(checkPassword)

})

//só vai resetar a senha  se o token estiver valido dentro de 2 horas