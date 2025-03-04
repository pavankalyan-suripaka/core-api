import { validateInput } from "../utils/index.js";
import { registerUserService, userLoginService } from "../service/authService.js";
import { responseObj } from "../config/responseMesseges.js";

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
        const { isLoggedIn, token } = await userLoginService({ email, password });
        if (isLoggedIn) {
            return res.success(responseObj.USER_LOGGED_IN_SUCCESSFULLY, { token });
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