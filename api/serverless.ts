import type { response, error } from "../common/types";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import r18 from "../handlers/r18.undici";
import { isError, isResponse } from "../common/snippets";

const ALL_PROVIDERS = ["r18", "javdb", "javdatabase", "javlibrary", "dmn"];
const AVAILABLE_PROVIDERS = ["r18"];

export default async function (req: VercelRequest, res: VercelResponse) {
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
            res.setHeader(
              "Cache-Control",
              "s-max-age=1, stale-while-revalidate"
            );
            res.status(200).send(result);
          } else {
            res.status(404).send({
              error: `${req.body.code} not found`,
            });
          }

          break;
        default:
          res.status(401).send({
            message: `${req.body.provider} is available on PRO or higher plans`,
          });
      }
    } else {
      res.status(406).send({
        error: `${
          req.body.provider
        } not found, available providers: ${ALL_PROVIDERS.join(", ")}`,
      });
    }
  } else {
    res.status(400).send({
      error: "provider must be a string",
    });
  }
}
