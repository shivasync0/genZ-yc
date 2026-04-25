import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  // Assuming Redis Service is injected for production
  // constructor(private redisService: RedisService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinMatch')
  handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { matchId: string }
  ) {
    client.join(payload.matchId);
    this.logger.log(`Client ${client.id} joined match ${payload.matchId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { matchId: string; senderId: string; text: string }
  ) {
    // 1. Save to DB (Prisma)
    // await this.prisma.message.create({ data: payload });
    
    // 2. Broadcast to room
    this.server.to(payload.matchId).emit('newMessage', payload);
    
    // 3. Publish to Redis (if scaling)
    // await this.redisService.publish('chat', JSON.stringify(payload));
  }
}
