// enhanced-websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface ClientInfo {
  id: string;
  userId?: string;
  rooms: Set<string>;
  createdAt: Date;
}

@WebSocketGateway(3001, { path: '/ws' })
export class EnhancedWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients: Map<WebSocket, ClientInfo> = new Map();
  private rooms: Map<string, Set<WebSocket>> = new Map();

  afterInit(server: Server) {
    console.log('WebSocket server initialized on port 3001');

    // 监听原生 WebSocket 消息
    server.on('connection', (client: WebSocket) => {
      // 处理消息
      client.on('message', (data: Buffer) => {
        this.handleRawMessage(client, data);
      });

      // 错误处理
      client.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  // 处理原始消息
  private handleRawMessage(client: WebSocket, data: Buffer) {
    const clientInfo = this.clients.get(client);
    if (!clientInfo) {
      console.log('Client not found in connection map');
      return;
    }

    try {
      const messageStr = data.toString();
      console.log('Raw message received:', messageStr);

      let message: any;
      try {
        message = JSON.parse(messageStr);
      } catch {
        // 如果不是 JSON，当作普通字符串处理
        message = { type: 'message', content: messageStr };
      }

      // 根据消息类型处理
      this.processMessage(client, clientInfo, message);
    } catch (error) {
      console.error('Error processing message:', error);
      this.send(client, {
        type: 'error',
        error: 'Failed to process message',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 处理消息
  private processMessage(
    client: WebSocket,
    clientInfo: ClientInfo,
    message: any,
  ) {
    if (!message.type) {
      // 如果没有 type 字段，使用默认处理
      this.broadcastToRoom('default', 'message', {
        from: clientInfo.id,
        data: message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    switch (message.type) {
      case 'chat':
        this.handleChatMessage(client, clientInfo, message);
        break;
      case 'join_room':
        this.handleJoinRoom(client, message.room);
        break;
      case 'leave_room':
        this.handleLeaveRoom(client, message.room);
        break;
      case 'ping':
        this.handlePing(client);
        break;
      default:
        this.broadcastToRoom('default', 'message', {
          from: clientInfo.id,
          data: message,
          timestamp: new Date().toISOString(),
        });
    }
  }

  // 连接处理
  handleConnection(client: WebSocket) {
    const clientId = uuidv4();
    const clientInfo: ClientInfo = {
      id: clientId,
      rooms: new Set(),
      createdAt: new Date(),
    };

    this.clients.set(client, clientInfo);

    // 发送连接确认
    this.send(client, {
      type: 'connection_established',
      clientId,
      timestamp: new Date().toISOString(),
    });

    console.log(
      `Client connected: ${clientId}, total clients: ${this.clients.size}`,
    );
  }

  // 断开连接处理
  handleDisconnect(client: WebSocket) {
    const clientInfo = this.clients.get(client);
    if (clientInfo) {
      // 从所有房间中移除
      clientInfo.rooms.forEach((room) => {
        this.leaveRoom(client, room);
      });

      this.clients.delete(client);
      console.log(
        `Client disconnected: ${clientInfo.id}, remaining clients: ${this.clients.size}`,
      );
    }
  }

  // 处理聊天消息
  private handleChatMessage(
    client: WebSocket,
    clientInfo: ClientInfo,
    message: any,
  ) {
    const { room, content } = message;

    if (room && clientInfo.rooms.has(room)) {
      // 发送到指定房间
      this.broadcastToRoom(room, 'chat', {
        from: clientInfo.id,
        room,
        content,
        timestamp: new Date().toISOString(),
      });
    } else {
      // 发送给发送者
      this.send(client, {
        type: 'error',
        error: 'Not in room or room not specified',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 处理 ping
  private handlePing(client: WebSocket) {
    this.send(client, {
      type: 'pong',
      timestamp: new Date().toISOString(),
    });
  }

  // 加入房间
  private handleJoinRoom(client: WebSocket, room: string) {
    this.joinRoom(client, room);
  }

  // 离开房间
  private handleLeaveRoom(client: WebSocket, room: string) {
    this.leaveRoom(client, room);
  }

  // 工具方法：加入房间
  joinRoom(client: WebSocket, room: string) {
    const clientInfo = this.clients.get(client);
    if (!clientInfo) {
      console.log('Client not found when joining room');
      return;
    }

    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }

    this.rooms.get(room)?.add(client);
    clientInfo.rooms.add(room);

    this.send(client, {
      type: 'room_joined',
      room,
      clientId: clientInfo.id,
      timestamp: new Date().toISOString(),
    });

    // 通知房间内其他人
    this.broadcastToRoom(
      room,
      'user_joined',
      {
        clientId: clientInfo.id,
        room,
        timestamp: new Date().toISOString(),
      },
      client,
    );
  }

  // 工具方法：离开房间
  leaveRoom(client: WebSocket, room: string) {
    const clientInfo = this.clients.get(client);
    if (!clientInfo || !clientInfo.rooms.has(room)) return;

    this.rooms.get(room)?.delete(client);
    clientInfo.rooms.delete(room);

    // 如果房间为空，删除房间
    if (this.rooms.get(room)?.size === 0) {
      this.rooms.delete(room);
    }

    this.send(client, {
      type: 'room_left',
      room,
      timestamp: new Date().toISOString(),
    });

    // 通知房间内其他人
    this.broadcastToRoom(room, 'user_left', {
      clientId: clientInfo.id,
      room,
      timestamp: new Date().toISOString(),
    });

    console.log(`Client ${clientInfo.id} left room ${room}`);
  }

  // 发送消息到房间
  broadcastToRoom(
    room: string,
    event: string,
    data: any,
    excludeClient?: WebSocket,
  ) {
    const clients = this.rooms.get(room);
    if (!clients) {
      console.log(`Room ${room} not found`);
      return;
    }

    const message = JSON.stringify({
      type: event,
      data,
      timestamp: new Date().toISOString(),
    });

    clients.forEach((client) => {
      if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // 发送消息给客户端
  send(client: WebSocket, data: any) {
    if (client.readyState === WebSocket.OPEN) {
      const message = JSON.stringify(data);
      client.send(message);
    } else {
      console.log('Client not ready, state:', client.readyState);
    }
  }

  // 广播给所有客户端
  broadcast(event: string, data: any, excludeClient?: WebSocket) {
    const message = JSON.stringify({
      type: event,
      data,
      timestamp: new Date().toISOString(),
    });

    this.clients.forEach((clientInfo, client) => {
      if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
