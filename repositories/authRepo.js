import userSchema from "../model/user.model.js"

export const findUser = async (query) => {
    return await userSchema.findOne(query).lean();
}

export const createUser = async (data) => {
    return await userSchema.create(data);
}