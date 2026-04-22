const router = require('express').Router()

// GET /api/search?q=searchterm
router.get('/', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' })

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=album&limit=12`
    const response = await fetch(url)
    const data = await response.json()

    // Return only the fields we need
    const results = data.results.map(album => ({
      itunesId:   String(album.collectionId),
      albumTitle: album.collectionName,
      artist:     album.artistName,
      artworkUrl: album.artworkUrl100,
      genre:      album.primaryGenreName
    }))

    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router