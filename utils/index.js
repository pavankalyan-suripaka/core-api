import Counter from "../model/counter.model.js";

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
            throw new Error(`Missing mandatory value of "${key}"`);
        }
    }
}

// export const response = {
//     end: (res, payload, data = null) => {
//         return res.status(payload.status).json({
//             id: payload.id,
//             success: true,
//             message: payload.message,
//             data
//         })
//     },
//     error: (res, payload, error) => {
//         return res.status(payload.status).json({
//             id: payload.id,
//             success: false,
//             message: payload.message,
//             error
//         })
//     }
// }

// global.response = response;