import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import type { RecommendationResponse } from '@blinkit/types';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  async getRecommendations(
    @Query('item') item?: string,
  ): Promise<RecommendationResponse> {
    if (!item || item.trim().length === 0) {
      throw new BadRequestException('Query parameter "item" is required');
    }

    const trimmedItem = item.trim();
    const recommendations =
      await this.recommendationsService.getRecommendations(trimmedItem);

    return {
      item: trimmedItem,
      recommendations,
    };
  }
}
