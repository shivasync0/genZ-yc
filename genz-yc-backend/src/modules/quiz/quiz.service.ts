import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface QuizSubmitPayload {
  problemStatement: string;
  whyYou: string;
  unfairAdvantage: string;
  buildApproach: 'fast' | 'perfect';
  equitySplit: 'equal' | 'merit' | 'flexible' | 'uncertain';
  riskTolerance: number;
  startupsInterested: string[];
}

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  /**
   * Submit quiz response and calculate compatibility score
   */
  async submitQuizResponse(
    userId: string,
    payload: QuizSubmitPayload,
  ) {
    // Calculate a simple compatibility score based on responses
    const compatibilityScore = this.calculateCompatibilityScore(payload);

    // Store the quiz response
    const quizResponse = await this.prisma.quizResponse.upsert({
      where: { userId },
      update: {
        problemStatement: payload.problemStatement,
        whyYou: payload.whyYou,
        unfairAdvantage: payload.unfairAdvantage,
        buildApproach: payload.buildApproach,
        equitySplit: payload.equitySplit,
        riskTolerance: payload.riskTolerance,
        startupsInterested: JSON.stringify(payload.startupsInterested),
        compatibilityScore,
      },
      create: {
        userId,
        problemStatement: payload.problemStatement,
        whyYou: payload.whyYou,
        unfairAdvantage: payload.unfairAdvantage,
        buildApproach: payload.buildApproach,
        equitySplit: payload.equitySplit,
        riskTolerance: payload.riskTolerance,
        startupsInterested: JSON.stringify(payload.startupsInterested),
        compatibilityScore,
      },
    });

    // Update user's builder score
    await this.prisma.user.update({
      where: { id: userId },
      data: { builderScore: compatibilityScore },
    });

    return {
      success: true,
      message: 'Quiz submitted successfully',
      compatibilityScore,
      quizId: quizResponse.id,
    };
  }

  /**
   * Get quiz response for a user
   */
  async getQuizResponse(userId: string) {
    const quizResponse = await this.prisma.quizResponse.findUnique({
      where: { userId },
    });

    if (!quizResponse) {
      return null;
    }

    return {
      ...quizResponse,
      startupsInterested: JSON.parse(quizResponse.startupsInterested),
    };
  }

  /**
   * Find compatible founders based on quiz responses
   */
  async findCompatibleFounders(userId: string, limit: number = 5) {
    const userQuiz = await this.getQuizResponse(userId);

    if (!userQuiz) {
      return [];
    }

    // Get all other users' quiz responses
    const allQuizzes = await this.prisma.quizResponse.findMany({
      where: {
        userId: {
          not: userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            bio: true,
          },
        },
      },
    });

    // Calculate compatibility scores
    const compatibilityResults = allQuizzes
      .map((quiz) => {
        const score = this.calculateMatchScore(userQuiz, quiz);
        return {
          userId: quiz.user.id,
          userEmail: quiz.user.email,
          username: quiz.user.username,
          bio: quiz.user.bio,
          compatibilityScore: score,
          quizData: {
            problemStatement: quiz.problemStatement,
            buildApproach: quiz.buildApproach,
            riskTolerance: quiz.riskTolerance,
          },
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);

    return compatibilityResults;
  }

  /**
   * Calculate individual compatibility score (0-100)
   */
  private calculateCompatibilityScore(payload: QuizSubmitPayload): number {
    let score = 50; // Base score

    // Add points for having clear vision and advantages
    if (payload.problemStatement.length > 50) score += 10;
    if (payload.whyYou.length > 50) score += 10;
    if (payload.unfairAdvantage.length > 50) score += 10;

    // Add points for decisive approach
    if (payload.buildApproach === 'fast') score += 10;
    if (payload.equitySplit !== 'uncertain') score += 5;

    // Moderate risk tolerance is valued
    const riskBalance = Math.abs(payload.riskTolerance - 5);
    if (riskBalance < 3) score += 5;

    // Having clear startup interests is valuable
    if (payload.startupsInterested.length > 0) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Calculate match score between two founders (0-100)
   */
  private calculateMatchScore(userQuiz1: any, userQuiz2: any): number {
    let score = 50; // Base match score

    // Compare risk tolerance (higher compatibility if similar but not identical)
    const riskDiff = Math.abs(userQuiz1.riskTolerance - userQuiz2.riskTolerance);
    if (riskDiff <= 2) score += 20;
    else if (riskDiff <= 4) score += 10;

    // Build approach compatibility (complementary approaches can work well)
    if (userQuiz1.buildApproach !== userQuiz2.buildApproach) {
      score += 15; // Complementary approaches
    } else {
      score += 8; // Same approach
    }

    // Equity split philosophy
    if (
      userQuiz1.equitySplit === userQuiz2.equitySplit ||
      (userQuiz1.equitySplit === 'flexible' || userQuiz2.equitySplit === 'flexible')
    ) {
      score += 10;
    }

    // Startup interests overlap
    const interests1 = JSON.parse(userQuiz1.startupsInterested);
    const interests2 = JSON.parse(userQuiz2.startupsInterested);
    const commonInterests = interests1.filter((i) => interests2.includes(i));
    if (commonInterests.length > 0) {
      score += Math.min(10, commonInterests.length * 3);
    }

    // Combined builder scores
    const avgBuilderScore = (userQuiz1.compatibilityScore + userQuiz2.compatibilityScore) / 2;
    if (avgBuilderScore > 70) score += 10;
    else if (avgBuilderScore > 50) score += 5;

    return Math.min(score, 100);
  }
}
