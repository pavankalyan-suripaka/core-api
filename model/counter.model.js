import mongoose from "mongoose";

const ConterSchema = new mongoose.Schema({
    _id: String,
    sequence_value: Number
});

const Counter = mongoose.model("Counter", ConterSchema);

export default Counter;