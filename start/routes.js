'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
    return { greeting: 'Hello world in JSON' }
})

//Auth
Route
    .group(() => {
        Route.post('auth/register', 'AuthController.register')
        Route.post('auth/login', 'AuthController.login')
        Route.get('user/data', 'AuthController.getProfile').middleware(['auth'])
    })
    .prefix('api/v1')

//Category
Route
    .group(() => {
        Route.post('category', 'CategoryController.store')
        Route.get('category', 'CategoryController.index')
        Route.get('category/:id', 'CategoryController.show')
    })
    .prefix('api/v1')