const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, minlength: 6 },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    bio: { type: String, maxlength: 500 },
    socialLinks: {
      website: String,
      linkedin: String,
      github: String,
      twitter: String,
    },
    skills: [String],
    oauth: [{ provider: String, providerId: String }],
    refreshToken: { type: String, select: false },
    emailVerifyToken: { type: String, select: false },
    emailVerifyExpires: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: Date,
    // Gamification
    xpPoints: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: Date,
    badges: [{ name: String, awardedAt: Date, icon: String }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip sensitive fields from toJSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerifyToken;
  delete obj.passwordResetToken;
  return obj;
};

// Indexes
UserSchema.index({ role: 1, isBanned: 1 });
UserSchema.index({ name: 'text', email: 'text' });
UserSchema.index({ emailVerifyToken: 1 }, { sparse: true });
UserSchema.index({ passwordResetToken: 1 }, { sparse: true });

module.exports = mongoose.model('User', UserSchema);
