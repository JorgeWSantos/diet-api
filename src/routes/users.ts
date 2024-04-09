import { type FastifyInstance } from 'fastify';
import knex from '../database';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import user_session from '../middlewares/user_session';

export async function userRoutes(app: FastifyInstance) {
	app.get('/', async (request, reply) => {
		const users = await knex('users').select('*');

		return await reply.send({ users });
	});

	app.get('/find', { preHandler: [user_session] }, async (request, reply) => {
		const user = request.user;

		return await reply.send({ user });
	});

	app.post('/', async (request, reply) => {
		try {
			const createUserBodySchema = z.object({
				name: z.string(),
				email: z.string().email(),
				password: z.string()
			});

			const { name, email, password } = createUserBodySchema.parse(request.body);

			let sessionId = request.cookies.sessionId;

			if (!sessionId) {
				sessionId = randomUUID();

				reply.setCookie('sessionId', sessionId, {
					path: '/',
					maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
				});
			}

			const userEmailExists = await knex('users').where({ email }).first();

			if (userEmailExists) {
				return await reply.status(400).send({ message: 'User already exists' });
			}

			await knex('users').insert({
				id: randomUUID(),
				name,
				email,
				password,
				session_id: sessionId
			});

			return await reply.status(201).send();
		} catch (error) {
			console.log('erro', error);
			return await reply.status(400).send(error);
		}
	});

	app.delete('/', { preHandler: [user_session] }, async (request, reply) => {
		const user = request.user;

		await knex('users').where('id', user.id).del();

		return await reply.status(204).send();
	});
};
