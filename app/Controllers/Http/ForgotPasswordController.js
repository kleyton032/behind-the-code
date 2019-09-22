'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
    async store ({ request }) {
        try {
            const email = request.input('email')
            const user = await User.findByOrFail('email', email)
        
            await Mail.send('emails.forgot', {name:user.name}, (message) => {
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
