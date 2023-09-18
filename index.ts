import { LOGGER } from "./common/logger";
import { R18 } from "./providers/r18";
import { Javdatabase } from "./providers/javdatabase";
const logger = LOGGER("bun:server");
const r18Provider = new R18();
const javdatbaseProvider = new Javdatabase();

Bun.serve({
  development: false,
  // hostname: "0.0.0.0",
  port: 8080,
  error(request) {
    logger.error({ error: request });
  },
  async fetch(request) {
    logger.debug({ request });
    const url = new URL(request.url);

    switch (request.method) {
      case "GET":
        switch (url.pathname) {
          case "/":
            return new Response(JSON.stringify(url.pathname), { status: 200 });

          case "/check":
            return new Response(JSON.stringify(url.pathname), { status: 200 });
          case "/search":
            const code = url.searchParams.get("code");
            if (!code) {
              return new Response("Missing `code` parameter [required]", {
                status: 400,
              });
            }
            switch (url.searchParams.get("provider")) {
              case "r18":
                return new Response(
                  JSON.stringify(await r18Provider.search(code)),
                  {
                    status: 200,
                  }
                );
              case "javdb":
                break;
              case "javdatabase":
                return new Response(
                  JSON.stringify(await javdatbaseProvider.search(code)),
                  {
                    status: 200,
                  }
                );
              case "javlibrary":
                break;
              case "dmn":
                // return new Response(JSON.stringify(url.searchParams), {
                //   status: 200,
                // });
                break;
            }
          default:
            if (url.searchParams.get("provider")) {
              return new Response(
                `Invalid ${url.searchParams.get("provider")} provider [required]`,
                { status: 400 }
              );
            }
            return new Response("Specify provider", { status: 400 });
        }
      case "POST":
        return new Response(JSON.stringify(url.searchParams), { status: 200 });
      default:
        return new Response(JSON.stringify(url.searchParams), { status: 200 });
    }
    return new Response(JSON.stringify(request), { status: 200 });
  },
});
