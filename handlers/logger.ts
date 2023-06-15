import { HttpLogger, pinoHttp } from "pino-http";
import P, { Logger } from "pino";
import pretty from "pino-pretty";

let LOGGER: HttpLogger | any

if (process.env.LOGTAIL_TOKEN) {
  const LOGGER = pinoHttp({
    transport: {
      target: "@logtail/pino",
      options: { sourceToken: process.env.LOGTAIL_TOKEN },
    },
    customSuccessMessage: function (req, res) {
      return `${req.headers.host} - ${res.statusCode} - ${req.method}"`;
    },
    // Define a custom receive message
    customReceivedMessage: undefined,
  });
} else {
  const LOGGER = (name?: string, level?: string) =>
    P(
      { level: level || process.env.LOG_LEVEL || 'debug', name: name },
      pretty({
        levelFirst: true,
        colorize: true,
      })
    );
}

export { LOGGER } // unused