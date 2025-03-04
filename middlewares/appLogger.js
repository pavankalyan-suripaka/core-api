import { format, transports, createLogger } from "winston";
import "winston-daily-rotate-file"
import { config } from "dotenv";
config();

const LOG_LEVEL = process.env.LOG_LEVEL || "info"
const ENABLE_LOGS = process.env.ENABLE_LOGS?.toLowerCase() === "true";

// Format logs (mask sensitive data if needed)
const maskSensitiveData = (message) => {
    return message.replace(/(password|apiKey|token)=\S+/gi, "$1=***");
}

// Define log format
// const logFormat = format.combine(
//     format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
//     format.printf(({ timestamp, level, message, stack }) => {
//         const maskedMessage = maskSensitiveData(message);
//         return stack
//             ? `${timestamp} [${level.toUpperCase()}]: ${maskedMessage} - stackTrace: ${stack ? stack : "No stack trace available"}`
//             : `${timestamp} [${level.toUpperCase()}]: ${maskedMessage}`
//     })
// );

const logFormat = format.combine(
    format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    format.printf(({ timestamp, level, message, stack, ...metadata }) => {
        const maskedMessage = maskSensitiveData(message);
        let metaString = "";

        if (Object.keys(metadata).length) {
            metaString = ` | Metadata: ${JSON.stringify(metadata)}`;
        }

        return stack
            ? `${timestamp} [${level.toUpperCase()}]: ${maskedMessage} - stackTrace: ${stack}`
            : `${timestamp} [${level.toUpperCase()}]: ${maskedMessage}${metaString}`;
    })
);


// Generate log file & Rotate logs daily
const dailyRotateFileTransfer = new transports.DailyRotateFile({
    filename: "logs/app-%DATE%.log",  // Log file name pattern
    datePattern: "DD-MM-YYYY",        // Log rotation occurs daily
    maxSize: "20m",                   // Max file size per log file is 20MB
    maxFiles: "14d",                  // Keep logs for 14 days, then delete old ones
    zippedArchive: true,              // Compress old logs to save space
});

// Always provide at least one transport
const transportsList = [];
if (ENABLE_LOGS) {
    transportsList.push(
        new transports.Console(),
        dailyRotateFileTransfer
    )
} else {
    transportsList.push(new transports.Console({ silent: true }));
}

// Create Winston Logger
export const logger = createLogger({
    level: LOG_LEVEL,
    format: logFormat,
    transports: transportsList
});

// Ensure `appLogger` is globally available
global.appLogger = logger;

// Express request logger middleware
export const requestLogger = (req, res, next) => {
    if (!ENABLE_LOGS) {
        // Skip logging if disabled
        console.log("Request Logger Disabled");
        return next();
    }

    const startTime = Date.now();   // Track request time
    logger.info(`Request: ${req.method} ${req.url} - IP: ${req.ip}`);

    res.on('finish', () => {
        const elapsedTime = Date.now() - startTime;
        logger.info(`Response: ${req.method} ${req.url} - ${res.statusCode} - ${elapsedTime}ms`);
    });

    next();
}