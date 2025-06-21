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

export const upload = multer({
    dest:"/uploads",  // Temporary local folder
    limits: {fileSize: 10*1024*1024},
    fileFilter:(req, file, cb)=>{
        if(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error("Only document files (PDF/DOC/DOCX) are allowed!", false));
        }
    }
})