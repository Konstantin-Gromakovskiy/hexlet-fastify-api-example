import { asc, eq } from "drizzle-orm";
import * as schemas from "../../db/schema.js";
import { schema } from "../../schema.js";

export default async function (fastify) {
  const db = fastify.db;

  fastify.get(
    "/users",
    { onRequest: [fastify.authenticate], schema: { querystring: schema["/users"].GET.args.properties.query } },
    async (request, reply) => {
      const perPage = 1;
      const { page = 1 } = request.query;
      const users = await db.query.users.findMany({
        orderBy: asc(schemas.users.id),
        limit: perPage,
        offset: (page - 1) * perPage,
      });
      return users;
    },
  );

  fastify.get(
    "/users/:id",
    { onRequest: [fastify.authenticate], schema: schema["/users/{id}"].GET.args.properties },
    async (request, reply) => {
      const { id } = request.params;
      const user = await db.query.users.findFirst({
        where: eq(schemas.users.id, Number(id)),
      });

      fastify.log.info("user", user);
      fastify.assert(user, 404, `User with id ${id} not found`);
      return user;
    },
  );

  fastify.post(
    "/users",
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: schema["/users"].POST.args.properties.body,
        response: {
          201: schema["/users"].POST.data,
        },
      },
    },
    async (request, reply) => {
      const { fullName, email } = request.body;
      const [user] = await db.insert(schemas.users).values({ fullName, email }).returning();

      return reply.code(201).send(user);
    },
  );

  fastify.patch(
    "/users/:id",
    { onRequest: [fastify.authenticate], schema: schema["/users/{id}"].PATCH.args.properties },
    async (request, reply) => {
      const { id } = request.params;
      const { body } = request;
      const [user] = await db
        .update(schemas.users)
        .set(body)
        .where(eq(schemas.users.id, Number(id)))
        .returning();

      fastify.assert(user, 404, `User with id ${id} not found`);
      return user;
    },
  );

  fastify.delete(
    "/users/:id",
    { onRequest: [fastify.authenticate], schema: schema["/users/{id}"].DELETE.args.properties },
    async (request, reply) => {
      const [user] = await db.delete(schemas.users).where(eq(schemas.users.id, request.params.id)).returning();
      fastify.assert(user, 404);
      return reply.code(204).send();
    },
  );
}
