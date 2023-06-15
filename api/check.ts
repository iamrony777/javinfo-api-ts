import {
  FastifyInstance,
  FastifyServerOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import got from "got-cjs";
// @ts-ignore

async function checkStatus(url: string) {
  const headers = {
    // User agent, Cache Control and Accept headers are required
    // User agent is populated by a random UA.
    "User-Agent":
      "Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36",
    "Cache-Control": "private",
    Accept:
      "application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5",
  };
  // @ts-ignore
  const { statusCode } = await got.get(url, {
    throwHttpErrors: false,
    headers,
    timeout: { request: 5 * 1000 },
    http2: true,
  });
  return { url, statusCode };
}

export async function checkRouter(
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    const urls = [
      "https://r18.dev",
      "https://www.javlibrary.com/en/",
      "https://www.javdatabase.com/",
    ];

    const results = [];
    for (const url of urls) {
      const result = await checkStatus(url);
      results.push(result);
    }

    res.status(200).send(results);
  });

  fastify.post(
    "/",
    async (
      req: FastifyRequest<{ Body: { url: string } }>,
      res: FastifyReply
    ) => {
      const rawUrl: string = req.body.url;
      const urlRegex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/gi;

      if (rawUrl.match(urlRegex)) {
        const result = await checkStatus(rawUrl);
        res.status(result.statusCode).send(result);
      } else {
        res.status(400).send({ message: "Invalid URL" });
      }
    }
  );
}
