import { Recommendation } from '@blinkit/types';
import { RecommendationsRepository } from './recommendations.repository';
export declare class RecommendationsService {
    private readonly repository;
    constructor(repository: RecommendationsRepository);
    getRecommendations(itemName: string): Promise<Recommendation[]>;
}
//# sourceMappingURL=recommendations.service.d.ts.map