/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvarianError');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
    constructor() {
        // eslint-disable-next-line no-underscore-dangle
        this._notes = [];
    }

    addNote({ title, body, tags }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newNote = {
            id, title, body, tags, createdAt, updatedAt
        };

        // eslint-disable-next-line no-underscore-dangle
        this._notes.push(newNote);

        // eslint-disable-next-line no-underscore-dangle
        const isSuccess = this._notes.filter((note) => note.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Gagal menambahkan catatan');
        }

        return id;
    }

    getNote() {
        // eslint-disable-next-line no-underscore-dangle
        return this._notes;
    }

    getNoteById(id) {
        // eslint-disable-next-line no-underscore-dangle
        const note = this._notes.filter((n) => n.id === id);

        if (!note) {
            throw new NotFoundError('Catatan tidak ditemukan');
        }

        return note;
    }

    getEditedNote(id, { title, tags, body }) {
    
        // eslint-disable-next-line no-underscore-dangle
        const index = this._notes.findIndex((note) => note.id === id);

        if (index === -1) {
            throw new NotFoundError('Gagal memperbaruhi catatan, ID tidak ditemukan');
        }

        const updatedAt = new Date().toISOString();

        // eslint-disable-next-line no-underscore-dangle
        this._notes[index] = {
            // eslint-disable-next-line no-underscore-dangle
            ...this._notes[index], title, tags, body, updatedAt
        };
    }

    deletedNote(id) {
        // eslint-disable-next-line no-underscore-dangle
        const index = this._notes.findIndex((note) => note.id === id);

        if (index === -1) {
            throw new NotFoundError('Gagal memperbaruhi catatan, ID tidak ditemukan');
        }

        // eslint-disable-next-line no-underscore-dangle
        this._notes.splice(index, 1);
    }
}

module.exports = NotesService;
