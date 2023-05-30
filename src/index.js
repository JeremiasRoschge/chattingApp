import app from "./app.js";
import { createServer } from 'http';
import initWb from './websocket.js';

const httpServer = createServer(app);

// Start the application server
httpServer.listen(3000, () => {
  console.log('Servidor de la aplicación en ejecución en el puerto 3000');
});

initWb(httpServer)
