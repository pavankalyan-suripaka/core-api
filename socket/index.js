import Conversation from "../model/conversation.model";

export const socketInit = (server) => {
    io.on("connection", (socket) => {
        console.log(`User is connected: ${socket.id}`);

        // Join room
        socket.on("join_conversation", async ({conversationId, userId}) => {
            const conversation = await Conversation.findById({ conversationId })
            if (!conversation) return;

            socket.join(conversationId);
            io.to(conversationId).emit("user_joined", {
                socketId: socket.id,
                userId,
                conversationType: conversation.type
            });
        });

        // send message
        socket.on("send_message", ({conversationId, message})=>{
            io.to(conversationId).emit("recieve_message", message);
        });

        // delete message
        socket.on("exit_conversation", ({conversationId, userId})=>{
            socket.leave(conversationId);
            io.to(conversationId).emit("user_left", {userId})
        });

        socket.on("diconnect", ()=>{
            console.log("Disconnected:", socket.id);
        })
    })
}