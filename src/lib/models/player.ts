import mongoose from 'mongoose';

// Define the Player schema
const PlayerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    displayName: {
      type: String,
      required: [true, 'Please provide a display name'],
    },
    mainGame: {
      type: String,
      enum: ['valorant', 'csgo', 'apexlegends', 'fortnite', 'other'],
      default: 'valorant',
    },
    stats: {
      valorant: {
        rank: String,
        winRate: Number,
        kda: Number,
        headshotPercentage: Number,
        averageScore: Number,
        matches: [
          {
            map: String,
            agent: String,
            result: String, // 'win', 'loss', 'draw'
            score: String,
            kills: Number,
            deaths: Number,
            assists: Number,
            date: Date,
          }
        ],
        agentStats: [
          {
            agent: String,
            class: String, // 'duelist', 'sentinel', 'controller', 'initiator'
            matches: Number,
            winRate: Number,
            averageKDA: Number,
          }
        ]
      },
      csgo: {
        rank: String,
        winRate: Number,
        kda: Number,
        headshotPercentage: Number,
        averageScore: Number,
        matches: [
          {
            map: String,
            result: String,
            score: String,
            kills: Number,
            deaths: Number,
            assists: Number,
            date: Date,
          }
        ]
      }
    },
    profileImage: {
      type: String,
      default: '/images/default-avatar.png',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    winHistory: [Number], // Array of win percentages over time for charting
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema);

export default Player; 