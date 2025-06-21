import express from 'express';
import { config } from 'dotenv';
import routes from './routes/index.js';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middlewares/appLogger.js';
import responseMiddleware from './middlewares/response.middlewear.js';
import { Server } from 'socket.io';
import http from "http";

const app = express();
config();

app.use(express.json());
app.use(helmet());
app.use(responseMiddleware);
// app.use(requestLogger);

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);   // Allow requests from allowed origins
        } else {
            callback(new Error("Not allowed by CORS"))  //  Block unknown origins
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow only needed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Restrict headers
    credentials: true, // Allow cookies & authentication headers
    optionsSuccessStatus: 200 // Ensure compatibility with legacy browsers
}

app.use(cors(corsOptions));

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));


app.use("/api", routes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

global.io = io;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App is running on port:${PORT}`));