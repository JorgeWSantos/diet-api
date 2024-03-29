import fastify from 'fastify';
import cookie from '@fastify/cookie';
import env from './env/index.ts';

import { userRoutes } from './routes/users.ts';

const app = fastify({
  logger: false
});

app.register(cookie);
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
