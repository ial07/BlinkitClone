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
var recommendations_controller_1 = require("../recommendations.controller");
var recommendations_service_1 = require("../recommendations.service");
var common_1 = require("@nestjs/common");
describe('RecommendationsController', function () {
    var controller;
    var mockService;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockService = {
                        getRecommendations: jest.fn().mockImplementation(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (item.toLowerCase() === 'unknown')
                                    return [2 /*return*/, []];
                                return [2 /*return*/, [
                                        { name: 'Sugar', score: 0.7 },
                                        { name: 'Milk', score: 0.5 },
                                        { name: 'Biscuits', score: 0.3 },
                                    ]];
                            });
                        }); }),
                    };
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            controllers: [recommendations_controller_1.RecommendationsController],
                            providers: [
                                { provide: recommendations_service_1.RecommendationsService, useValue: mockService },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    controller = module.get(recommendations_controller_1.RecommendationsController);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return 200 with valid item parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, controller.getRecommendations('Tea Powder')];
                case 1:
                    result = _a.sent();
                    expect(result.item).toBe('Tea Powder');
                    expect(result.recommendations).toHaveLength(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return proper JSON structure', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, controller.getRecommendations('Tea Powder')];
                case 1:
                    result = _a.sent();
                    expect(result).toHaveProperty('item');
                    expect(result).toHaveProperty('recommendations');
                    expect(result.recommendations[0]).toHaveProperty('name');
                    expect(result.recommendations[0]).toHaveProperty('score');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw 400 without item parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(controller.getRecommendations(undefined)).rejects.toThrow(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw 400 with empty item', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(controller.getRecommendations('  ')).rejects.toThrow(common_1.BadRequestException)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return empty recommendations for unknown item', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, controller.getRecommendations('Unknown')];
                case 1:
                    result = _a.sent();
                    expect(result.recommendations).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=recommendations.controller.spec.js.map