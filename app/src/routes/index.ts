import { Router } from 'express';
import { appRouter } from './api';

const router = Router();

router.use('/v1', appRouter);

export { router };