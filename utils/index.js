import Counter from "../model/counter.model.js";
import jwt from "jsonwebtoken";
import multer from "multer"

export const generateSequentialUserId = async () => {
    const counter = await Counter.findByIdAndUpdate(
        { _id: "userId" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true, returnDocument: "after" }
    );

    return counter.sequence_value;
}

export const validateInput = async (fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
            const error = new Error(`Missing mandatory value of "${key}"`)
            error.statusCode = 400;
            throw error;
        }
    }
}

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user?._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15min" })
}

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" })
}

// Multer disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type!'), false);
        }
    },
});