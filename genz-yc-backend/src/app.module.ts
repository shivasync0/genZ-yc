import { Module } from '@nestjs/common';
import { AiScoringService } from './modules/ai-scoring/ai-scoring.service';
import { AuthModule } from './modules/auth/auth.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { PrismaModule } from './modules/prisma/prisma.module';
import { QuizModule } from './modules/quiz/quiz.module';

// This is a placeholder module to bootstrap the application.
// In a full implementation, you would import AuthModule, MatchingModule, PrismaModule, etc.

@Module({
  imports: [PrismaModule, AuthModule, QuizModule],
  controllers: [],
  providers: [AiScoringService, ChatGateway],
})
export class AppModule {}
