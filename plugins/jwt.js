import fp from "fastify-plugin";
import jwtPlugin from "@fastify/jwt";

export default fp(async (fastify, opts) => {
  fastify.register(jwtPlugin, {
    // секрет используемый для шифрования
    // правильно передавать через переменные окружения
    // https://github.com/fastify/fastify-env
    secret: "supersecret",
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
