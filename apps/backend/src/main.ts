import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { Reflector } from '@nestjs/core';
import { WsAdapter } from './websocket/adapters/ws.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //设置全局的 reflector
  const reflector = app.get(Reflector);
  //设置 API 根前缀
  app.setGlobalPrefix('stall');
  //设置全局拦截器 --- 统一返回结果的格式
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //设置全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 允许跨域请求
  app.enableCors({
    credentials: true,
  });
  // 使用 WebSocket 适配器
  app.useWebSocketAdapter(new WsAdapter(app));
  //启动的端口
  await app.listen(3005);
}

bootstrap().catch((err) => {
  console.error('Failed to start the application:', err);
  process.exit(1);
});
