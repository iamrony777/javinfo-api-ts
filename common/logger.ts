import { pino } from 'pino';
import { PrettyOptions } from 'pino-pretty';
import type { Level, LevelWithSilent } from 'pino';

const LOG_LEVEL =
	process.env.LOG_LEVEL || process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev' ? 'debug' : 'info';

// TODO: i'm trying to log into `logs/${name}.log` always with level debug , but it follows
export const LOGGER = (name: string, level?: Level | LevelWithSilent, options?: PrettyOptions) =>
	pino(
		{
			name,
			level: 'debug',
		},
		pino.transport({
			targets: [
				{
					level: 'debug',
					target: 'pino-pretty',
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
					target: 'pino-pretty',
					options: { levelFirst: true, colorize: true, ...options },
				},
			],
		})
	);

// const L = LOGGER('baileys-bottle', 'info');