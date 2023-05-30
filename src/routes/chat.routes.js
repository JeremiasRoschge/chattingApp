import express from "express";
import {
  createChat,
  getCreateChat,
  getChatById,
  getAllChats,
  getMessages,
  getUserById
  //deleteMessage
} from "../controllers/badwords.controller.js";

const router = express.Router();

// Ruta para crear un nuevo chat
router.get("/createChat", getCreateChat);
router.post("/createChat", createChat);

// Ruta para obtener todos los chats
router.get("/", getAllChats);

// Ruta para obtener un chat por su ID y crear un nuevo mensaje en el chat
router.get("/:id", getChatById);
router.get("/messages/:id", getMessages)
router.get('/users/:id', getUserById)
//router.post("/:id/messages", createMessage);

// Ruta para eliminar un mensaje en el chat
//router.delete("/:id/messages/:messageId", deleteMessage);

export default router;