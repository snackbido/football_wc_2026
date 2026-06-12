"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BetSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    predictedWinner: {
        type: String,
        enum: ["HOME", "AWAY", "DRAW"],
        required: true,
    },
    predictedScore: {
        home: { type: Number, required: true },
        away: { type: Number, required: true },
    },
    betAmount: {
        type: Number,
        required: true,
        min: [5000, "Mức cược tối thiểu là 5.000đ"],
        max: [50000, "Mức cược tối đa là 50.000đ"],
    },
    betTime: {
        type: Date,
        default: Date.now,
    },
});
const MatchSchema = new mongoose_1.Schema({
    apiMatchId: {
        type: Number,
        required: true,
        unique: true,
    },
    homeTeam: {
        name: { type: String, required: true },
        logo: { type: String, default: "" },
    },
    awayTeam: {
        name: { type: String, required: true },
        logo: { type: String, default: "" },
    },
    matchTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: "SCHEDULED",
    },
    realScore: {
        home: { type: Number, default: null },
        away: { type: Number, default: null },
    },
    aiAnalysis: {
        type: String,
        default: null,
    },
    bets: [BetSchema],
    stats: {
        totalBetsHome: { type: Number, default: 0 },
        totalBetsAway: { type: Number, default: 0 },
        totalBetsDraw: { type: Number, default: 0 },
        totalPoolMoney: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});
exports.Match = mongoose_1.default.models.Match || mongoose_1.default.model("Match", MatchSchema);
