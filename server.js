require('dotenv').config();

const { WebSocketServer } = require('ws');

const PORT = process.env.PORT;

const wss = new WebSocketServer({ port: PORT });

// ==================== //
// READYSTATE CODE
// 0:CONNECTIGN
// 1:OPEN (The only state where you can safety .send())
// 2:CLOSING
// 3:CLOSED
// ==================== //

// connetion Event
wss.on('connection', (socket, request) => {
  const ip = request.socket.remoteAddress;
  socket.on('message', (rawData) => {
    const message = rawData.toString();
    console.log({ rawData });

    // เช็คว่ามีเครื่องไหนเชื่อมอยู่ หากมีการเชื่อมต่อกับ Server จะส่งข้อมูลล่าสุดให้ทุกเครื่อง เมื่อข้อข้อมูลมีการเปลี่ยนแปลง
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(`Server Broadcast: ${message}`);
    });
  });

  socket.on('error', (err) => {
    console.log(`Error: ${err.message}: ${ip}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});
console.log(`WebSocket Server is live on wss://localhost:${PORT}`);
