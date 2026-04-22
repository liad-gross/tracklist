const router = require('express').Router()
const Entry = require('../models/Entry')
const authMiddleware = require('../middleware/auth')

// All routes below require a valid JWT
router.use(authMiddleware)

// GET /api/entries — get all entries for the logged-in user
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(entries)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/entries — create a new journal entry
router.post('/', async (req, res) => {
  try {
    const { albumTitle, artist, artworkUrl, genre, itunesId, rating, notes } = req.body

    if (!albumTitle || !artist || !rating)
      return res.status(400).json({ message: 'albumTitle, artist, and rating are required' })

    const entry = await Entry.create({
      userId: req.userId,
      albumTitle,
      artist,
      artworkUrl,
      genre,
      itunesId,
      rating,
      notes
    })

    res.status(201).json(entry)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/entries/:id — update rating and/or notes
router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.userId })
    if (!entry) return res.status(404).json({ message: 'Entry not found' })

    const { rating, notes } = req.body
    if (rating !== undefined) entry.rating = rating
    if (notes !== undefined) entry.notes = notes

    await entry.save()
    res.json(entry)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/entries/:id — delete an entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!entry) return res.status(404).json({ message: 'Entry not found' })

    res.json({ message: 'Entry deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router