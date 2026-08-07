import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { AIModule } from './ai/ai.module';
import { ServiceModule } from './service/service.module';
import { RedisModule } from './redis/redis.module';
import { PosterModule } from './poster/poster.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { InventoryModule } from './inventory/inventory.module';
import { TodoModule } from './todo/todo.module';
import { WebsocketModule } from './websocket/websocket.module';
import { OssController } from './oss/oss.controller';
import { OssModule } from './oss/oss.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //一定要在·MongooseModule.forRoot()前面，否则会报错
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    ),
    UserModule,
    AuthModule,
    UploadModule,
    AIModule,
    ServiceModule,
    RedisModule,
    PosterModule,
    ConversationModule,
    MessageModule,
    InventoryModule,
    TodoModule,
    WebsocketModule,
    OssModule,
  ],
  controllers: [AppController, OssController],
  providers: [AppService],
})
export class AppModule {}
