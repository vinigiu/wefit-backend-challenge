import AppError from '../libs/errors/AppError';
import express, { Request, Response, NextFunction } from 'express';
import log from '../libs/providers/LogProvider';
import rateLimit from 'express-rate-limit';
import { router } from '../routes';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger_output.json';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Request limit reached by this IP. Try again later.',
});

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(limiter);

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/', router);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);
  log('error', err.message, err.stack);

  return response.status(500).json({
    status: 'error',
    message: err.message,
  });
});

export default app;
