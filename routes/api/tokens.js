import * as schemas from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async function (fastify) {
  const { db } = fastify;

  fastify.post("/tokens", async (request, reply) => {
    const client = await db.query.users.findFirst({
      where: eq(schemas.users.email, request.body.email),
    });

    fastify.assert.ok(client, 401, "Invalid email or password");
    const token = fastify.jwt.sign({ id: client.id, email: client.email }, { expiresIn: "1h" });
    return reply.code(201).send({ token });
  });
}
