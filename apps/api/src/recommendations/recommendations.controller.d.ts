import type { RecommendationResponse } from '@blinkit/types';
import { RecommendationsService } from './recommendations.service';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    getRecommendations(item?: string): Promise<RecommendationResponse>;
}
//# sourceMappingURL=recommendations.controller.d.ts.map