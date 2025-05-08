// models/mockResponse.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'mock.db'));

// Crear tabla si no existe
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS mock_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      requester_id TEXT NOT NULL,
      response_body TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(path, requester_id)
    )
  `);
});

class MockResponse {
    static getAll(callback) {
        db.all('SELECT * FROM mock_responses ORDER BY path ASC', callback);
    }

    static getByPathAndRequesterId(path, requesterId, callback) {
        db.get(
            'SELECT * FROM mock_responses WHERE path = ? AND requester_id = ?',
            [path, requesterId],
            callback
        );
    }

    static create(path, requesterId, responseBody, callback) {
        const stmt = db.prepare(`
      INSERT INTO mock_responses (path, requester_id, response_body)
      VALUES (?, ?, ?)
    `);

        stmt.run(path, requesterId, responseBody, function (err) {
            callback(err, this.lastID);
        });

        stmt.finalize();
    }

    static update(id, path, requesterId, responseBody, callback) {
        const stmt = db.prepare(`
      UPDATE mock_responses
      SET path = ?, requester_id = ?, response_body = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(path, requesterId, responseBody, id, function (err) {
            callback(err, this.changes);
        });

        stmt.finalize();
    }

    static delete(id, callback) {
        db.run('DELETE FROM mock_responses WHERE id = ?', id, function (err) {
            callback(err, this.changes);
        });
    }

    // Método para cerrar la base de datos (útil para pruebas)
    static closeDatabase() {
        db.close();
    }
}

module.exports = MockResponse;