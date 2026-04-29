<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">MY JOURNAL</h1>
      <span class="entry-count" v-if="entries.length">{{ entries.length }} {{ entries.length === 1 ? 'entry' : 'entries' }}</span>
    </div>

    <p v-if="loading" class="empty">Loading…</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!loading && entries.length === 0" class="empty-state">
      <p>Your journal is empty.</p>
      <router-link to="/search" class="btn" style="display:inline-block; margin-top:12px; text-decoration:none;">
        SEARCH FOR AN ALBUM
      </router-link>
    </div>

    <div v-if="entries.length" class="entry-list">
      <div v-for="entry in entries" :key="entry._id" class="entry-card">
        <img :src="entry.artworkUrl" :alt="entry.albumTitle" class="entry-art" />
        <div class="entry-body">
          <div class="entry-title">{{ entry.albumTitle }}</div>
          <div class="entry-artist">{{ entry.artist }}</div>
          <div class="stars">{{ starDisplay(entry.rating) }}</div>
          <div class="entry-notes" v-if="entry.notes">{{ entry.notes }}</div>
          <div class="entry-date">{{ formatDate(entry.createdAt) }}</div>
        </div>
        <div class="entry-actions">
          <button class="btn small outline" @click="openEdit(entry)">Edit</button>
          <button class="btn small danger" @click="deleteEntry(entry._id)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingEntry" class="modal-overlay" @click.self="closeEdit">
      <div class="modal">
        <h2>EDIT ENTRY</h2>

        <div class="modal-album">
          <img :src="editingEntry.artworkUrl" :alt="editingEntry.albumTitle" class="modal-art" />
          <div>
            <div class="modal-album-title">{{ editingEntry.albumTitle }}</div>
            <div class="modal-album-artist">{{ editingEntry.artist }}</div>
          </div>
        </div>

        <label>Rating</label>
        <div class="star-picker">
          <button
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ filled: n <= editRating }"
            @click="editRating = n"
            type="button"
          >★</button>
        </div>

        <label>Notes</label>
        <textarea v-model="editNotes" rows="3"></textarea>

        <p v-if="editError" class="error">{{ editError }}</p>

        <div class="modal-actions">
          <button class="btn outline" @click="closeEdit">CANCEL</button>
          <button class="btn" @click="saveEdit" :disabled="saving">
            {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'JournalView',
  data() {
    return {
      entries: [],
      loading: true,
      error: '',
      editingEntry: null,
      editRating: 0,
      editNotes: '',
      editError: '',
      saving: false,
    }
  },
  async created() {
    await this.fetchEntries()
  },
  methods: {
    async fetchEntries() {
      this.loading = true
      try {
        const res = await api.get('/entries')
        this.entries = res.data
      } catch (err) {
        this.error = 'Failed to load journal entries'
      } finally {
        this.loading = false
      }
    },

    async deleteEntry(id) {
      if (!confirm('Delete this entry?')) return
      try {
        await api.delete(`/entries/${id}`)
        this.entries = this.entries.filter(e => e._id !== id)
      } catch (err) {
        alert('Failed to delete entry')
      }
    },

    openEdit(entry) {
      this.editingEntry = entry
      this.editRating = entry.rating
      this.editNotes = entry.notes
      this.editError = ''
    },

    closeEdit() {
      this.editingEntry = null
    },

    async saveEdit() {
      if (this.editRating === 0) {
        this.editError = 'Please select a rating'
        return
      }
      this.saving = true
      this.editError = ''
      try {
        const res = await api.put(`/entries/${this.editingEntry._id}`, {
          rating: this.editRating,
          notes: this.editNotes,
        })
        const idx = this.entries.findIndex(e => e._id === this.editingEntry._id)
        if (idx !== -1) this.entries[idx] = res.data
        this.closeEdit()
      } catch (err) {
        this.editError = err.response?.data?.message || 'Failed to save changes'
      } finally {
        this.saving = false
      }
    },

    starDisplay(rating) {
      return '★'.repeat(rating) + '☆'.repeat(5 - rating)
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    },
  },
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 14px;
  letter-spacing: 3px;
  color: #555;
}

.entry-count {
  font-size: 11px;
  color: #aaa;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #aaa;
  font-size: 13px;
}

.entry-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.entry-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: #fff;
  border: 1.5px solid #ccc;
  border-radius: 2px;
  padding: 14px;
}

.entry-art {
  width: 64px;
  height: 64px;
  object-fit: cover;
  flex-shrink: 0;
  background: #ddd;
}

.entry-body {
  flex: 1;
}

.entry-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 2px;
}

.entry-artist {
  font-size: 11px;
  color: #888;
  margin-bottom: 4px;
}

.stars {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.entry-notes {
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-bottom: 4px;
}

.entry-date {
  font-size: 10px;
  color: #aaa;
}

.entry-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
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