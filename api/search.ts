import {
  FastifyInstance,
  FastifyServerOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

const ALL_PROVIDERS = ["r18", "javdb", "javdatabase", "javlibrary", "dmn"];
const AVAILABLE_PROVIDERS = ["r18"];

import r18 from "../providers/r18.undici";
import { isResponse } from "../common/snippets";
import type { error, response } from "../common/types";

interface SearchRequestBody {
  provider: string;
  code: string;
}

export async function searchRouter(
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.post(
    "/",
    async (
      req: FastifyRequest<{ Body: SearchRequestBody }>,
      res: FastifyReply
    ) => {
      if (typeof req.body.provider === "string") {
        if (
          AVAILABLE_PROVIDERS.includes(req.body.provider) ||
          ALL_PROVIDERS.includes(req.body.provider)
        ) {
          let result: response | error | undefined;

          switch (req.body.provider) {
            case "r18":
              result = await r18.search(req.body.code);

              if (isResponse(result)) {
                res
                  .status(200)
                  .header(
                    "Cache-Control",
                    "s-max-age=1, stale-while-revalidate"
                  )
                  .send(result);
                return;
              } else {
                res.status(404).send({
                  error: `${req.body.code} not found`,
                });
                return;
              }

            default:
              res.status(401).send({
                message: `${req.body.provider} is available on PRO or higher plans`,
              });
              return;
          }
        } else {
          res.status(406).send({
            error: `${
              req.body.provider
            } not found, available providers: ${ALL_PROVIDERS.join(", ")}`,
          });
          return;
        }
      } else {
        res.status(400).send({
          error: "provider must be a string",
        });
        return;
      }
    }
  );
}
