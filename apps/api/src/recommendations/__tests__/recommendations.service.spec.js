"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@nestjs/testing");
var recommendations_service_1 = require("../recommendations.service");
var recommendations_repository_1 = require("../recommendations.repository");
describe('RecommendationsService', function () {
    var service;
    var mockRepo;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var teaOrders, module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    teaOrders = [
                        { id: '1', items: ['Tea Powder', 'Sugar', 'Milk'] },
                        { id: '2', items: ['Tea Powder', 'Sugar', 'Biscuits'] },
                        { id: '3', items: ['Tea Powder', 'Milk', 'Biscuits'] },
                        { id: '4', items: ['Tea Powder', 'Sugar', 'Milk', 'Biscuits'] },
                        { id: '5', items: ['Tea Powder', 'Sugar'] },
                        { id: '6', items: ['Tea Powder', 'Sugar', 'Milk'] },
                        { id: '7', items: ['Tea Powder', 'Biscuits'] },
                        { id: '8', items: ['Tea Powder', 'Sugar', 'Milk'] },
                        { id: '9', items: ['Tea Powder', 'Milk'] },
                        { id: '10', items: ['Tea Powder', 'Sugar', 'Biscuits'] },
                    ];
                    mockRepo = {
                        getOrdersContaining: jest.fn().mockImplementation(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                            var lower;
                            return __generator(this, function (_a) {
                                lower = item.toLowerCase();
                                if (lower === 'unknown')
                                    return [2 /*return*/, []];
                                if (lower === 'tea powder')
                                    return [2 /*return*/, teaOrders];
                                if (lower === 'single')
                                    return [2 /*return*/, [{ id: '1', items: ['Single', 'Sugar'] }]];
                                // Generic: return orders containing the item
                                return [2 /*return*/, teaOrders.filter(function (o) {
                                        return o.items.some(function (i) { return i.toLowerCase() === lower; });
                                    })];
                            });
                        }); }),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                recommendations_service_1.RecommendationsService,
                                { provide: recommendations_repository_1.RecommendationsRepository, useValue: mockRepo },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(recommendations_service_1.RecommendationsService);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return top 3 recommendations for Tea Powder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getRecommendations('Tea Powder')];
                case 1:
                    result = _a.sent();
                    expect(result).toHaveLength(3);
                    // Sugar appears in 7/10 orders
                    expect(result[0].name).toBe('Sugar');
                    expect(result[0].score).toBe(0.7);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return scores between 0 and 1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, _i, result_1, rec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getRecommendations('Tea Powder')];
                case 1:
                    result = _a.sent();
                    for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                        rec = result_1[_i];
                        expect(rec.score).toBeGreaterThanOrEqual(0);
                        expect(rec.score).toBeLessThanOrEqual(1);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('should sort results by score descending', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getRecommendations('Tea Powder')];
                case 1:
                    result = _a.sent();
                    for (i = 1; i < result.length; i++) {
                        expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return empty array for unknown item', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getRecommendations('Unknown')];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not include the queried item in results', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, _i, result_2, rec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getRecommendations('Tea Powder')];
                case 1:
                    result = _a.sent();
                    for (_i = 0, result_2 = result; _i < result_2.length; _i++) {
                        rec = result_2[_i];
                        expect(rec.name).not.toBe('Tea Powder');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle items with less than 3 co-occurrences', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.getRecommendations('Single')];
                case 1:
                    result = _a.sent();
                    expect(result.length).toBeLessThanOrEqual(3);
                    expect(result.length).toBeGreaterThanOrEqual(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=recommendations.service.spec.js.map