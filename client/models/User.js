const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Rank = require("./Rank");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,

  rank: {
    score: {
      type: Number,
      default: 0
    }
  },

  // snapchat: String,
  facebook: String,
  twitter: String,
  google: String,
  github: String,
  // instagram: String,
  linkedin: String,
  // steam: String,
  // quickbooks: String,
  tokens: Array,

  accountType: String,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    profession: String,
    picture: String,
    bio: String,
    profession: String,
    affiliation: String,
    rank: Number
  }
}, {
  timestamps: true
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;