import { Router } from 'express';
import testController from '../controllers/test';
import authController from '../controllers/auth';

const api = Router()
    .use(authController)
    .use(testController);

export default Router().use('/api', api)