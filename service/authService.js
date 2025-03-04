import bcrypt from "bcryptjs";
import { createUser, findUser } from "../repositories/authRepo.js";
import { generateSequentialUserId } from "../utils/index.js";
import jwt from "jsonwebtoken"

export const registerUserService = async (userData) => {
    try {
        appLogger.info("authService: registerUserService - Start");
        const existingUser = await findUser({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const userId = await generateSequentialUserId();
        userData.password = await bcrypt.hash(userData.password, 10);
        const user = await createUser({ ...userData, userId });
        return { name: user?.name, email: user?.email }

    } catch (error) {
        throw error;
    } finally {
        appLogger.info("authService: registerUserService - End");
    }
}

export const userLoginService = async (userData) => {
    try {
        appLogger.info("authService: userLoginService - Start");
        const existingUser = await findUser({ email: userData.email });
        if (!existingUser) {
            return { isLoggedIn: false, token: null };
        }
        const isPasswordCorrect = await bcrypt.compare(userData?.password, existingUser?.password);
        if (!isPasswordCorrect) {
            return { isLoggedIn: false, token: null };
        }
        const token = jwt.sign({ userId: existingUser.userId, email: existingUser.email }, process.env.SECRET_KEY, { expiresIn: '1d' })
        return { isLoggedIn: true, token }
    } catch (error) {
        throw error;
    } finally {
        appLogger.info("authService: userLoginService - End");
    }
}