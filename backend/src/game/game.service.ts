import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async pushScore(payload: any) {
    const { userId, opponent_id, user_score, opponent_score } = payload;
    const result = await this.prisma.match_history.create({
      data: {
        userId,
        opponent_id,
        user_score,
        opponent_score,
      },
    });
    return result;
  }
  async updateUserStatisticsData(payload: any) {
    const { userId, games_lost, games_won, games_drawn } = payload;
    return await this.prisma.user.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        games_lost: { increment: games_lost },
        games_won: { increment: games_won },
        games_drawn: { increment: games_drawn },
        games_played: { increment: 1 },
      },
    });
  }
}
