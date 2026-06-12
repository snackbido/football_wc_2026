import mongoose, { Schema, Document } from "mongoose";

export interface IBet {
  userId: mongoose.Types.ObjectId;
  predictedWinner: "HOME" | "AWAY" | "DRAW";
  predictedScore: {
    home: number;
    away: number;
  };
  betAmount: number;
  betTime: Date;
}

export interface IMatch extends Document {
  apiMatchId: number;
  homeTeam: {
    name: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    logo: string;
  };
  matchTime: Date;
  status: string;
  realScore: {
    home: number | null;
    away: number | null;
  };
  aiAnalysis: string | null;
  bets: IBet[];
  stats: {
    totalBetsHome: number;
    totalBetsAway: number;
    totalBetsDraw: number;
    totalPoolMoney: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BetSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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

const MatchSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  },
);

export const Match =
  mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
