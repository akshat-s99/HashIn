import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    headline: {
      type: String,
      trim: true,
      default: '',
      maxLength: 100,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    about: {
      type: String,
      trim: true,
      default: '',
      maxLength: 500,
    },
    skills: {
      type: [String],
      default: [],
      index: true, // Important for the discovery engine
    },
    links: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    experience: [{
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      current: { type: Boolean, default: false },
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      fieldOfStudy: String,
      startDate: String,
      endDate: String
    }],
    avatar: {
      type: String,
      default: '',
    },
    refreshTokens: {
      type: [{
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date,
        userAgent: String
      }],
      select: false, // Never exposed in queries by default
    },
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    isDisabled: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 'text', lastName: 'text', headline: 'text', about: 'text' });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
