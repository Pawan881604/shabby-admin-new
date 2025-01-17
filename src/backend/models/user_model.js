const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const userCountModel = require("./CountModel");
// const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: null,
  },
  uuid: {
    type: String,
    default: null,
  },
  phone_number: {
    type: String,
    default: null,
  },
  branch: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: 'Active',
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: "user",
  },
  is_verified: {
    type: String,
    default: "Inactive",
  },
  authorize:{
    type: String,
    default: "No",
  },
  update_at: {
    type: Date,
    default: null,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWTSECRET, {
    expiresIn: process.env.JWT_EXPIRETIME,
  });
};

// //---------compare password

userSchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model("User", userSchema);
