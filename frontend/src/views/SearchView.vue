<template>
  <div>
    <h1 class="page-title">SEARCH</h1>

    <div class="search-bar">
      <input
        v-model="query"
        type="text"
        placeholder="Search albums or artists…"
        @keyup.enter="search"
      />
      <button class="btn" @click="search" :disabled="loading">
        {{ loading ? '...' : 'GO' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="results.length" class="album-grid">
      <div v-for="album in results" :key="album.itunesId" class="album-card">
        <img :src="album.artworkUrl" :alt="album.albumTitle" class="album-art" />
        <div class="album-info">
          <div class="album-title">{{ album.albumTitle }}</div>
          <div class="album-artist">{{ album.artist }}</div>
          <div class="album-genre">{{ album.genre }}</div>
          <button class="btn small" @click="openModal(album)">+ Journal</button>
        </div>
      </div>
    </div>

    <p v-if="searched && results.length === 0 && !loading" class="empty">
      No results found. Try a different search.
    </p>

    <!-- Add to Journal Modal -->
    <div v-if="selectedAlbum" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>ADD TO JOURNAL</h2>

        <div class="modal-album">
          <img :src="selectedAlbum.artworkUrl" :alt="selectedAlbum.albumTitle" class="modal-art" />
          <div>
            <div class="modal-album-title">{{ selectedAlbum.albumTitle }}</div>
            <div class="modal-album-artist">{{ selectedAlbum.artist }} · {{ selectedAlbum.genre }}</div>
          </div>
        </div>

        <label>Rating</label>
        <div class="star-picker">
          <button
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ filled: n <= rating }"
            @click="rating = n"
            type="button"
          >★</button>
        </div>

        <label>Notes</label>
        <textarea v-model="notes" rows="3" placeholder="Write something about this album…"></textarea>

        <p v-if="saveError" class="error">{{ saveError }}</p>

        <div class="modal-actions">
          <button class="btn outline" @click="closeModal">CANCEL</button>
          <button class="btn" @click="saveEntry" :disabled="saving">
            {{ saving ? 'SAVING...' : 'SAVE ENTRY' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'SearchView',
  data() {
    return {
      query: '',
      results: [],
      loading: false,
      searched: false,
      error: '',
      selectedAlbum: null,
      rating: 0,
      notes: '',
      saving: false,
      saveError: '',
    }
  },
  methods: {
    async search() {
      if (!this.query.trim()) return
      this.loading = true
      this.error = ''
      this.results = []
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(this.query)}`)
        this.results = res.data
        this.searched = true
      } catch (err) {
        this.error = 'Search failed. Is the backend running?'
      } finally {
        this.loading = false
      }
    },

    openModal(album) {
      this.selectedAlbum = album
      this.rating = 0
      this.notes = ''
      this.saveError = ''
    },

    closeModal() {
      this.selectedAlbum = null
    },

    async saveEntry() {
      if (this.rating === 0) {
        this.saveError = 'Please select a rating'
        return
      }
      this.saving = true
      this.saveError = ''
      try {
        await api.post('/entries', {
          albumTitle: this.selectedAlbum.albumTitle,
          artist: this.selectedAlbum.artist,
          artworkUrl: this.selectedAlbum.artworkUrl,
          genre: this.selectedAlbum.genre,
          itunesId: this.selectedAlbum.itunesId,
          rating: this.rating,
          notes: this.notes,
        })
        this.closeModal()
        this.$router.push('/journal')
      } catch (err) {
        this.saveError = err.response?.data?.message || 'Failed to save entry'
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.page-title {
  font-size: 14px;
  letter-spacing: 3px;
  margin-bottom: 20px;
  color: #555;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 28px;
}

.search-bar input {
  flex: 1;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.album-card {
  border: 1.5px solid #ccc;
  background: #fff;
  border-radius: 2px;
  overflow: hidden;
}

.album-art {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
  background: #ddd;
}

.album-info {
  padding: 10px;
}

.album-title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 2px;
}

.album-artist {
  font-size: 11px;
  color: #888;
  margin-bottom: 2px;
}

.album-genre {
  font-size: 10px;
  color: #aaa;
  margin-bottom: 10px;
}

.empty {
  color: #aaa;
  font-size: 13px;
  margin-top: 20px;
}

/* Modal */
.modal-album {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.modal-art {
  width: 52px;
  height: 52px;
  object-fit: cover;
  flex-shrink: 0;
}

.modal-album-title {
  font-size: 13px;
  font-weight: bold;
}

.modal-album-artist {
  font-size: 11px;
  color: #888;
}

.star-picker {
  display: flex;
  gap: 6px;
  margin: 6px 0 14px;
}

.star {
  background: none;
  border: 1.5px solid #ccc;
  width: 32px;
  height: 32px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 2px;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star.filled {
  background: #333;
  border-color: #333;
  color: #fff;
}
</style>