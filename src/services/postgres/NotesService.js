/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapToDBModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class NotesService {
  constructor(collaborationService) {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addNote({
    title, tags, body, owner,
  }) {
    const id = nanoid(16);
    // eslint-disable-next-line camelcase
    const createdAt = new Date().toISOString();
    // eslint-disable-next-line camelcase
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes (id, title, tags, body, created_At, updated_At, owner) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      // eslint-disable-next-line camelcase
      values: [id, title, tags, body, createdAt, updatedAt, owner],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getNote(owner) {
    // eslint-disable-next-line no-underscore-dangle
    const query = {
      text: `SELECT notes.* FROM notes
    LEFT JOIN collaborations ON collaborations.note_id = notes.id
    WHERE notes.owner = $1 OR collaborations.user_id = $1
    GROUP BY notes.id`,
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapToDBModel);
  }

  async getNoteById(id) {
    const query = {
      text: `SELECT notes.*, users.username
    FROM notes
    LEFT JOIN users ON users.id = notes.owner
    WHERE notes.id = $1`,
      values: [id],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Catatan tidak ditemukan');
    }

    return result.rows.map(mapToDBModel)[0];
  }

  async editedNotes(id, { title, tags, body }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE notes SET title = $1, tags = $2, body = $3, updated_At = $4 WHERE id = $5 RETURNING id',
      values: [title, tags, body, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal memperbarui catatan, ID tidak ditemukan');
    }
  }

  async deletedById(id) {
    const query = {
      text: 'DELETE from notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal menghapus catatan, ID tidak ditemukan');
    }
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes  WHERE id = $1',
      values: [id],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses');
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = { NotesService };
