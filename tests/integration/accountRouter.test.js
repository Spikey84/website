const express = require('express')
const supertestSession = require("supertest-session")
const fafApp = require('../../fafApp')

let testSession = null
beforeEach(() => {
    const app = new express()
    fafApp.setup(app)
    fafApp.loadRouters(app)
    testSession = supertestSession(app)
})

describe('Account Routes', function () {
    const publicUrls = [
        '/account/requestPasswordReset',
        '/account/password/confirmReset',
        '/account/register',
        '/account/activate'
    ]

    test.each(publicUrls)("responds with OK to %p", (async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(200)
    }))
    
    test('redirect old pw-reset routes', async () => {
        const response = await testSession.get('/account/password/reset')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/account/requestPasswordReset')
    })
    
    
    const protectedUrls = [
        '/account/linkGog',
        '/account/report',
        '/account/changePassword',
        '/account/changeEmail',
        '/account/changeUsername',
        '/account/resync',
        '/account/link',
        '/account/connect',
        '/account/create'
    ]

    test.each(protectedUrls)("%p responds with redirect to login", (async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(302)
    }))
})
