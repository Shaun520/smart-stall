import { Module } from '@nestjs/common';
import { WebSocketService } from './websocket.service';
import { EnhancedWebSocketGateway } from './websocket.gateway';

@Module({
  providers: [WebSocketService, EnhancedWebSocketGateway],
  exports: [WebSocketService],
})
export class WebsocketModule {}
