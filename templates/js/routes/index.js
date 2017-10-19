'use strict'

import home from './home';
import users from './users';

export default (app) =>{
  app.use('/', home);
  app.use('/users', users);
}