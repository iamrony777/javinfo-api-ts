// import { LOGGER as logger } from "./handlers/logger";

Bun.serve({
  development: false,
  hostname: "0.0.0.0",
  port: 8080,
  error(request) {
    console.error({ error: request });
  },
  fetch(request) {
    console.debug({ request });
    const url = new URL(request.url);

    switch (request.method) {
      case "GET":
        switch (url.pathname) {
          case "/":
            return new Response(JSON.stringify(url.pathname), { status: 200 });

          case "/check":
            return new Response(JSON.stringify(url.pathname), { status: 200 });
          case "/search":
            switch (url.searchParams.get("provider")) {
            case "r18":
            case "javdb":
            case "javdatabase":
            case "javlibrary":
            case "dmn":
              return new Response(JSON.stringify(url.searchParams), { status: 200 });
            }
          default:
            return new Response("Not Found / Not implemented", { status: 404 });
        }
      case "POST":
        return new Response(JSON.stringify(url.searchParams), { status: 200 });
      default:
        return new Response(JSON.stringify(url.searchParams), { status: 200 });
    }
    return new Response(JSON.stringify(request), { status: 200 });
  },
});
