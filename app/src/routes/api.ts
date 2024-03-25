import { Router } from 'express';
import UserController from '../controllers/UserController';
import CheckAndValidations from '../middlewares/ChecksAndValidations';

const appRouter = Router();

const userController = new UserController();
const checkAndValidations = new CheckAndValidations();

appRouter.post(
    '/user', 
    checkAndValidations.checkMandatoryData, 
    checkAndValidations.validateData, 
    userController.create
)

appRouter.get(
    '/ping',
    (req, res) => {
        return res.send('pong');
    }
);

export { appRouter };