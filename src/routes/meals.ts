import { type FastifyInstance } from 'fastify';
import knex from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import user_session from '../middlewares/user_session';

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [user_session] }, async (request, reply) => {
    try {
      const meals = await knex('meals').select('*').where('user_id', request.user.id);

      reply.status(200).send({ meals });
    } catch (error) {
      reply.status(400).send({ error });
    }
  });

  app.get('/:id', { preHandler: [user_session] }, async (request, reply) => {
    try {
      const paramsSchema = z.object({
        id: z.string()
      });

      const { id } = paramsSchema.parse(request.params);

      const meal = await knex('meals').select('*').where('id', id).first();

      reply.status(200).send({ meal });
    } catch (error) {
      reply.status(400).send({ error });
    }
  });

  app.post('/', { preHandler: [user_session] }, async (request, reply) => {
    try {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        on_diet: z.boolean(),
        date: z.string()
      });

      const user = request.user;

      const meal = createMealBodySchema.parse(request.body);

      if (meal) {
        await knex('meals').insert({
          id: randomUUID(),
          user_id: user.id,
          date: new Date(meal.date),
          description: meal.description,
          name: meal.name,
          on_diet: meal.on_diet
        });
      }

      reply.status(201).send();
    } catch (error) {
      reply.status(400).send({ error });
    }
  });

  app.put('/:id', { preHandler: [user_session] }, async (request, reply) => {
    try {
      const paramsSchema = z.object({ id: z.string() });

      const { id } = paramsSchema.parse(request.params);

      console.log('id', id);

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        on_diet: z.boolean(),
        date: z.string()
      });

      // const user = request.user;

      const { date, description, name, on_diet } = createMealBodySchema.parse(request.body);

      const mealExist = await knex('meals').select('*').where('id', id);

      if (!mealExist) {
        return await reply.status(400).send('Meal not found');
      }

      await knex('meals').where('id', id).update({
        date: new Date(date), description, name, on_diet
      });

      reply.status(204).send();
    } catch (error) {
      console.log('error', error);
      reply.status(400).send({ error });
    }
  });

  app.delete('/:id', { preHandler: [user_session] }, async (request, reply) => {
    try {
      const paramsSchema = z.object({
        id: z.string()
      });

      const { id } = paramsSchema.parse(request.params);

      await knex('meals').where('id', id).del();

      reply.status(204).send();
    } catch (error) {
      reply.status(400).send({ error });
    }
  });

  app.get('/metrics', { preHandler: [user_session] }, async (request, reply) => {
    try {
      const allMeals = await knex('meals').select('*').where('user_id', request.user.id);

      const total = allMeals.length;

      const onDiet = allMeals.filter(m => (m.on_diet)).length;
      const outDiet = allMeals.filter(m => (!m.on_diet)).length;

      const { bestOnDietSequence } = allMeals.reduce(
        (acc, meal) => {
          if (meal.on_diet) {
            acc.currentSequence += 1;
          } else {
            acc.currentSequence = 0;
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence;
          }

          return acc;
        },
        { bestOnDietSequence: 0, currentSequence: 0 }
      );

      reply.status(200).send({
        metrics: {
          total,
          on_diet: onDiet,
          out_diet: outDiet,
          best_sequence: bestOnDietSequence
        }
      });
    } catch (error) {
      reply.status(400).send({ error });
    }
  });
}
