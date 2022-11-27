import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logDir = 'logs'; // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf } = winston.format;

// Log Format
const logFormat = printf((info) => {
	return `${info.timestamp} > [${info.level}]: ${info.message}`;
});

const Log = winston.createLogger({
	format: combine(
		timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		logFormat,
	),
	transports: [
		// %DATE%.log
		new winstonDaily({
			level: 'info',
			datePattern: 'YYYY-MM-DD',
			dirname: logDir,
			filename: `%DATE%.log`,
			maxFiles: 30, // 30일치 로그 파일 저장
			zippedArchive: true,
		}),

		// %DATE%.error.log
		new winstonDaily({
			level: 'error',
			datePattern: 'YYYY-MM-DD',
			dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
			filename: `%DATE%.error.log`,
			maxFiles: 30,
			zippedArchive: true,
		}),
	],
});

// Non-Production option
if (process.env.NODE_ENV !== 'production') {
	Log.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(), // 색깔 넣어서 출력
				winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
			),
		}),
	);
}

export { Log };
