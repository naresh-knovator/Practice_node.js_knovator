const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    suite: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    geo: {
      lat: {
        type: String,
        required: true,
      },
      lng: {
        type: String,
        required: true,
      },
    },
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  company: {
    name: {
      type: String,
      required: true,
    },
    catchPhrase: {
      type: String,
      required: true,
    },
    bs: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
