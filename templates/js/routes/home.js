import { Router } from 'express';

import { homeController } from '../src/controllers'

const router = new Router();

/* GET users listing. */
router.get('/', homeController.homepage);

module.exports = router;
