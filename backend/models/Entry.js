const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  albumTitle: { type: String, required: true },
  artist:     { type: String, required: true },
  artworkUrl: { type: String },
  genre:      { type: String },
  itunesId:   { type: String },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  notes: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Entry', entrySchema)