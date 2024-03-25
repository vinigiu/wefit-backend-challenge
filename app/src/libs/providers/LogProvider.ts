import path from 'path';
import _ from 'lodash';
import winston from 'winston';

const log = (name: string, message: string, options: any): void => {
  try {
    let opt = options;
    let level: any = name;
    const valids = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];
    if (!valids.includes(name)) {
      level = 'debug';
    }
    const loggerOptions: any = {
      level,
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: path.join(__dirname, '../../../logs', `${name}.log`),
        }),
      ],
    };
    const logger = winston.createLogger(loggerOptions);
    if (!_.isObject(opt)) {
      opt = { options };
    }
    opt.date = new Date();
    logger.log(level, message, { data: opt });
  } catch (error) {
    console.log('@logError:', error);
  }
};

export default log;