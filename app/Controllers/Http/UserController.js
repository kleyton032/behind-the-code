'use strict'

class UserController {
    async authentication({ request, response, auth }) {
        const { email, password } = request.only([
            'email',
            'password'
        ])

        const { token } = await auth.attempt(email, password)
        return { token }
    }
}

module.exports = UserController
