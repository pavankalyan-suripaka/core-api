import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
        type: String,
        enum: ["owner", "moderator", "member"],
        default: "member"
    },
}, { _id: false });

const conversationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["direct", "group"],
        required: true,
    },
    groupName: {
        type: String,
        required: function () {
            return this.type === "group";
        },
    },
    participants: [participantSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
