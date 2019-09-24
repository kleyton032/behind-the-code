'use strict'
const { randomBytes } = require('crypto')
const { promisify } = require('util')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')
const Mail = use('Mail')
const Env = use('Env')


class ForgotPasswordController {
    async store({ request }) {
        try {
            const email = request.input('email')
            const user = await User.findByOrFail('email', email)

            const random = await promisify(randomBytes)(24)
            const token = random.toString('hex')
            console.log(token)

            await user.tokens().create({
                token,
                type: 'forgotpassword'
            })

            const resetPasswordUrl = `${Env.get('FRONT_URL')}/reset?token=${token}`

            await Mail.send('emails.forgot', { name: user.name, resetPasswordUrl }, (message) => {
                message
                    .to(user.email)
                    .from('kleyton_032@hotmail.com')
                    .subject('Test - Recuperação de Senha')
            })
        } catch (error) {
            console.log(error)
        }

    }
}


module.exports = ForgotPasswordController
