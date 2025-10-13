/* eslint-disable linebreak-style */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  // eslint-disable-next-line class-methods-use-this, no-empty-function
  async AddUser({ username, password, fullname }) {
    // eslint-disable-next-line no-underscore-dangle
    await this.VerifyNewUsername(username);

    const  id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async VerifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user, username sudah digunakan');
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Users tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = { UserService };
