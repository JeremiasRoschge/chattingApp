import { pool } from "../db.js";

const helpers = {
  userCanDeleteMessage: (message) => {
    // Reemplaza 'user.id' con el ID del usuario actual
    return message.user_id === 29;
  }
}


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = "SELECT username FROM message WHERE id = ?";
    const [rows] = await pool.query(query, [id]);

    if (rows.length > 0) {
      const user = rows[0].username;
      res.json({ username: user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC';
    const [rows] = await pool.query(query, [id]);

    res.json({ messages: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


export const getAllChats = async (req, res) => {
  try {
    const query = "SELECT * FROM chats WHERE FIND_IN_SET(?, allowed_users)";
    const userId = req.user.id;
    
    const [rows] = await pool.query(query, userId);

    res.render("chat/allChat", { chats: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chatQuery = "SELECT * FROM chats WHERE id = ? AND FIND_IN_SET(?, allowed_users)";
    const [chatRows] = await pool.query(chatQuery, [id, userId]);

    if (chatRows.length > 0) {
      const chat = chatRows[0];

      const messagesQuery = "SELECT * FROM messages WHERE chat_id = ? AND deleted = 0";
      const [messagesRows] = await pool.query(messagesQuery, [id]);

      const messages = messagesRows || [];

      res.render("chat/chat", { userId, chatName: chat.name, chatId: id, messages });
    } else {
      res.status(404).json({ message: "Chat not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const getCreateChat = async (req, res) => {
  res.render("chat/createChat");
};

export const createChat = async (req, res) => {
  try {
    const { chatName, description, allowedUsers } = req.body;
    const userId = req.user.id;

    const allowedUsernames = allowedUsers.split(",").map(username => username.trim());

    // Obtener los IDs de los usuarios permitidos
    const query = "SELECT id FROM users WHERE username IN (?)";
    const [rows] = await pool.query(query, [allowedUsernames]);
    const allowedUserIds = rows.map((row) => row.id);

    // Agregar el ID del usuario actual a la lista de usuarios permitidos
    allowedUserIds.push(userId);

    const allowedUsersString = allowedUserIds.join(",");

    // Insertar el nuevo chat en la base de datos
    const insertQuery =
      "INSERT INTO chats (name, description, allowed_users) VALUES (?, ?, ?)";
    const result = await pool.query(insertQuery, [
      chatName,
      description,
      allowedUsersString,
    ]);

    const chatId = result.insertId;

    res.render("chat/createChat", { chatId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const getBadWords = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM badwords");

    res.render("chat/chat");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getBadWord = async (req, res) => {
  try {
    const { words } = req.params;
    const [rows] = await pool.query("SELECT * FROM badwords WHERE words = ?", [
      words,
    ]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Bad word not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const checkTextForBadWords = async (req, res) => {
  try {
    const { text } = req.body;

    const words = text.split(" ");

    const query = "SELECT * FROM badwords WHERE words IN (?)";
    const [rows] = await pool.query(query, [words]);

    const badWords = rows.map((row) => row.words);

    res.json({ badWords });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addBadWord = async (req, res) => {
  try {
    const { words } = req.body;

    await pool.query("INSERT INTO badwords (words) VALUES (?)", [words]);

    res.json({ message: "Bad word added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
