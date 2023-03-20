const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  user: [
    {
      id: {
        type: Number,
      },
      name: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Album", albumSchema);
