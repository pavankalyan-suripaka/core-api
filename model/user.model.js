import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },   // Custom sequential user ID
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    role: { type: String, enum: ["farmer", "buyer", "admin"] },
    phone: { type: String, require: true },
    address: { type: String, require: true },
    verified: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

const User = mongoose.model("User", UserSchema);

export default User;