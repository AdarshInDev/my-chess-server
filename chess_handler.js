function generateRoomId(length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

const handleChessEvents = (io, socket) => {


 socket.on("create_chess_room", async (data) => {
    const { userId, betAmount } = data;
    const roomId = generateRoomId();
    
    const roomData = {
      roomId,
      creatorId: userId,
      betAmount,
      players: [userId],
      status: 'waiting',
      createdAt: new Date()
    };

    socket.join(roomId);
    console.log(`Room created: ${roomId} by user: ${userId}`);
    socket.emit("room_created", roomData);
  });

  socket.on("join_chess_room", (data) => {
    const { roomId, userId } = data;

    socket.join(roomId);
    console.log(`User ${userId} joined room: ${roomId}`);
    io.to(roomId).emit("opponent_joined", { userId });
  });

  socket.on("chess_move", (data) => {
    const { roomId, move } = data;
    socket.to(roomId).emit("opponent_move", move);
  });
};

module.exports = { handleChessEvents };
