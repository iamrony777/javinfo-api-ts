import createFastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import { searchRouter } from "./api/search";
import { checkRouter } from "./api/check";

const buildFastify = async (
  options: FastifyServerOptions = {}
): Promise<FastifyInstance> => {
  const fastifyRequestLogger = (await import("@mgcrea/fastify-request-logger"))
    .default;

  let fastify: FastifyInstance;

  if (process.env.LOGTAIL_TOKEN) {
    fastify = createFastify({
      logger: {
        level: "debug",
        transport: {
          target: "@logtail/pino",
          options: {
            sourceToken: process.env.LOGTAIL_TOKEN,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname,plugin",
          },
        },
      },
      ...options,
    });
  } else {
    fastify = createFastify({
      logger: {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname,plugin",
          },
        },
      },
      ...options,
    });
  }

  fastify.register(fastifyRequestLogger);

  return fastify;
};

(async () => {
  const app = await buildFastify();
  app.register(searchRouter, { prefix: "/search" });
  app.register(checkRouter, { prefix: "/check" });
  app.get("/ping", (req, res) => {
    res.send("pong");
  });

  app.listen({ port: parseInt(process.env.PORT || "3000") }).then(() => {
	// @ts-ignore
    console.log(`server listening on port ${app.server.address()?.port}`);
  });
})();
