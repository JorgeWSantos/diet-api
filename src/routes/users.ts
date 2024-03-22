import { type FastifyInstance } from 'fastify';

export async function userRoutes(app: FastifyInstance) {
	app.get('/', async (request, reply) => {
		return await reply.send('ok');
	});

	app.get('/2', async (request, reply) => {
		return await reply.send('ok');
	});
};
