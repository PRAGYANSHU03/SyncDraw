// filepath: c:\Users\pramo\SyncDraw\start-y-websocket.js
import { WebSocketServer } from 'ws'
import { setupWSConnection } from 'y-websocket/server.js'

const port = 1234
const wss = new WebSocketServer({ port })

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req)
})

console.log(`y-websocket server running on ws://localhost:${port}`)