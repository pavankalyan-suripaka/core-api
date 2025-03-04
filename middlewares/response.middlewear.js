const responseMiddleware = (req, res, next) => {
    res.success = (payload, data = null) => {
        res.status(payload.status).json({
            id: payload.id,
            success: true,
            message: payload.message,
            data
        });
    };

    res.error = (payload, error = "An unexpected error occurred") => {
        res.status(payload.status).json({
            id: payload.id,
            success: false,
            message: payload.message,
            error
        });
    };

    next();
};

export default responseMiddleware;
