import path from "node:path";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import { errors } from "@vinejs/vine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

export default async function (fastify, opts) {
  // Place here your custom code!

  fastify.setErrorHandler(function (error, _request, reply) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      const errorDetail = {
        status: 422,
        title: "Validation Error",
        detail: "Errors related to business logic such as uniqueness",
        errors: error.messages,
      };
      reply.code(422).send(errorDetail);
    } else {
      reply.send(error);
    }
  });

  const api = fastify.setValidatorCompiler(TypeBoxValidatorCompiler).withTypeProvider();
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  api.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  api.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
}
