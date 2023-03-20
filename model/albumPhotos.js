const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  albumId: {
    type: Number,
  },
  id: {
    type: Number,
    // required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  url: {
    type: String,
    // required: true
  },
  thumbnailUrl: {
    type: String,
    // required: true
  },
});

module.exports = mongoose.model("Photo", PhotoSchema);
