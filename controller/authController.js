import { generateAccessToken, validateInput } from "../utils/index.js";
import { registerUserService, userLoginService } from "../service/authService.js";
import { responseObj } from "../config/responseMesseges.js";
import jwt from "jsonwebtoken";
import { uploadFileS3 } from "../uploads/upload.js";
import fs from "fs";

export const registerUser = async (req, res) => {
    try {
        appLogger.info("authController: registerUser - Start", { userEmail: req.body.email });
        const { name, email, password, phone, role, address } = req.body;

        await validateInput({ name, email, password });

        const user = await registerUserService({ name, email, password, phone, role, address });
        return res.success(responseObj.USER_REGISTERED_SUCCESSFULLY, user);
    } catch (error) {
        appLogger.error(`authController: registerUser - Error`, {
            message: error?.message,
            stack: error?.stack,
        });
        return res.error(responseObj.INTERNAL_SERVER_ERROR, error.message);
    } finally {
        appLogger.info("authController: registerUser - End");
    }
}

export const userLogin = async (req, res) => {
    try {
        appLogger.info("authController: userLogin - Start", { userEmail: req.body.email });
        const { email, password } = req.body;
        await validateInput({ email, password });
        const { isLoggedIn, accessToken, refreshToken } = await userLoginService({ email, password });
        if (isLoggedIn) {
            return res.success(responseObj.USER_LOGGED_IN_SUCCESSFULLY, { isLoggedIn, accessToken, refreshToken });
        } else {
            return res.success(responseObj.INVALID_USER_LOGIN_CREDS, "Invalid email or password");
        }
    } catch (error) {
        appLogger.error(`authController: userLogin - Error`, {
            message: error?.message,
            stack: error?.stack,
        });
        return res.error(responseObj.INTERNAL_SERVER_ERROR, error.message);
    } finally {
        appLogger.info("authController: userLogin - End");
    }
}

export const refreshToken = async (req, res) => {
    try {
        appLogger.info("authController: refreshToken - Start");
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.error(responseObj.REFRESH_TOKEN_REQUIRED);
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = generateAccessToken({ _id: decoded.userId })
        return res.success(responseObj.TOKEN_GENERATED_SUCCESSFULLY, { accessToken: newAccessToken });

    } catch (error) {
        appLogger.error(`authController: refreshToken - Error`, {
            message: error?.message,
            stack: error?.stack,
        });
        return res.error(responseObj.INTERNAL_SERVER_ERROR, error.message);
    }
}

export const uploadDocument = async (req, res) => {
    try {
        appLogger.info("authController: refreshToken - Start");
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Please upload file"
            })
        }

        const result = await uploadFileS3(file);
        // Delete local file after upload
        fs.unlinkSync(file.path);
        return res.success(responseObj.FILE_UPLOADED_SUCCESSFULLY, { url: result?.location });
    } catch (error) {
        appLogger.error(`authController: uploadDocument - Error`, {
            message: error?.message,
            stack: error?.stack,
        });
        return res.error(responseObj.INTERNAL_SERVER_ERROR, error.message);
    }
}