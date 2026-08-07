// dtos/message.dto.ts
export class MessageDto {
  event: string;
  data: any;
  timestamp?: string;
}

// interfaces/websocket.interface.ts
export interface WebSocketClient extends WebSocket {
  id?: string;
  userId?: string;
  isAlive?: boolean;
  room?: string;
}
