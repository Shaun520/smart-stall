// websocket.service.ts
import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

@Injectable()
export class WebSocketService {
  private clients: Map<string, WebSocket> = new Map();

  // 注册客户端
  registerClient(clientId: string, client: WebSocket) {
    this.clients.set(clientId, client);
  }

  // 注销客户端
  unregisterClient(clientId: string) {
    this.clients.delete(clientId);
  }

  // 发送给特定客户端
  sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  // 广播给所有客户端
  broadcast(message: any, excludeClientId?: string) {
    this.clients.forEach((client, clientId) => {
      if (
        clientId !== excludeClientId &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // 获取所有客户端
  getClients(): string[] {
    return Array.from(this.clients.keys());
  }
}
