'use strict'

const { route } = require('@adonisjs/framework/src/Route/Manager');
const UserController = require('../app/Controllers/Http/UserController');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {

  Route.post('user/register','UserController.register')
  Route.post('user/login','UserController.login');
  Route.get('user/logout','UserController.logout').middleware(['auth']);
  Route.post('user/sendEmail','UserController.emailToRecoverAccount');
  
  Route.get('user/show','UserController.show').middleware(['auth']);
  Route.put('user/update','UserController.update').middleware(['auth']);
  Route.put('user/resetPassword/:id','UserController.resetPassword').middleware(['auth']);
  Route.delete('user/delete/:id','UserController.destroy').middleware(['auth']);
  
}).prefix('api/v1/');
