import { Module } from '@nestjs/common';
import { AiScoringService } from './modules/ai-scoring/ai-scoring.service';
import { ChatGateway } from './modules/chat/chat.gateway';

// This is a placeholder module to bootstrap the application.
// In a full implementation, you would import AuthModule, MatchingModule, PrismaModule, etc.

@Module({
  imports: [],
  controllers: [],
  providers: [AiScoringService, ChatGateway],
})
export class AppModule {}
