import FastifyRequest from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      name: string
      created_at: string
      email: string
      password: string
      session_id: string
    }
  }
}
