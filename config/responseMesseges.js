export const statusCodes = {
    // Success Codes
    OK: 200, // Standard success response
    CREATED: 201, // Resource successfully created
    ACCEPTED: 202, // Request accepted for processing
    NO_CONTENT: 204, // Success, but no content to return

    // Client Error Codes
    BAD_REQUEST: 400, // Invalid request format
    UNAUTHORIZED: 401, // Authentication required
    FORBIDDEN: 403, // Insufficient permissions
    NOT_FOUND: 404, // Resource not found
    CONFLICT: 409, // Conflict in the request (e.g., duplicate entry)
    UNPROCESSABLE_ENTITY: 422, // Validation errors

    // Server Error Codes
    INTERNAL_SERVER_ERROR: 500, // General server error
    NOT_IMPLEMENTED: 501, // Feature not implemented
    BAD_GATEWAY: 502, // Invalid response from an upstream server
    SERVICE_UNAVAILABLE: 503, // Server is unavailable
    GATEWAY_TIMEOUT: 504 // Upstream server timeout
};

export const responseObj = {
    USER_REGISTERED_SUCCESSFULLY: {
        id: "01",
        status: statusCodes.CREATED,
        message: "User registered successfully"
    },
    INTERNAL_SERVER_ERROR: {
        id: "02",
        status: statusCodes.INTERNAL_SERVER_ERROR,
        message: "Internal server error"
    },
    USER_LOGGED_IN_SUCCESSFULLY: {
        id: "03",
        status: statusCodes.OK,
        message: "User logged in successfully"
    },
    INVALID_USER_LOGIN_CREDS: {
        id: "04",
        status: statusCodes.UNAUTHORIZED,
        message: "Invalid username and password"
    },
    REFRESH_TOKEN_REQUIRED: {
        id: "04",
        status: statusCodes.UNAUTHORIZED,
        message: "Refresh token required"
    },
    TOKEN_GENERATED_SUCCESSFULLY: {
        id: "04",
        status: statusCodes.UNAUTHORIZED,
        message: "Token generated successfully"
    },
    FILE_UPLOADED_SUCCESSFULLY: {
        id: "05",
        status: statusCodes.OK,
        message: "File uploaded successfully"
    }
}