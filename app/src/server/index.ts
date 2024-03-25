import app from './app';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const server = createServer(app);

app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 4568);

const prisma = new PrismaClient();

server.listen(app.get('port'), app.get('host'), async () => {
  console.log(
      `User services server started!: ${app.get('host')}:${app.get('port')}`
  );
});

const shutDown = () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('beforeExit', shutDown);
process.on('exit', shutDown);

export default app;
