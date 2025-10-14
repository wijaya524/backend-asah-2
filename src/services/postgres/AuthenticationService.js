/* eslint-disable linebreak-style */
const { Pool } = require('pg');

class AuthService {
  constructor() {
    this.pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new Error('Token tidak ditemukan');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE from authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
}

module.exports = { AuthService };
