import { RecommendationResponse } from '@blinkit/types';
interface RecommendationModalProps {
    isOpen: boolean;
    data: RecommendationResponse | null;
    loading: boolean;
    error: string | null;
    triggerProduct: string | null;
    onClose: () => void;
    onAddToCart?: (productName: string) => void;
}
export declare function RecommendationModal({ isOpen, data, loading, error, triggerProduct, onClose, onAddToCart, }: RecommendationModalProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=RecommendationModal.d.ts.map