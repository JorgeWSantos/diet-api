import { type FastifyRequest, type FastifyReply } from 'fastify';
import knex from '../database.ts';

async function middleware(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    reply.status(401).send('Invalid Session');
    return;
  }

  const user = await knex('users').select('*').where('session_id', sessionId).first();

  if (!user) {
    reply.status(401).send('User Not Found');
    return;
  }

  request.user = user;
}

export default middleware;
