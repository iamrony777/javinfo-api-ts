import { pino } from "pino";
import type { PrettyOptions } from "pino-pretty";
import type { Level, LevelWithSilent } from "pino";
import "dotenv/config"
const LOG_LEVEL =
  process.env.LOG_LEVEL ||
  process.env.NODE_ENV == "development" ||
  process.env.NODE_ENV == "dev"
    ? "debug"
    : "info";

export const LOGGER = (
  name: string,
  level?: Level | LevelWithSilent,
  options?: PrettyOptions
) =>
  pino(
    {
      name,
      level: "debug",
    },
    pino.transport({
      targets: [
        {
          level: "debug",
          target: "pino-pretty",
          options: {
            destination: `logs/${name}.log`,
            colorize: false,
            append: false,
            mkdir: true,
            ...options,
          },
        },
        {
          level: level || LOG_LEVEL,
          target: "pino-pretty",
          options: { levelFirst: true, colorize: true, ...options },
        },
        {
          target: "@logtail/pino",
          level: "info",
          options: {
            levelFirst: true,
            colorize: true,
            sourceToken: process.env.LOGTAIL_TOKEN,
            // customSuccessMessage: (req?: any, res?: any) => {
            //   // return `${req.headers.host} - ${res.statusCode} - ${req.method}"`;
            // },
            // customReceivedMessage: undefined,
          },
        },
      ],
    })
  );

// console.log(import.meta.file.replace(/\.ts$/, ''))
// const L = LOGGER('baileys-bottle', 'info');
// L.info('hello');
