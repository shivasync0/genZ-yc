import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtGuard } from '../auth/jwt.guard';

interface QuizSubmitPayload {
  problemStatement: string;
  whyYou: string;
  unfairAdvantage: string;
  buildApproach: 'fast' | 'perfect';
  equitySplit: 'equal' | 'merit' | 'flexible' | 'uncertain';
  riskTolerance: number;
  startupsInterested: string[];
}

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  /**
   * Submit founder compatibility quiz
   * POST /quiz/submit
   */
  @Post('submit')
  @UseGuards(JwtGuard)
  async submitQuiz(
    @Request() req: any,
    @Body() payload: QuizSubmitPayload,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    // Validate payload
    this.validateQuizPayload(payload);

    try {
      const result = await this.quizService.submitQuizResponse(userId, payload);
      return result;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to submit quiz',
      );
    }
  }

  /**
   * Get current user's quiz response
   * GET /quiz/my-response
   */
  @Get('my-response')
  @UseGuards(JwtGuard)
  async getMyQuizResponse(@Request() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const quizResponse = await this.quizService.getQuizResponse(userId);

    if (!quizResponse) {
      return { message: 'No quiz response found' };
    }

    return quizResponse;
  }

  /**
   * Find compatible co-founders
   * GET /quiz/matches
   */
  @Get('matches')
  @UseGuards(JwtGuard)
  async findMatches(@Request() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const matches = await this.quizService.findCompatibleFounders(userId);
    return {
      success: true,
      matches,
      count: matches.length,
    };
  }

  /**
   * Validate quiz submission payload
   */
  private validateQuizPayload(payload: QuizSubmitPayload) {
    if (!payload.problemStatement || payload.problemStatement.trim().length < 10) {
      throw new BadRequestException(
        'Problem statement must be at least 10 characters',
      );
    }

    if (!payload.whyYou || payload.whyYou.trim().length < 10) {
      throw new BadRequestException('Why you must be at least 10 characters');
    }

    if (!payload.unfairAdvantage || payload.unfairAdvantage.trim().length < 10) {
      throw new BadRequestException(
        'Unfair advantage must be at least 10 characters',
      );
    }

    if (!['fast', 'perfect'].includes(payload.buildApproach)) {
      throw new BadRequestException(
        'Invalid build approach. Must be "fast" or "perfect"',
      );
    }

    if (
      !['equal', 'merit', 'flexible', 'uncertain'].includes(payload.equitySplit)
    ) {
      throw new BadRequestException(
        'Invalid equity split. Must be one of: equal, merit, flexible, uncertain',
      );
    }

    if (
      typeof payload.riskTolerance !== 'number' ||
      payload.riskTolerance < 1 ||
      payload.riskTolerance > 10
    ) {
      throw new BadRequestException(
        'Risk tolerance must be a number between 1 and 10',
      );
    }

    if (
      !Array.isArray(payload.startupsInterested) ||
      payload.startupsInterested.length === 0
    ) {
      throw new BadRequestException(
        'Must select at least one startup interest',
      );
    }

    const validCategories = ['AI', 'SaaS', 'D2C', 'Fintech', 'Hardware', 'Climate', 'HealthTech'];
    const invalidCategories = payload.startupsInterested.filter(
      (cat) => !validCategories.includes(cat),
    );

    if (invalidCategories.length > 0) {
      throw new BadRequestException(
        `Invalid startup categories: ${invalidCategories.join(', ')}`,
      );
    }
  }
}
