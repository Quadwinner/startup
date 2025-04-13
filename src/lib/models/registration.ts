import mongoose from 'mongoose';

// Define Registration schema
const RegistrationSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: [true, 'Tournament ID is required'],
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    teamLeader: {
      name: {
        type: String,
        required: [true, 'Team leader name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Team leader email is required'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email',
        ],
      },
      phone: {
        type: String,
        required: [true, 'Team leader phone is required'],
      },
      gameId: {
        type: String,
        required: [true, 'Game ID is required'],
      },
    },
    members: {
      type: [
        {
          name: {
            type: String,
            required: [true, 'Member name is required'],
          },
          email: {
            type: String,
            required: [true, 'Member email is required'],
            match: [
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              'Please provide a valid email',
            ],
          },
          gameId: {
            type: String,
            required: [true, 'Game ID is required'],
          },
        },
      ],
      validate: [
        function(members) {
          // This validation ensures members array length is appropriate for the tournament's team size
          // Will need to be checked in the API layer since we can't access the tournament data here
          return true;
        },
        'Team must have the correct number of members',
      ],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'free', 'other'],
      default: 'upi',
    },
    transactionId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
    agreedToTerms: {
      type: Boolean,
      required: [true, 'You must agree to the terms and conditions'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the Registration model
const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

export default Registration; 