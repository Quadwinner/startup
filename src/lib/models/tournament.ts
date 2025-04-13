import mongoose from 'mongoose';

// Define Tournament schema
const TournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a tournament name'],
      trim: true,
    },
    game: {
      type: String,
      required: [true, 'Please provide a game name'],
      trim: true,
    },
    gameImage: {
      type: String,
      default: '/images/other-games.jpg',
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please provide a registration deadline'],
    },
    prizePool: {
      type: String,
      required: [true, 'Please provide a prize pool'],
    },
    teamSize: {
      type: Number,
      required: [true, 'Please provide team size'],
    },
    maxTeams: {
      type: Number,
      required: [true, 'Please provide maximum teams'],
    },
    currentTeams: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    rules: {
      type: String,
      required: [true, 'Please provide tournament rules'],
    },
    prizes: {
      type: [
        {
          position: Number,
          reward: String,
        },
      ],
      default: [],
    },
    organizer: {
      name: {
        type: String,
        required: [true, 'Please provide an organizer name'],
      },
      verified: {
        type: Boolean,
        default: false,
      },
      contact: {
        type: String,
        required: [true, 'Please provide organizer contact info'],
      },
    },
    schedule: {
      type: [
        {
          stage: String,
          date: Date,
          details: String,
        },
      ],
      default: [],
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false, 
    },
    streamLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the Tournament model
const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);

export default Tournament; 