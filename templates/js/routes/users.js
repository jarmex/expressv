import { Router } from 'express';

import { usersController } from '../src/controllers'

const router = new Router();

/* GET users listing. */
router.get('/', usersController.users);

module.exports = router;
