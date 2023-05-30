import { Server } from "socket.io";
import { pool } from "./db.js";

const saveMessageToDatabase = async (chatId, userId, username, message) => {
  try {
    const query = "INSERT INTO messages (chat_id, user_id, username, message) VALUES (?, ?, ?, ?)";
    await pool.query(query, [chatId, userId, username, message]);
    console.log("Mensaje guardado en la base de datos");
  } catch (error) {
    console.error("Error al guardar el mensaje en la base de datos:", error);
  }
};


const initWb = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New WebSocket connection", socket.id);

    socket.on('chat:message', async (data) => {
      io.sockets.emit('chat:message', data);

      const { chatId, userId, message, username } = data;

      console.log(data);
      try {
        // Guardar el mensaje en la base de datos
        await saveMessageToDatabase(chatId, userId, username, message);

        // Envía un mensaje de respuesta a todos los sockets excepto al que envió el mensaje
        socket.broadcast.emit('response', 'Hola, cliente WebSocket');

        // Envía un mensaje de respuesta al socket que envió el mensaje original
        socket.emit('response', 'Hola, cliente WebSocket');
      } catch (error) {
        // Manejar cualquier error en la solicitud de guardado del mensaje
        console.error(error);
      }
    });

    socket.on("chat:typing", (data) => {
      socket.broadcast.emit("chat:typing", data);
    });

    socket.on("chat:loadMessages", (chatId) => {
      const query = "SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC";
      pool.query(query, [chatId], (error, results) => {
        console.log('query', results)
        if (error) {
          console.error("Error al cargar los mensajes desde la base de datos:", error);
        } else {
          io.emit("chat:loadedMessages", { messages: results });
        }
      });
    });
  });
};

export default initWb;
