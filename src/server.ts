import Fastify from 'fastify';
import env from './env/index.ts';

const app = Fastify({
  logger: true
});

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.get('/get', async (request, reply) => {
  return { get: 'o' };
});

/**
 * Run the server!
 */
app
  .listen({
    port: env.PORT,
    host: 'localhost' ?? '0.0.0.0'
  })
  .then(() => { console.log('http server running at port: ' + env.PORT); })
  .catch(e => { console.log('e', e); });
