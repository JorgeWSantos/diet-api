import Fastify from 'fastify';
import env from './env/index.ts';

import { userRoutes } from './routes/users.ts';

const app = Fastify({
  logger: true
});

app.register(userRoutes, { prefix: '/users' });

app.get('/', async (req, rep) => {
  return 'server is running';
});

/**
 * Run the server!
 */
app
  .listen({
    port: env.PORT,
    host: 'localhost' ?? '0.0.0.0'
  })
  .then(() => { console.log('http server running at: ' + 'http://localhost:' + env.PORT); })
  .catch(e => { console.log('e', e); });
