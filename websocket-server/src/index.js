import { WebSocketServer } from 'ws'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const wss = new WebSocketServer({ port: 1234 })

console.log('WebSocket server running on ws://localhost:1234')

wss.on('connection', (ws, req) => {
  const roomName = req.url.slice(1) // Remove leading slash
  console.log(`Client connected to room: ${roomName}`)

  // Create a new Yjs document for this room
  const doc = new Y.Doc()
  
  // Create a shared array for storing drawing data
  const drawingArray = doc.getArray('drawing')

  // Set up the WebSocket provider
  const provider = new WebsocketProvider(
    'ws://localhost:1234',
    roomName,
    doc,
    { WebSocketPolyfill: ws }
  )

  ws.on('close', () => {
    console.log(`Client disconnected from room: ${roomName}`)
    provider.destroy()
  })
}) 